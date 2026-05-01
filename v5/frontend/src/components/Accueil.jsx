import photo from '../assets/siakha.jpeg'

const skills = [
  { icon: '🌐', label: 'Réseaux / TCP-IP' },
  { icon: '🔍', label: 'Audit / Pentest' },
  { icon: '📊', label: 'Data Analysis' },
  { icon: '🤖', label: 'Intelligence Artificielle' },
  { icon: '🐍', label: 'Python / Data Science' },
  { icon: '⚙️', label: 'DevOps' },
  { icon: '🔄', label: 'Automatisation' },
  { icon: '🚀', label: 'Pipeline CI/CD' },
  { icon: '☁️', label: 'AWS' },
]

export default function Accueil({ onVoirProjets, onContact, onAPropos }) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-20 pb-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-4 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 border border-teal-400/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-4 sm:right-10 w-36 sm:w-48 h-36 sm:h-48 border border-teal-400/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 animate-fade-in">

        {/* Texte */}
        <div className="flex-1 text-center md:text-left animate-slide-up w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400/10 border border-teal-400/20 rounded-full text-teal-400 text-sm font-medium mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            Disponible pour collaborer
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight">
            Siakha <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">KABA</span>
          </h1>

          <p className="text-lg sm:text-xl font-mono text-teal-400 mb-4">
            Ingénieur informatique & DevOps junior
          </p>

          <p className="text-base text-slate-400 max-w-xl leading-relaxed mb-8 mx-auto md:mx-0">
            Ingénieur Systèmes & Réseaux junior, orienté Cloud AWS et DevOps, avec une solide formation en réseaux,
            systèmes distribués et sécurité informatique. Expérimenté dans la conception et l'administration
            d'infrastructures réseau, je m'appuie sur les services AWS et les pratiques DevOps pour automatiser les
            déploiements, optimiser la disponibilité des systèmes et garantir la sécurité des environnements cloud
            et on-premise. Rigoureux et curieux, je souhaite intégrer une équipe dynamique pour contribuer à la
            modernisation des infrastructures, l'intégration CI/CD et la prévention des cybermenaces.
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
            <button onClick={onVoirProjets}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-400 text-gray-900 rounded-2xl font-bold text-sm sm:text-base hover:bg-teal-300 transition-all duration-200 shadow-xl shadow-teal-400/25 hover:-translate-y-0.5">
              Voir mes projets →
            </button>
            <button onClick={onAPropos}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 text-white rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-200 border border-white/10 hover:-translate-y-0.5">
              À Propos
            </button>
            <button onClick={onContact}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 text-white rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-200 border border-white/10 hover:-translate-y-0.5">
              Me contacter
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto md:mx-0">
            {skills.map((s, i) => (
              <div key={i}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/60 border border-white/5 rounded-xl text-xs sm:text-sm text-slate-300 hover:border-teal-400/30 hover:bg-slate-700/60 transition-all">
                <span className="text-base sm:text-xl flex-shrink-0">{s.icon}</span>
                <span className="font-medium leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="flex-shrink-0 flex justify-center">
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500 to-teal-200 blur-2xl opacity-20 scale-110" />
            <div className="absolute inset-0 rounded-full border border-teal-400/30 scale-110 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-teal-400/10 scale-125" />
            <img src={photo} alt="Siakha KABA"
              className="relative w-full h-full object-cover rounded-full border-2 border-teal-400/50 shadow-2xl shadow-teal-500/20" />
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-teal-400/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-teal-400">Disponible</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-slate-500 text-xs hidden sm:flex">
        <span>Défiler</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
