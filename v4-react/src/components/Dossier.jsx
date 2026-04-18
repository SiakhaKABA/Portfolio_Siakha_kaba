import Projet from './Projet'

export default function Dossier({
  projets, loading, error, searchQuery, setSearchQuery,
  onVoirDetail, onSupprimer, onAjouter
}) {
  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-teal-400 font-medium mb-3 tracking-widest text-sm uppercase">Mes Projets</p>
          <h2 className="section-title mb-4">
            <span className="text-white">Projets </span>
            <span className="text-teal-400">Réalisés</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Une sélection de projets issus de nos expériences professionnelles et personnelles.
          </p>
        </div>

        {/* Search + Add bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet ou une technologie..."
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={onAjouter}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl leading-none">+</span>
            Nouveau projet
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Chargement des projets...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-white font-display font-bold text-xl mb-2">Erreur de connexion</h3>
            <p className="text-slate-400 text-sm mb-1">{error}</p>
            <p className="text-slate-500 text-xs">Assurez-vous que json-server est lancé sur le port 3001</p>
            <code className="block mt-4 px-4 py-2 bg-slate-800 rounded-lg text-teal-400 text-xs">
              npm run server
            </code>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-slate-400 text-sm">
                {projets.length} projet{projets.length !== 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Grid */}
            {projets.length === 0 ? (
              <div className="text-center py-32">
                <div className="text-6xl mb-6">📂</div>
                <h3 className="text-white font-display font-bold text-2xl mb-3">
                  {searchQuery ? 'Aucun résultat' : 'Dossier vide'}
                </h3>
                <p className="text-slate-400 mb-8">
                  {searchQuery
                    ? 'Aucun projet ne correspond à votre recherche.'
                    : 'Commencez par ajouter votre premier projet !'}
                </p>
                {!searchQuery && (
                  <button onClick={onAjouter} className="btn-primary">
                    + Ajouter un projet
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projets.map((projet, i) => (
                  <div
                    key={projet.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                  >
                    <Projet
                      projet={projet}
                      onVoirDetail={onVoirDetail}
                      onSupprimer={onSupprimer}
                    />
                  </div>
                ))}

                {/* Add card */}
                <button
                  onClick={onAjouter}
                  className="card border-2 border-dashed border-white/10 h-full min-h-64 flex flex-col items-center justify-center gap-4 hover:border-teal-400/40 hover:bg-teal-400/5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-700/80 group-hover:bg-teal-400/20 flex items-center justify-center transition-colors duration-300">
                    <span className="text-3xl text-teal-400">+</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-teal-400 text-sm font-medium transition-colors duration-300">
                    Ajouter un projet
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
