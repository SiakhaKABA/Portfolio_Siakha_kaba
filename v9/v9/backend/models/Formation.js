const mongoose = require('mongoose')

const formationSchema = new mongoose.Schema(
  {
    diplome:       { type: String, required: true, trim: true },
    etablissement: { type: String, required: true, trim: true },
    periode:       { type: String, required: true },
    description:   { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Formation', formationSchema)
