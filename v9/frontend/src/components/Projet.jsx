export default function Projet({ projet, index, isAdmin, onView, onEdit, onDelete }) {
  return (
    <article
      className="card overflow-hidden flex flex-col group hover:border-white/10 transition-all animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 bg-slate-900 flex-shrink-0 overflow-hidden">
        {projet.image ? (
          <img src={projet.image} alt={projet.libelle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            onError={e => e.target.style.display = 'none'} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-code text-4xl text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {projet.categorie && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono text-teal-400">
            {projet.categorie}
          </div>
        )}

        {projet.github ? (
          <a href={projet.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/90 border border-white/10 hover:border-teal-400/40 text-xs font-mono text-slate-300 hover:text-teal-400 transition-all">
            <i className="fab fa-github" />GitHub
          </a>
        ) : projet.rapport ? (
          <a href={projet.rapport} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/90 border border-white/10 hover:border-red-400/40 text-xs font-mono text-slate-300 hover:text-red-400 transition-all">
            <i className="fas fa-file-pdf" />Rapport
          </a>
        ) : null}
      </div>

      {/* Contenu */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <button onClick={onView}
          className="text-left font-display font-bold text-white hover:text-teal-400 transition-colors text-sm sm:text-base leading-snug mb-2 line-clamp-2">
          {projet.libelle}
        </button>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-3 flex-grow">{projet.description}</p>

        {projet.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {projet.technologies.slice(0, 4).map(t => <span key={t} className="tech-badge">{t}</span>)}
            {projet.technologies.length > 4 && <span className="tech-badge text-slate-500">+{projet.technologies.length - 4}</span>}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-white/5">
          <button onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-slate-400 hover:text-teal-400 hover:bg-teal-400/5 transition-all">
            <i className="fas fa-eye text-[10px]" />Détail
          </button>
          {isAdmin && (
            <>
              <button onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-slate-400 hover:text-teal-400 hover:bg-teal-400/5 transition-all">
                <i className="fas fa-pen text-[10px]" />Modifier
              </button>
              <button onClick={onDelete}
                className="px-3 py-2 rounded-lg text-xs text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
                <i className="fas fa-trash text-[10px]" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
