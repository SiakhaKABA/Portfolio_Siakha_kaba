const Projet = require('../models/Projet')

const createProjet = async (req, res) => {
  try {
    const projet = await Projet.create(req.body)
    res.status(201).json(projet)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

const getAllProjets = async (req, res) => {
  try {
    const projets = await Projet.find().sort({ createdAt: 1 })
    res.status(200).json(projets)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

const getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    res.status(200).json(projet)
  } catch (err) {
    res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
  }
}

const updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    res.status(200).json(projet)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id)
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' })
    res.status(200).json({ message: 'Projet supprimé avec succès' })
  } catch (err) {
    res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
  }
}

module.exports = { createProjet, getAllProjets, getProjetById, updateProjet, deleteProjet }
