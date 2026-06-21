const mongoose = require('mongoose')

const projetSchema = new mongoose.Schema(
  {
    libelle:      { type: String, required: [true, 'Le libellé est obligatoire'], trim: true },
    description:  { type: String, required: [true, 'La description est obligatoire'], trim: true },
    image:        { type: String, default: '' },
    technologies: { type: [String], default: [] },
    github:       { type: String, default: '' },
    rapport:      { type: String, default: '' },
    categorie: {
      type: String,
      enum: ['Développement', 'Réseau & Système', 'Sécurité', 'Cloud AWS'],
      default: 'Développement',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Projet', projetSchema)
