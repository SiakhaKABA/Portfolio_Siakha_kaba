const express       = require('express')
const crudCtrl      = require('../controllers/crudController')
const auth          = require('../middleware/authMiddleware')
const Formation     = require('../models/Formation')
const Certification = require('../models/Certification')
const Experience    = require('../models/Experience')
const Competence    = require('../models/Competence')

/**
 * makeRouter(Model) — crée un router Express CRUD pour le modèle donné.
 * Lecture libre — écriture protégée par JWT.
 */
function makeRouter(Model) {
  const router = express.Router()
  const ctrl   = crudCtrl(Model)
  router.route('/').get(ctrl.getAll).post(auth, ctrl.create)
  router.route('/:id').get(ctrl.getById).put(auth, ctrl.update).delete(auth, ctrl.remove)
  return router
}

module.exports = {
  formations:      makeRouter(Formation),
  certifications:  makeRouter(Certification),
  experiences:     makeRouter(Experience),
  competences:     makeRouter(Competence),
}
