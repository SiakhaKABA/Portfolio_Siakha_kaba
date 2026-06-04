const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    poste:       { type: String, required: true, trim: true },
    entreprise:  { type: String, required: true, trim: true },
    periode:     { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Experience', experienceSchema)
