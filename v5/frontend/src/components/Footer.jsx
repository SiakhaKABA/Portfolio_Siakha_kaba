export default function Footer({ setPage }) {
  const socialLinks = [
    { icon: 'fab fa-github',   href: 'https://github.com/siakha-kaba',     title: 'GitHub',   hoverColor: 'hover:text-white hover:border-white/40'           },
    { icon: 'fab fa-whatsapp', href: 'https://wa.me/221772000813',          title: 'WhatsApp', hoverColor: 'hover:text-green-400 hover:border-green-400/40'   },
    { icon: 'fas fa-envelope', href: 'mailto:siakha.kaba49@gmail.com',      title: 'Email',    hoverColor: 'hover:text-teal-400 hover:border-teal-400/40'     },
    { icon: 'fab fa-linkedin', href: 'https://linkedin.com/in/siakha-kaba', title: 'LinkedIn', hoverColor: 'hover:text-blue-400 hover:border-blue-400/40'     },
  ]

  return (
    <footer className="border-t border-white/5 bg-slate-900/60 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/30 flex items-center justify-center">
                <span className="text-teal-400 font-mono font-bold text-xs">SK</span>
              </div>
              <span className="font-display font-bold text-white">Siakha <span className="text-teal-400">KABA</span></span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Ingénieur Systèmes & Réseaux passionné par la cybersécurité. Basé à Dakar, Sénégal.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Navigation</h4>
            <div className="space-y-2">
              {[['accueil','Accueil'],['apropos','À Propos'],['projets','Projets'],['contact','Contact']].map(([k, l]) => (
                <button key={k} onClick={() => setPage(k)} className="block text-slate-500 hover:text-teal-400 text-sm transition-colors">{l}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:siakha.kaba49@gmail.com" className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors text-xs">
                <i className="fas fa-envelope text-[10px]" />siakha.kaba49@gmail.com
              </a>
              <a href="tel:+221772000813" className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors text-xs">
                <i className="fas fa-phone text-[10px]" />+221 77 200 08 13
              </a>
              <p className="flex items-center gap-2 text-slate-600 text-xs">
                <i className="fas fa-map-marker-alt text-[10px]" />Dakar, Sénégal
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-700 text-xs font-mono select-none">
            © {new Date().getFullYear()} Siakha KABA — Tous droits réservés
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon, href, title, hoverColor }) => (
              <a key={title} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" title={title}
                className={`w-9 h-9 rounded-xl bg-slate-800/60 border border-white/10 flex items-center justify-center text-slate-500 ${hoverColor} transition-all hover:-translate-y-0.5`}>
                <i className={`${icon} text-sm`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
