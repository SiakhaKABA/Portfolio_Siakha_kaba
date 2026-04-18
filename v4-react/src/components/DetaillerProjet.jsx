export default function DetaillerProjet({ projet, onAnnuler, onEditer, onSupprimer }) {
  const technologies = Array.isArray(projet.technologies)
    ? projet.technologies
    : (projet.technologies || '').split(',').map(t => t.trim()).filter(Boolean)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const handleSupprimer = () => {
    if (window.confirm(`Supprimer définitivement "${projet.libelle}" ?`)) {
      onSupprimer(projet.id)
    }
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto animate-scale-in">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <button onClick={onAnnuler} className="hover:text-teal-400 transition-colors">
            Projets
          </button>
          <span>/</span>
          <span className="text-slate-300 truncate">{projet.libelle}</span>
        </div>

        {/* Main card */}
        <div className="card overflow-hidden">
          {/* Hero image */}
          <div className="relative h-72 bg-slate-700/50 overflow-hidden">
            {projet.image ? (
              <img
                src={projet.image}
                alt={projet.libelle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-teal-900/60 to-slate-900/80 ${projet.image ? 'hidden' : 'flex'} items-center justify-center`}
            >
              <span className="text-7xl opacity-30">🖥️</span>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-transparent to-transparent" />
            {/* Title overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl font-display font-bold text-white">{projet.libelle}</h1>
              {projet.date && (
                <p className="text-teal-400 text-sm mt-1">Ajouté le {formatDate(projet.date)}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">

            {/* Description */}
            <div>
              <h2 className="text-white font-display font-semibold text-xl mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-teal-400 rounded-full" />
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">{projet.description}</p>
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div>
                <h2 className="text-white font-display font-semibold text-xl mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-teal-400 rounded-full" />
                  Technologies utilisées
                </h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-teal-400/10 text-teal-300 rounded-xl text-sm font-medium border border-teal-400/20 hover:bg-teal-400/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
              <button
                onClick={onAnnuler}
                className="btn-secondary flex items-center gap-2"
              >
                <i className="fas fa-arrow-left text-sm" />
                Retour aux projets
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleSupprimer}
                  className="btn-danger flex items-center gap-2"
                >
                  <i className="fas fa-trash-alt" />
                  Supprimer
                </button>
                <button
                  onClick={onEditer}
                  className="btn-primary flex items-center gap-2"
                >
                  <i className="fas fa-pen" />
                  Éditer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
