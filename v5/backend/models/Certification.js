const mongoose = require('mongoose')

const certificationSchema = new mongoose.Schema(
  {
    titre:       { type: String, required: true, trim: true },
    organisme:   { type: String, required: true, trim: true },
    date:        { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Certification', certificationSchema)
