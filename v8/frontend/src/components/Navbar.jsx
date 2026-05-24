import { useState, useRef } from 'react'

const LINKS = [
  { key: 'accueil', label: 'Accueil' },
  { key: 'apropos', label: 'À Propos' },
  { key: 'projets', label: 'Projets' },
  { key: 'contact', label: 'Contact' },
]

export default function Navbar({ page, setPage, isAdmin, onLoginClick, onLogout }) {
  const [open, setOpen]   = useState(false)
  const clickCount        = useRef(0)
  const clickTimer        = useRef(null)

  const go = (key) => { setPage(key); setOpen(false) }

  // Triple-clic sur le logo → ouvre le modal de connexion
  const handleLogoClick = () => {
    if (isAdmin) { go('accueil'); return }
    clickCount.current += 1
    clearTimeout(clickTimer.current)
    if (clickCount.current >= 3) {
      clickCount.current = 0
      onLoginClick()
    } else {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; go('accueil') }, 600)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center gap-2 group select-none">
          <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/30 flex items-center justify-center">
            <span className="text-teal-400 font-mono font-bold text-xs">SK</span>
          </div>
          <span className="font-display font-bold text-white text-sm hidden sm:block">
            Siakha <span className="text-teal-400">KABA</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ key, label }) => (
            <button key={key} onClick={() => go(key)}
              className={`nav-link ${page === key ? 'nav-link-active' : 'nav-link-inactive'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Droite */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1.5 rounded-full">
                <i className="fas fa-shield-alt text-[10px]" />Propriétaire
              </span>
              <button onClick={onLogout} title="Se déconnecter"
                className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/5">
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          )}
          <button onClick={() => setOpen(!open)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
            <i className={`fas ${open ? 'fa-times' : 'fa-bars'} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-slate-900/95 px-4 py-3 animate-fade-in">
          {LINKS.map(({ key, label }) => (
            <button key={key} onClick={() => go(key)}
              className={`block w-full text-left px-4 py-3 rounded-xl font-display font-medium text-sm mb-1 transition-all
                ${page === key ? 'bg-teal-400 text-gray-900' : 'text-slate-300 hover:bg-white/10'}`}>
              {label}
            </button>
          ))}
          {isAdmin && (
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between px-4 py-2">
              <span className="text-xs text-teal-400 flex items-center gap-1.5">
                <i className="fas fa-shield-alt" />Mode propriétaire actif
              </span>
              <button onClick={() => { onLogout(); setOpen(false) }} className="text-xs text-red-400 hover:text-red-300">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
