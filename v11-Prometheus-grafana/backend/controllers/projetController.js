const Projet = require('../models/Projet')
const { trackCrud } = require('../middleware/metrics')

const createProjet = async (req, res) => {
  try {
    const projet = await Projet.create(req.body)
    trackCrud('projet', 'create', true)
    res.status(201).json(projet)
  } catch (err) {
    trackCrud('projet', 'create', false)
    res.status(400).json({ message: err.message })
  }
}

const getAllProjets = async (req, res) => {
  try {
    const projets = await Projet.find().sort({ createdAt: 1 })
    trackCrud('projet', 'list', true)
    res.status(200).json(projets)
  } catch (err) {
    trackCrud('projet', 'list', false)
    res.status(500).json({ message: err.message })
  }
}

const getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    trackCrud('projet', 'read', true)
    res.status(200).json(projet)
  } catch (err) {
    trackCrud('projet', 'read', false)
    res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
  }
}

const updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    trackCrud('projet', 'update', true)
    res.status(200).json(projet)
  } catch (err) {
    trackCrud('projet', 'update', false)
    res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
  }
}

const deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id)
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    trackCrud('projet', 'delete', true)
    res.status(200).json({ message: 'Projet supprimé avec succès' })
  } catch (err) {
    trackCrud('projet', 'delete', false)
    res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
  }
}

module.exports = { createProjet, getAllProjets, getProjetById, updateProjet, deleteProjet }
