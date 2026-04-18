export default function Projet({ projet, onVoirDetail, onSupprimer }) {
  const technologies = Array.isArray(projet.technologies)
    ? projet.technologies
    : (projet.technologies || '').split(',').map(t => t.trim()).filter(Boolean)

  const handleSupprimer = (e) => {
    e.stopPropagation()
    if (window.confirm(`Voulez-vous vraiment supprimer "${projet.libelle}" ?`)) {
      onSupprimer(projet.id)
    }
  }

  return (
    <article className="group card overflow-hidden hover:border-teal-400/20 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-700/50">
        {projet.image ? (
          <img
            src={projet.image}
            alt={projet.libelle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-teal-800/40 to-slate-800/60 flex items-center justify-center ${projet.image ? 'hidden' : 'flex'}`}
        >
          <span className="text-5xl">🖥️</span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title - clickable anchor */}
        <button
          onClick={() => onVoirDetail(projet)}
          className="text-left text-xl font-display font-bold text-white hover:text-teal-400 transition-colors duration-200 mb-2 group/title"
        >
          <span className="border-b border-transparent group-hover/title:border-teal-400 transition-all duration-200">
            {projet.libelle}
          </span>
        </button>

        <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
          {projet.description}
        </p>

        {/* Tech badges */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {technologies.slice(0, 3).map((tech, i) => (
              <span key={i} className="tech-badge">{tech}</span>
            ))}
            {technologies.length > 3 && (
              <span className="tech-badge">+{technologies.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <button
            onClick={() => onVoirDetail(projet)}
            className="text-sm text-teal-400 font-medium hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            Voir les détails <span>→</span>
          </button>
          <button
            onClick={handleSupprimer}
            className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <i className="fas fa-trash-alt text-xs" />
            Supprimer
          </button>
        </div>
      </div>
    </article>
  )
}
