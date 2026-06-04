import { useState, useEffect, useCallback } from 'react'
import Navbar          from './components/Navbar'
import Accueil         from './components/Accueil'
import APropos         from './components/APropos'
import Dossier         from './components/Dossier'
import DetaillerProjet from './components/DetaillerProjet'
import AjouterProjet   from './components/AjouterProjet'
import Contact         from './components/Contact'
import Footer          from './components/Footer'
import Toast           from './components/Toast'
import LoginModal      from './components/LoginModal'

const API = '/api'

export default function App() {
  const [page,         setPage]         = useState('accueil')
  const [projets,      setProjets]      = useState([])
  const [loading,      setLoading]      = useState(false)
  const [search,       setSearch]       = useState('')
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [projetActif,  setProjetActif]  = useState(null)
  const [projetEdit,   setProjetEdit]   = useState(null)
  const [toast,        setToast]        = useState(null)
  const [isAdmin,      setIsAdmin]      = useState(false)
  const [token,        setToken]        = useState(null)
  const [showLogin,    setShowLogin]    = useState(false)

  // ── Helpers ───────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  /** Headers avec JWT pour les requêtes d'écriture */
  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token])

  // ── Chargement projets ────────────────────────────────
  const fetchProjets = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/projets`)
      const data = await res.json()
      setProjets(data)
    } catch {
      showToast("Erreur de connexion à l'API", 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchProjets() }, [fetchProjets])

  // ── CRUD Projets ──────────────────────────────────────
  const handleSubmitProjet = async (projet) => {
    const isEdit = Boolean(projet._id)
    try {
      const res = await fetch(
        isEdit ? `${API}/projets/${projet._id}` : `${API}/projets`,
        {
          method:  isEdit ? 'PUT' : 'POST',
          headers: authHeaders(),
          body:    JSON.stringify(projet),
        }
      )
      if (!res.ok) throw new Error()
      await fetchProjets()
      showToast(isEdit ? '✓ Projet modifié' : '✓ Projet ajouté')
      setPage('projets')
      setProjetEdit(null)
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  }

  const handleDeleteProjet = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return
    try {
      await fetch(`${API}/projets/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      await fetchProjets()
      showToast('✓ Projet supprimé')
      if (page === 'detail') setPage('projets')
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  // ── Auth ──────────────────────────────────────────────
  const handleLogin = useCallback(async (password) => {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Mot de passe incorrect')
    setToken(data.token)
    setIsAdmin(true)
    setShowLogin(false)
    showToast('✓ Mode propriétaire activé')
  }, [showToast])

  const handleLogout = useCallback(() => {
    setIsAdmin(false)
    setToken(null)
    showToast('Déconnecté')
  }, [showToast])

  // ── Navigation ────────────────────────────────────────
  const goToDetail = (projet)  => { setProjetActif(projet); setPage('detail')    }
  const goToEdit   = (projet)  => { setProjetEdit(projet);  setPage('formulaire') }
  const goToAdd    = ()        => { setProjetEdit(null);    setPage('formulaire') }

  // ── Render ────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'accueil':
        return (
          <Accueil
            onVoirProjets={() => setPage('projets')}
            onContact={() => setPage('contact')}
            onAPropos={() => setPage('apropos')}
          />
        )
      case 'apropos':
        return <APropos isAdmin={isAdmin} showToast={showToast} token={token} />
      case 'projets':
        return (
          <Dossier
            projets={projets}
            search={search}
            setSearch={setSearch}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            loading={loading}
            isAdmin={isAdmin}
            onView={goToDetail}
            onEdit={goToEdit}
            onDelete={handleDeleteProjet}
            onAdd={goToAdd}
          />
        )
      case 'detail':
        return (
          <DetaillerProjet
            projet={projetActif}
            isAdmin={isAdmin}
            onBack={() => setPage('projets')}
            onEdit={goToEdit}
            onDelete={handleDeleteProjet}
          />
        )
      case 'formulaire':
        return (
          <AjouterProjet
            projet={projetEdit}
            onSubmit={handleSubmitProjet}
            onCancel={() => setPage(projetEdit ? 'detail' : 'projets')}
          />
        )
      case 'contact':
        return <Contact showToast={showToast} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar
        page={page}
        setPage={setPage}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer setPage={setPage} />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      {showLogin && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  )
}
