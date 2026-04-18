export default function Navbar({ activeSection, setActiveSection, allerAjouter, setProjetAEditer }) {
  const links = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'projets', label: 'Mes Projets' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="flex items-center px-8 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-400/30">
            <span className="text-gray-900 font-display font-bold text-base">SK</span>
          </div>
          <span className="text-white font-display font-semibold text-lg hidden sm:block">
            Admin<span className="text-teal-400">/System</span>
          </span>
        </div>

        {/* Nav Links - centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-800/60 p-1 rounded-full border border-white/5">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`nav-link ${activeSection === link.id || (activeSection === 'detail' && link.id === 'projets') || (activeSection === 'ajouter' && link.id === 'projets')
                ? 'nav-link-active'
                : 'nav-link-inactive'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="ml-auto">
          <button
            onClick={allerAjouter}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-400 text-gray-900 rounded-full font-semibold text-sm hover:bg-teal-300 transition-all duration-200 shadow-lg shadow-teal-400/20"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:block">Ajouter</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
