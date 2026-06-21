require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const connectDB    = require('./config/connectdb')
const projetRoutes = require('./routes/projetRoutes')
const sections     = require('./routes/sectionRoutes')
const authRoutes   = require('./routes/authRoutes')
const mongoose = require('mongoose')
const { metricsMiddleware, register, trackError, mongooseMetricsPlugin } = require('./middleware/metrics')

// ── Plugin Mongoose pour métriques MongoDB ──
mongoose.plugin(mongooseMetricsPlugin)

// ── Connexion MongoDB ───────────────────────
connectDB()

const app  = express()
const PORT = process.env.PORT || 3001

// ── Sécurité : masquer les informations techniques ───
app.disable('x-powered-by')

// ── Middlewares ─────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))   // accepte images/PDF en base64
app.use(express.urlencoded({ extended: true }))
app.use(metricsMiddleware)

// ── Routes auth ──────────────────────────────
app.use('/api/auth', authRoutes)

// ── Routes projets ──────────────────────────
app.use('/api/projets', projetRoutes)

// ── Routes sections À Propos ─────────────────
app.use('/api/formations',     sections.formations)
app.use('/api/certifications', sections.certifications)
app.use('/api/experiences',    sections.experiences)
app.use('/api/competences',    sections.competences)

// ── Métriques Prometheus ─────────────────────
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

// ── Santé ────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: '🚀 API Portfolio opérationnelle' }))

// ── 404 ──────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} introuvable` }))

// ── Erreurs globales ─────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  trackError(err.name || 'UnknownError')
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur interne' })
})

// ── Démarrage ────────────────────────────────
app.listen(PORT, () => console.log(`🌍  Serveur en écoute sur http://localhost:${PORT}`))
