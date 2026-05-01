const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')
const { createProjet, getAllProjets, getProjetById, updateProjet, deleteProjet } = require('../controllers/projetController')

// Lecture libre — écriture protégée par JWT
router.route('/')
  .get(getAllProjets)
  .post(auth, createProjet)

router.route('/:id')
  .get(getProjetById)
  .put(auth, updateProjet)
  .delete(auth, deleteProjet)

module.exports = router
