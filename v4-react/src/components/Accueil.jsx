export default function Accueil({ onVoirProjets, onContact }) {
  const competences = [
    { icon: '⚛️', label: 'React / Vue.js' },
    { icon: '🟢', label: 'Node.js / Express' },
    { icon: '🗄️', label: 'PostgreSQL / MongoDB' },
    { icon: '🎨', label: 'Tailwind CSS' },
    //{ icon: '🐳', label: 'Docker / DevOps' },
    { icon: '🔗', label: 'REST API / GraphQL' },
  ]

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-6 text-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-10 w-64 h-64 border border-teal-400/10 rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 border border-teal-400/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400/10 border border-teal-400/20 rounded-full text-teal-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          Équipe disponible pour collaborer
        </div>

        <h1 className="text-6xl sm:text-7xl font-display font-bold text-white mb-4 leading-tight">
          Bienvenue sur mon
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
            Portfolio
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          À la croisée des systèmes, du réseau et du cloud, je conçois et déploie des solutions web performantes en utilisant 
		  AWS, React.js et Node.js. J’interviens sur l’ensemble du cycle, de la configuration des infrastructures à la création
		  d’applications dynamiques. Curieux et rigoureux, je m’oriente vers des solutions fiables, sécurisées et évolutives, 
		  en lien avec les pratiques du cloud et du DevOps.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={onVoirProjets}
            className="px-8 py-4 bg-teal-400 text-gray-900 rounded-2xl font-bold text-lg hover:bg-teal-300 transition-all duration-200 shadow-xl shadow-teal-400/25 hover:shadow-teal-400/40 hover:-translate-y-0.5"
          >
            Voir nos projets →
          </button>
          <button
            onClick={onContact}
            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-200 border border-white/10 hover:-translate-y-0.5"
          >
            Nous contacter
          </button>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {competences.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 border border-white/5 rounded-xl text-sm text-slate-300 hover:border-teal-400/30 hover:bg-slate-700/60 transition-all duration-200"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="font-medium">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-sm">
        <span>Défiler</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
