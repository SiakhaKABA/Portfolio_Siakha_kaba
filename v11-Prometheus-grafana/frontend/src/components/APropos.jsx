import { useState, useEffect, useCallback } from 'react'

const API = '/api'

const TABS = [
  { key: 'formations',     label: 'Formation',     icon: 'fa-graduation-cap', color: 'teal'    },
  { key: 'certifications', label: 'Certification', icon: 'fa-award',          color: 'violet'  },
  { key: 'experiences',    label: 'Expérience',    icon: 'fa-briefcase',      color: 'amber'   },
  { key: 'competences',    label: 'Compétences',   icon: 'fa-bolt',           color: 'emerald' },
]

const COLORS = {
  teal:    { badge: 'text-teal-400 bg-teal-400/10 border-teal-400/30',       bar: 'bg-teal-400' },
  violet:  { badge: 'text-violet-400 bg-violet-400/10 border-violet-400/30', bar: 'bg-violet-400' },
  amber:   { badge: 'text-amber-400 bg-amber-400/10 border-amber-400/30',    bar: 'bg-amber-400' },
  emerald: { badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', bar: 'bg-emerald-400' },
}

const FIELDS = {
  formations:     [
    { name: 'diplome',       label: 'Diplôme / Titre',   type: 'text',     required: true,  placeholder: 'Master en Réseaux...' },
    { name: 'etablissement', label: 'Établissement',     type: 'text',     required: true,  placeholder: 'Université ...' },
    { name: 'periode',       label: 'Période',           type: 'text',     required: true,  placeholder: '2021 – 2023' },
    { name: 'description',   label: 'Description',       type: 'textarea', required: false, placeholder: 'Spécialisation en...' },
  ],
  certifications: [
    { name: 'titre',       label: 'Titre',       type: 'text',     required: true,  placeholder: 'Cybersecurity Essentials' },
    { name: 'organisme',   label: 'Organisme',   type: 'text',     required: true,  placeholder: 'Cisco Networking Academy' },
    { name: 'date',        label: 'Date',        type: 'text',     required: true,  placeholder: 'Septembre 2023' },
    { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Compétences validées...' },
  ],
  experiences:    [
    { name: 'poste',       label: 'Poste / Mission',      type: 'text',     required: true,  placeholder: 'Audit de Sécurité' },
    { name: 'entreprise',  label: 'Entreprise',           type: 'text',     required: true,  placeholder: 'Projet Académique...' },
    { name: 'periode',     label: 'Période',              type: 'text',     required: true,  placeholder: '2021 – 2023' },
    { name: 'description', label: 'Description missions', type: 'textarea', required: false, placeholder: 'Réalisation...' },
  ],
  competences:    [
    { name: 'categorie', label: 'Catégorie',                type: 'text',   required: true,  placeholder: 'Réseaux & Systèmes' },
    { name: 'niveau',    label: 'Niveau (%)',               type: 'number', required: false, min: 0, max: 100, placeholder: '85' },
    { name: 'outils',    label: 'Outils (virgule-séparés)', type: 'text',   required: false, placeholder: 'TCP/IP, VLAN, OSPF' },
  ],
}

const EMPTY = {
  formations:     { diplome: '', etablissement: '', periode: '', description: '' },
  certifications: { titre: '', organisme: '', date: '', description: '' },
  experiences:    { poste: '', entreprise: '', periode: '', description: '' },
  competences:    { categorie: '', niveau: 70, outils: '' },
}

export default function APropos({ isAdmin, showToast, token }) {
  const [tab,       setTab]       = useState('formations')
  const [data,      setData]      = useState({ formations: [], certifications: [], experiences: [], competences: [] })
  const [loading,   setLoading]   = useState({})
  const [modal,     setModal]     = useState(null)
  const [form,      setForm]      = useState({})
  const [saving,    setSaving]    = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const fetchSection = useCallback(async (section) => {
    setLoading(p => ({ ...p, [section]: true }))
    try {
      const res = await fetch(`${API}/${section}`)
      const d   = await res.json()
      setData(p => ({ ...p, [section]: d }))
    } catch { showToast(`Erreur chargement ${section}`, 'error') }
    finally { setLoading(p => ({ ...p, [section]: false })) }
  }, [showToast])

  useEffect(() => { TABS.forEach(t => fetchSection(t.key)) }, [fetchSection])

  const openAdd  = () => { setForm({ ...EMPTY[tab] }); setModal({ mode: 'add' }) }
  const openEdit = (item) => {
    const f = { ...item }
    if (tab === 'competences' && Array.isArray(f.outils)) f.outils = f.outils.join(', ')
    setForm(f)
    setModal({ mode: 'edit', item })
  }
  const closeModal = () => { setModal(null); setForm({}) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const isEdit = modal.mode === 'edit'
      let payload = { ...form }
      if (tab === 'competences') {
        payload.outils = typeof payload.outils === 'string'
          ? payload.outils.split(',').map(s => s.trim()).filter(Boolean)
          : payload.outils
        payload.niveau = Number(payload.niveau)
      }
      // ⚠️ MongoDB utilise _id
      const url    = isEdit ? `${API}/${tab}/${modal.item._id}` : `${API}/${tab}`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      await fetchSection(tab)
      showToast(isEdit ? '✓ Modifié' : '✓ Ajouté')
      closeModal()
    } catch { showToast('Erreur sauvegarde', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${tab}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      await fetchSection(tab)
      showToast('✓ Supprimé')
    } catch { showToast('Erreur suppression', 'error') }
    finally { setConfirmId(null) }
  }

  const tabCfg = TABS.find(t => t.key === tab)
  const c      = COLORS[tabCfg.color]
  const items  = data[tab] || []

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-slide-up">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 text-xs ${c.badge}`}>
            <i className="fas fa-user text-xs" />
            <span className="font-mono tracking-widest uppercase">À Propos</span>
          </div>
          <h2 className="section-title text-white mb-2">
            Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Profil</span>
          </h2>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base">
            Ingénieur en réseaux et sécurité informatique passionné par la cybersécurité.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map(t => {
            const tc     = COLORS[t.color]
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all whitespace-nowrap border
                  ${active ? `${tc.badge} border-current` : 'text-slate-500 hover:text-slate-300 bg-slate-800/40 border-transparent'}`}>
                <i className={`fas ${t.icon} text-xs`} />
                <span>{t.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${active ? '' : 'bg-slate-700 text-slate-500'}`}>
                  {data[t.key]?.length || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* En-tête section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c.badge}`}>
              <i className={`fas ${tabCfg.icon} text-sm`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm sm:text-base">{tabCfg.label}</h3>
              <p className="text-xs text-slate-500 font-mono">{items.length} entrée{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {isAdmin && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border bg-teal-400/10 border-teal-400/40 text-teal-400 hover:bg-teal-400/20 text-xs sm:text-sm font-display font-semibold transition-all">
              <i className="fas fa-plus text-xs" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          )}
        </div>

        {/* Chargement */}
        {loading[tab] && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
          </div>
        )}

        {/* Vide */}
        {!loading[tab] && items.length === 0 && (
          <div className="card flex flex-col items-center py-20 text-center">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 ${c.badge}`}>
              <i className={`fas ${tabCfg.icon} text-2xl`} />
            </div>
            <p className="text-slate-400 font-display font-medium">Aucune entrée</p>
            {isAdmin && <button onClick={openAdd} className="btn-primary mt-4 text-xs"><i className="fas fa-plus mr-2" />Ajouter</button>}
          </div>
        )}

        {/* Grille */}
        {!loading[tab] && items.length > 0 && (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {[...items].reverse().map((item, idx) => (
              <ItemCard
                key={item._id}
                item={item}
                section={tab}
                c={c}
                tabCfg={tabCfg}
                isAdmin={isAdmin}
                onEdit={() => openEdit(item)}
                onDelete={() => setConfirmId(item._id)}
                idx={idx}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <CrudModal
          mode={modal.mode}
          tabCfg={tabCfg}
          c={c}
          fields={FIELDS[tab]}
          form={form}
          saving={saving}
          onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
          onSubmit={handleSave}
          onClose={closeModal}
        />
      )}

      {confirmId && (
        <ConfirmModal onConfirm={() => handleDelete(confirmId)} onCancel={() => setConfirmId(null)} />
      )}
    </section>
  )
}

function ItemCard({ item, section, c, tabCfg, isAdmin, onEdit, onDelete, idx }) {
  return (
    <div className="card p-4 sm:p-5 hover:border-white/10 transition-all group animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${c.badge}`}>
          <i className={`fas ${tabCfg.icon} text-xs`} />
        </div>
        {isAdmin && (
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-7 h-7 rounded-lg bg-teal-400/10 hover:bg-teal-400/20 text-teal-400 flex items-center justify-center border border-teal-400/20 transition-all">
              <i className="fas fa-pen text-[10px]" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/20 transition-all">
              <i className="fas fa-trash text-[10px]" />
            </button>
          </div>
        )}
      </div>

      {section === 'formations' && (
        <>
          <h4 className="font-display font-bold text-white text-sm leading-snug mb-1">{item.diplome}</h4>
          <p className={`text-xs font-mono mb-2 ${c.badge.split(' ')[0]}`}>{item.etablissement}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono mb-2 ${c.badge}`}>
            <i className="fas fa-calendar-alt text-[9px]" />{item.periode}
          </span>
          {item.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.description}</p>}
        </>
      )}
      {section === 'certifications' && (
        <>
          <h4 className="font-display font-bold text-white text-sm leading-snug mb-1">{item.titre}</h4>
          <p className={`text-xs font-mono mb-2 ${c.badge.split(' ')[0]}`}>{item.organisme}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono mb-2 ${c.badge}`}>
            <i className="fas fa-calendar-check text-[9px]" />{item.date}
          </span>
          {item.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.description}</p>}
        </>
      )}
      {section === 'experiences' && (
        <>
          <h4 className="font-display font-bold text-white text-sm leading-snug mb-1">{item.poste}</h4>
          <p className={`text-xs font-mono mb-2 ${c.badge.split(' ')[0]}`}>{item.entreprise}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono mb-2 ${c.badge}`}>
            <i className="fas fa-calendar text-[9px]" />{item.periode}
          </span>
          {item.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.description}</p>}
        </>
      )}
      {section === 'competences' && (
        <>
          <h4 className="font-display font-bold text-white text-sm mb-3">{item.categorie}</h4>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-mono">Maîtrise</span>
              <span className={`font-mono font-bold ${c.badge.split(' ')[0]}`}>{item.niveau}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${c.bar} rounded-full transition-all duration-1000`} style={{ width: `${item.niveau}%` }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(item.outils) ? item.outils : []).map(o => (
              <span key={o} className={`px-2 py-0.5 rounded text-xs font-mono border ${c.badge}`}>{o}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CrudModal({ mode, tabCfg, c, fields, form, saving, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/70 animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c.badge}`}>
              <i className={`fas ${tabCfg.icon} text-sm`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm">{mode === 'add' ? 'Ajouter' : 'Modifier'} — {tabCfg.label}</h3>
              <p className="text-xs text-slate-500">Remplissez les champs ci-dessous</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <i className="fas fa-times text-sm" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-display">
                {f.label}{f.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {f.type === 'textarea'
                ? <textarea name={f.name} value={form[f.name] || ''} onChange={onChange} placeholder={f.placeholder} rows={3} className="input-field resize-none" />
                : <input type={f.type || 'text'} name={f.name} value={form[f.name] ?? ''} onChange={onChange} placeholder={f.placeholder} required={f.required} min={f.min} max={f.max} className="input-field" />
              }
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving
                ? <><div className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Enregistrement…</>
                : <><i className={`fas ${mode === 'add' ? 'fa-plus' : 'fa-check'} text-xs`} />{mode === 'add' ? 'Ajouter' : 'Sauvegarder'}</>
              }
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/70 animate-fade-in" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="card w-full max-w-sm p-6 animate-scale-in text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash text-red-400 text-lg" />
        </div>
        <h3 className="font-display font-bold text-white mb-2">Confirmer la suppression</h3>
        <p className="text-slate-400 text-sm mb-5">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 font-display font-semibold text-sm transition-all">
            Supprimer
          </button>
          <button onClick={onCancel} className="flex-1 btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  )
}
