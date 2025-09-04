import mongoose from 'mongoose';
import axios from 'axios';
import DrugInfo from './models/DrugInfo.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Map Indian brand names to US generic names for openFDA queries
const drugMap = {
  'paracetamol': 'paracetamol',
  'ibuprofen': 'ibuprofen',
  'aspirin': 'aspirin',
  'cetirizine': 'cetirizine',
  'metformin': 'metformin',
  'atorvastatin': 'atorvastatin',
  'amoxicillin': 'amoxicillin',
  'pantoprazole': 'pantoprazole',
  'levothyroxine': 'levothyroxine',
  'amlodipine': 'amlodipine',
  'losartan': 'losartan',
  'omeprazole': 'omeprazole',
  'dolo 650': 'paracetamol',
  'crocin': 'paracetamol',
  'allegra': 'fexofenadine',
  'azithromycin': 'azithromycin'
};
const drugs = Object.keys(drugMap);

async function fetchDrugData(drug) {
  const generic = drugMap[drug] || drug;
  const searchFields = [
    { field: 'active_ingredient', value: generic },
    { field: 'substance_name', value: generic },
    { field: 'brand_name', value: generic }
  ];
  let res = null;
  let usedField = null;
  const maxRetries = 3;
  for (const { field, value } of searchFields) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const url = `https://api.fda.gov/drug/label.json?search=${field}:${value}&limit=1`;
        res = await axios.get(url);
        usedField = field;
        break;
      } catch (err) {
        attempt++;
        if (err.response && err.response.status === 404) {
          console.log(`No FDA data for ${drug} (generic: ${generic}) using field ${field}`);
          break;
        } else if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
          console.log(`Network error (${err.code}) for ${drug} (generic: ${generic}) using field ${field}, attempt ${attempt}`);
          if (attempt < maxRetries) {
            await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
            continue;
          } else {
            console.log(`Failed to fetch data for ${drug} after ${maxRetries} attempts.`);
            break;
          }
        } else {
          console.log(`Error fetching data for ${drug} (generic: ${generic}) using field ${field}:`, err.message);
          break;
        }
      }
    }
    if (res) break;
  }
  if (!res) return null;
  console.log(`API response for ${drug} (generic: ${generic}, field: ${usedField}):`, JSON.stringify(res.data, null, 2));
  const results = res.data.results;
  if (!results || !results.length) {
    console.log(`No FDA data for ${drug} (generic: ${generic}) after all fields`);
    return null;
  }

  const info = results[0];
  const warningsText = [
    ...(info.warnings || []),
    ...(info.boxed_warning || []),
    ...(info.do_not_use || []),
    ...(info.ask_doctor || []),
    ...(info.ask_doctor_or_pharmacist || []),
    ...(info.stop_use || []),
    ...(info.pregnancy_or_breast_feeding || [])
  ].join(' ').toLowerCase();


  const knownAllergyIndicators = [
    "allergy alert", "hives", "swelling", "facial swelling", "asthma", "wheezing", "shock", "rash",
    "penicillin", "sulfa", "sulfonamide", "cephalosporin", "latex", "nsaid", "aspirin"
  ];
  let allergyTriggers = knownAllergyIndicators.filter(word =>
    warningsText.includes(word.toLowerCase())
  );

  const allergyRegex = /allergic to ([a-zA-Z0-9 ,\-]+)/gi;
  let allergyMatch;
  while ((allergyMatch = allergyRegex.exec(warningsText)) !== null) {
    const triggers = allergyMatch[1].split(/,| or | and /).map(s => s.trim());
    allergyTriggers.push(...triggers);
  }

  // === Inference for vague warnings ===
  // If warning says "allergic reaction to this product or any of its ingredients"
  if (warningsText.includes("allergic reaction to this product") || warningsText.includes("allergic reaction to any of its ingredients")) {
    allergyTriggers.push(generic);
    // For antihistamines, add class
    if (generic === "cetirizine" || generic === "fexofenadine" || generic === "hydroxyzine") {
      allergyTriggers.push("antihistamine");
    }
  }
  // Remove duplicates and empty strings
  allergyTriggers = [...new Set(allergyTriggers)].filter(Boolean);

  // === 💊 Drug Interactions ===
  const commonDrugs = [
    'ibuprofen', 'acetaminophen', 'naproxen', 'warfarin', 'steroids', 'aspirin',
    'paracetamol', 'metformin', 'atorvastatin', 'amoxicillin', 'pantoprazole', 'levothyroxine',
    'amlodipine', 'losartan', 'omeprazole', 'fexofenadine', 'azithromycin', 'cetirizine'
  ];
  const interactionRegexes = [
    /take other drugs containing ([a-zA-Z0-9 ,\-]+)/gi,
    /taking.*?(ibuprofen|naproxen|aspirin|warfarin|steroids|acetaminophen|paracetamol|metformin|atorvastatin|amoxicillin|pantoprazole|levothyroxine|amlodipine|losartan|omeprazole|fexofenadine|azithromycin|cetirizine)/gi
  ];
  let interactions = [];

  for (const regex of interactionRegexes) {
    let match;
    while ((match = regex.exec(warningsText)) !== null) {
      const meds = match[1]?.split(/,| or | and /).map(s => s.trim()) || [];
      interactions.push(...meds);
    }
  }

  // Add from known list if mentioned
  for (const drug of commonDrugs) {
    if (warningsText.includes(drug)) {
      interactions.push(drug);
    }
  }

  // Also check drug_interactions field
  if (info.drug_interactions) {
    const raw = Array.isArray(info.drug_interactions)
      ? info.drug_interactions
      : [info.drug_interactions];
    interactions.push(...raw);
  }

  if (warningsText.includes("sedatives") || warningsText.includes("tranquilizers")) {
    interactions.push("sedatives", "tranquilizers");
  }
  interactions = [...new Set(interactions)].filter(Boolean);

  let pregnancyRisk = '';
  const pregMatch = warningsText.match(/pregnan(t|cy)[^\.]*\./gi);
  if (pregMatch) {
    pregnancyRisk = pregMatch.join(' ');
  }

  const doc = {
    name: drug,
    genericName: generic,
    interactions: [...new Set(interactions)],
    allergyTriggers: [...new Set(allergyTriggers)],
    bannedIn: [],
    alternatives: [],
    notes: warningsText,
    pregnancyRisk,
    source: `openFDA (${usedField})`
  };

  console.log(`Prepared smarter DrugInfo doc for ${drug}:`, doc);
  return doc;
}

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
  for (const drug of drugs) {
    const data = await fetchDrugData(drug);
    if (!data) continue;
    try {
      const saved = await DrugInfo.findOneAndUpdate(
        { name: drug },
        data,
        { upsert: true, new: true }
      );
      console.log(`Upserted DrugInfo for ${drug}:`, saved);
    } catch (err) {
      console.log(`Error upserting ${drug}:`, err.message);
    }
  }
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main();
