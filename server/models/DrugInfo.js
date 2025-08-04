import { Schema, model } from 'mongoose';

const DrugInfoSchema = new Schema({
  name: { type: String, required: true, unique: true },
  class: String,
  interactions: [String],
  allergyTriggers: [String],
  bannedIn: [String],
  alternatives: [String],
  notes: String,
  source: String // e.g., "FDA", "WHO", "DrugBank"
});

export default model('DrugInfo', DrugInfoSchema);
