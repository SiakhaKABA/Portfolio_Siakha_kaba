export default function DetaillerProjet({ projet, onEdit, onDelete, onBack, isAdmin }) {
  if (!projet) return null

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 animate-slide-up">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors text-sm font-mono">
            <i className="fas fa-arrow-left text-xs" />Projets
          </button>
          <i className="fas fa-chevron-right text-slate-700 text-xs" />
          <span className="text-slate-300 text-sm font-mono line-clamp-1">{projet.libelle}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">

          {/* Principal */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6 animate-slide-up">
            {projet.image && (
              <div className="card overflow-hidden">
                <div className="relative h-48 sm:h-64">
                  <img src={projet.image} alt={projet.libelle}
                    className="w-full h-full object-cover opacity-90"
                    onError={e => e.target.parentElement.style.display = 'none'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  {projet.categorie && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/90 border border-teal-400/30 text-xs font-mono text-teal-400">
                      {projet.categorie}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card p-4 sm:p-6">
              <h1 className="font-display font-bold text-white text-xl sm:text-2xl mb-4">{projet.libelle}</h1>
              <p className="text-slate-400 leading-relaxed text-sm">{projet.description}</p>
            </div>

            {projet.technologies?.length > 0 && (
              <div className="card p-4 sm:p-6">
                <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
                  <i className="fas fa-code text-teal-400 text-xs" />Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {projet.technologies.map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-lg border border-teal-400/20 bg-teal-400/5 text-teal-300 font-mono text-xs hover:border-teal-400/40 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 animate-fade-in">
            <div className="card p-4 sm:p-5 space-y-3">
              <h3 className="font-display font-semibold text-white text-sm">Informations</h3>
              {projet.date && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-calendar text-teal-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-mono">Date</p>
                    <p className="text-sm text-slate-300">
                      {new Date(projet.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
              {projet.categorie && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-tag text-teal-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-mono">Catégorie</p>
                    <p className="text-sm text-slate-300">{projet.categorie}</p>
                  </div>
                </div>
              )}
            </div>

            {projet.github && (
              <a href={projet.github} target="_blank" rel="noreferrer"
                className="card p-3 sm:p-4 flex items-center gap-3 hover:border-teal-400/30 transition-all group block">
                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <i className="fab fa-github text-white text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-semibold text-white group-hover:text-teal-400 transition-colors">Voir sur GitHub</p>
                  <p className="text-xs text-slate-600 font-mono truncate">{projet.github.replace('https://github.com/', '')}</p>
                </div>
                <i className="fas fa-external-link-alt text-slate-600 group-hover:text-teal-400 text-xs transition-colors" />
              </a>
            )}

            {!projet.github && projet.rapport && (
              <a href={projet.rapport} target="_blank" rel="noreferrer"
                className="card p-3 sm:p-4 flex items-center gap-3 hover:border-red-400/30 transition-all group block">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-file-pdf text-red-400 text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-semibold text-white group-hover:text-red-400 transition-colors">Rapport du projet</p>
                  <p className="text-xs text-slate-600 font-mono">Télécharger le PDF</p>
                </div>
                <i className="fas fa-download text-slate-600 group-hover:text-red-400 text-xs transition-colors" />
              </a>
            )}

            {isAdmin && (
              <div className="card p-4 space-y-2">
                <button onClick={() => onEdit(projet)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 hover:bg-teal-400/20 font-display font-semibold text-sm transition-all">
                  <i className="fas fa-pen text-xs" />Modifier le projet
                </button>
                {/* Utilise _id MongoDB */}
                <button onClick={() => onDelete(projet._id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500/10 font-display font-semibold text-sm transition-all">
                  <i className="fas fa-trash text-xs" />Supprimer
                </button>
              </div>
            )}

            <button onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-display font-semibold text-sm transition-all">
              <i className="fas fa-arrow-left text-xs" />Retour aux projets
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
