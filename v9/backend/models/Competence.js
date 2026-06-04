const mongoose = require('mongoose')

const competenceSchema = new mongoose.Schema(
  {
    categorie: { type: String, required: true, trim: true },
    niveau:    { type: Number, min: 0, max: 100, default: 70 },
    outils:    { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Competence', competenceSchema)
