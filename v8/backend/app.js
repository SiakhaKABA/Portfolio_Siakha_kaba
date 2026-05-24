require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const connectDB    = require('./config/connectdb')
const projetRoutes = require('./routes/projetRoutes')
const sections     = require('./routes/sectionRoutes')
const authRoutes   = require('./routes/authRoutes')

// ── Connexion MongoDB ───────────────────────
connectDB()

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middlewares ─────────────────────────────
app.use(cors())
app.use(express.json({ limit: '10mb' }))   // accepte images/PDF en base64
app.use(express.urlencoded({ extended: true }))

// ── Routes auth ──────────────────────────────
app.use('/api/auth', authRoutes)

// ── Routes projets ──────────────────────────
app.use('/api/projets', projetRoutes)

// ── Routes sections À Propos ─────────────────
app.use('/api/formations',     sections.formations)
app.use('/api/certifications', sections.certifications)
app.use('/api/experiences',    sections.experiences)
app.use('/api/competences',    sections.competences)

// ── Santé ────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: '🚀 API Portfolio opérationnelle', version: '2.0.0' }))

// ── 404 ──────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} introuvable` }))

// ── Erreurs globales ─────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur interne' })
})

// ── Démarrage ────────────────────────────────
app.listen(PORT, () => console.log(`🌍  Serveur en écoute sur http://localhost:${PORT}`))
