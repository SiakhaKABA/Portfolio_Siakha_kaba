const { trackCrud } = require('../middleware/metrics')

/**
 * crudController(Model)
 * Factory qui génère les 5 opérations CRUD pour n'importe quel modèle Mongoose.
 */
const crudController = (Model) => {
  const resource = Model.modelName.toLowerCase()

  return {
    // GET /api/:section
    getAll: async (req, res) => {
      try {
        const items = await Model.find().sort({ createdAt: 1 })
        trackCrud(resource, 'list', true)
        res.status(200).json(items)
      } catch (err) {
        trackCrud(resource, 'list', false)
        res.status(500).json({ message: err.message })
      }
    },

    // GET /api/:section/:id
    getById: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id)
        if (!item) return res.status(404).json({ message: 'Entrée non trouvée' })
        trackCrud(resource, 'read', true)
        res.status(200).json(item)
      } catch (err) {
        trackCrud(resource, 'read', false)
        res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
      }
    },

    // POST /api/:section
    create: async (req, res) => {
      try {
        const item = await Model.create(req.body)
        trackCrud(resource, 'create', true)
        res.status(201).json(item)
      } catch (err) {
        trackCrud(resource, 'create', false)
        res.status(400).json({ message: err.message })
      }
    },

    // PUT /api/:section/:id
    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true, runValidators: true,
        })
        if (!item) return res.status(404).json({ message: 'Entrée non trouvée' })
        trackCrud(resource, 'update', true)
        res.status(200).json(item)
      } catch (err) {
        trackCrud(resource, 'update', false)
        res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
      }
    },

    // DELETE /api/:section/:id
    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id)
        if (!item) return res.status(404).json({ message: 'Entrée non trouvée' })
        trackCrud(resource, 'delete', true)
        res.status(200).json({ message: 'Supprimé avec succès' })
      } catch (err) {
        trackCrud(resource, 'delete', false)
        res.status(err.kind === 'ObjectId' ? 400 : 500).json({ message: err.message })
      }
    },
  }
}

module.exports = crudController
