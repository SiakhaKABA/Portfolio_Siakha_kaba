import Projet from './Projet'

const CATEGORIES = [
  { key: 'Tous',             icon: 'fa-border-all' },
  { key: 'Développement',    icon: 'fa-code' },
  { key: 'Réseau & Système', icon: 'fa-network-wired' },
  { key: 'Sécurité',         icon: 'fa-shield-alt' },
  { key: 'Cloud AWS',        icon: 'fa-cloud' },
]

export default function Dossier({ projets, search, setSearch, onView, onEdit, onDelete, onAdd, loading, isAdmin, activeFilter, setActiveFilter }) {

  const filtered = projets.filter(p => {
    const matchSearch = !search
      || p.libelle?.toLowerCase().includes(search.toLowerCase())
      || p.description?.toLowerCase().includes(search.toLowerCase())
      || p.technologies?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = activeFilter === 'Tous' || p.categorie === activeFilter
    return matchSearch && matchCat
  })

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 mb-3">
              <i className="fas fa-folder-open text-teal-400 text-xs" />
              <span className="text-teal-400 text-xs font-mono tracking-widest uppercase">Portfolio</span>
            </div>
            <h2 className="section-title text-white">
              Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Projets</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">{filtered.length} projet{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <div className="relative flex-1 sm:flex-none">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="input-field pl-8 w-full sm:w-44" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <i className="fas fa-times text-xs" />
                </button>
              )}
            </div>
            {isAdmin && (
              <button onClick={onAdd} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <i className="fas fa-plus text-xs" /><span className="hidden sm:inline">Nouveau</span> projet
              </button>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(({ key, icon }) => (
            <button key={key} onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-display font-semibold whitespace-nowrap transition-all border
                ${activeFilter === key
                  ? 'bg-teal-400 text-gray-900 border-teal-400 shadow-lg shadow-teal-400/25'
                  : 'bg-slate-800/60 text-slate-400 border-white/10 hover:border-teal-400/30 hover:text-teal-400'}`}>
              <i className={`fas ${icon} text-xs`} />{key}
            </button>
          ))}
        </div>

        {/* Chargement */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Chargement des projets…</p>
          </div>
        )}

        {/* Vide */}
        {!loading && filtered.length === 0 && (
          <div className="card flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mb-4">
              <i className="fas fa-folder-open text-teal-400 text-2xl" />
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-500 text-sm mb-4">
              {search || activeFilter !== 'Tous' ? 'Essayez un autre filtre.' : 'Les projets apparaîtront ici.'}
            </p>
            {(search || activeFilter !== 'Tous') && (
              <button onClick={() => { setSearch(''); setActiveFilter('Tous') }} className="btn-secondary text-xs">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Grille */}
        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p, i) => (
              <Projet
                key={p._id}
                projet={p}
                index={i}
                isAdmin={isAdmin}
                onView={() => onView(p)}
                onEdit={() => onEdit(p)}
                onDelete={() => onDelete(p._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
