import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Accueil from './components/Accueil'
import Dossier from './components/Dossier'
import AjouterProjet from './components/AjouterProjet'
import DetaillerProjet from './components/DetaillerProjet'
import Contact from './components/Contact'
import Footer from './components/Footer'

const API_URL = '/api/projets'

export default function App() {
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // SPA Navigation state
  const [activeSection, setActiveSection] = useState('accueil')
  const [selectedProjet, setSelectedProjet] = useState(null)
  const [projetAEditer, setProjetAEditer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState(null)

  // ── Fetch all projects ──────────────────────────────────────────────
  const fetchProjets = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Erreur lors du chargement des projets')
      const data = await res.json()
      setProjets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjets() }, [fetchProjets])

  // ── Notification helper ─────────────────────────────────────────────
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // ── CRUD Operations ─────────────────────────────────────────────────
  const ajouterProjet = async (projetData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projetData, date: new Date().toISOString().split('T')[0] }),
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newProjet = await res.json()
      setProjets(prev => [...prev, newProjet])
      showNotification('✅ Projet ajouté avec succès !')
      setActiveSection('projets')
    } catch (err) {
      showNotification(`❌ ${err.message}`, 'error')
    }
  }

  const supprimerProjet = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      setProjets(prev => prev.filter(p => p.id !== id))
      if (selectedProjet?.id === id) {
        setSelectedProjet(null)
        setActiveSection('projets')
      }
      showNotification('🗑️ Projet supprimé avec succès !')
    } catch (err) {
      showNotification(`❌ ${err.message}`, 'error')
    }
  }

  const modifierProjet = async (id, projetData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projetData),
      })
      if (!res.ok) throw new Error('Erreur lors de la modification')
      const updatedProjet = await res.json()
      setProjets(prev => prev.map(p => p.id === id ? updatedProjet : p))
      setSelectedProjet(updatedProjet)
      setProjetAEditer(null)
      showNotification('✏️ Projet modifié avec succès !')
      setActiveSection('detail')
    } catch (err) {
      showNotification(`❌ ${err.message}`, 'error')
    }
  }

  // ── Navigation handlers ─────────────────────────────────────────────
  const voirDetail = (projet) => {
    setSelectedProjet(projet)
    setProjetAEditer(null)
    setActiveSection('detail')
  }

  const editerProjet = (projet) => {
    setProjetAEditer(projet)
    setActiveSection('ajouter')
  }

  const allerAjouter = () => {
    setProjetAEditer(null)
    setActiveSection('ajouter')
  }

  const annulerDetail = () => {
    setSelectedProjet(null)
    setActiveSection('projets')
  }

  const projetsFiltrés = projets.filter(p =>
    p.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || '')
      .toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl" />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-medium text-sm animate-slide-up
          ${notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-teal-400/95 text-gray-900'}`}>
          {notification.message}
        </div>
      )}

      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        allerAjouter={allerAjouter}
        setProjetAEditer={setProjetAEditer}
      />

      <main className="relative z-10">
        {/* ── ACCUEIL ─────────────────────────────────── */}
        {activeSection === 'accueil' && (
          <Accueil
            onVoirProjets={() => setActiveSection('projets')}
            onContact={() => setActiveSection('contact')}
          />
        )}

        {/* ── DOSSIER / PROJETS ───────────────────────── */}
        {activeSection === 'projets' && (
          <Dossier
            projets={projetsFiltrés}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onVoirDetail={voirDetail}
            onSupprimer={supprimerProjet}
            onAjouter={allerAjouter}
          />
        )}

        {/* ── AJOUTER / ÉDITER ────────────────────────── */}
        {activeSection === 'ajouter' && (
          <AjouterProjet
            projetAEditer={projetAEditer}
            onAjouter={ajouterProjet}
            onModifier={modifierProjet}
            onAnnuler={() => setActiveSection(projetAEditer ? 'detail' : 'projets')}
          />
        )}

        {/* ── DÉTAIL PROJET ────────────────────────────── */}
        {activeSection === 'detail' && selectedProjet && (
          <DetaillerProjet
            projet={selectedProjet}
            onAnnuler={annulerDetail}
            onEditer={() => editerProjet(selectedProjet)}
            onSupprimer={supprimerProjet}
          />
        )}

        {/* ── CONTACT ─────────────────────────────────── */}
        {activeSection === 'contact' && (
          <Contact />
        )}
      </main>

      <Footer setActiveSection={setActiveSection} />
    </div>
  )
}
