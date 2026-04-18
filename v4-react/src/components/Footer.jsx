export default function Footer({ setActiveSection }) {
  const links = [
    { label: 'Accueil', id: 'accueil' },
    { label: 'Projets', id: 'projets' },
    { label: 'Contact', id: 'contact' },
  ]

  const socials = [
    { icon: 'fa-linkedin', href: 'https://www.linkedin.com/in/siakha-kaba' },
    { icon: 'fa-github', href: 'https://github.com/LuiSeul/Portfolio_Siakha_kaba/' },
    { icon: 'fa-whatsapp', href: 'https://wa.me/221772000813' },
    { icon: 'fa-google', href: 'https://mail.google.com/' },
  ]

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-gray-900 font-display font-bold text-sm">SK</span>
              </div>
              <span className="text-white font-display font-semibold">
                Admin<span className="text-teal-200">/System</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Passionné par le cloud et le développement, je conçois des solutions performantes en alliant code,
			  réseau et infrastructure.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveSection(link.id)}
                    className="text-slate-500 hover:text-teal-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-4">Suivez-nous</h4>
            <div className="flex gap-3 flex-wrap">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-400/30 transition-all duration-200 text-sm"
                >
                  <i className={`fab ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-slate-600 text-sm">© 2026 — Portfolio_SK. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
