import express from 'express';
const router = express.Router();
import DrugInfo from '../models/DrugInfo.js';
import MedicalData from '../models/MedicalData.js';
import authenticateUser from '../middleware/authMiddleware.js';

// POST /check-medications
router.post('/check-medications', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userMedical = await MedicalData.findOne({ userId });
    if (!userMedical) return res.status(404).json({ error: 'Medical profile not found' });

    // MedSafe expects medications: [{ name, dosage }], allergies: [string], conditions: [string]
    const { medications = [], allergies = [], conditions = [] } = userMedical;
    // If medications are stored as strings, convert to objects
    const medList = Array.isArray(medications) && typeof medications[0] === 'object' ? medications : medications.map(name => ({ name }));
    // Normalize medication names to lowercase for lookup
    const medNames = medList.map(m => m.name.toLowerCase());
    console.log('Medications from MedicalData:', medications);
    console.log('medList:', medList);
    console.log('medNames:', medNames);
    const drugInfos = await DrugInfo.find({ name: { $in: medNames } });
    console.log('DrugInfos found:', drugInfos.map(d => d.name));
    console.log('Allergies:', allergies);
    console.log('Conditions:', conditions);

    const allMeds = [];
    for (const med of medList) {
      // Match DrugInfo by lowercased name
      const info = drugInfos.find(d => d.name.toLowerCase() === med.name.toLowerCase());
      if (!info) continue;
      const issues = [];
      // 1. Banned in India
      if (Array.isArray(info.bannedIn) && info.bannedIn.includes('India')) {
        issues.push('Banned in India');
      }
      // 2. Allergy triggers
      if (Array.isArray(info.allergyTriggers)) {
        const allergyHits = info.allergyTriggers.filter(trigger => allergies.includes(trigger));
        if (allergyHits.length) {
          issues.push(`May cause reaction for ${allergyHits.join(', ')} allergy`);
        }
      }
      // 3. Interactions with other meds
      if (Array.isArray(info.interactions)) {
        const interactionHits = info.interactions.filter(drug => {
          // Normalize for case and avoid self-interaction
          return medNames.includes(drug.toLowerCase()) && drug.toLowerCase() !== med.name.toLowerCase();
        });
        if (interactionHits.length) {
          issues.push(`Interacts with: ${[...new Set(interactionHits)].join(', ')}`);
        }
      }
      // 4. (Optional) Match conditions in notes
      if (info.notes && conditions.length) {
        for (const cond of conditions) {
          if (info.notes.toLowerCase().includes(cond.toLowerCase())) {
            issues.push(`Risk for condition: ${cond}`);
          }
        }
      }
      // Deduplicate issues
      const uniqueIssues = [...new Set(issues)];
      allMeds.push({
        name: med.name,
        issues: uniqueIssues,
        alternatives: info.alternatives || [],
        notes: info.notes || '',
        pregnancyRisk: info.pregnancyRisk || '',
        allergyTriggers: info.allergyTriggers || [],
        interactions: info.interactions || [],
      });
    }
    res.json(allMeds);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
