import { useState, useEffect } from 'react'

const CATEGORIES = ['Développement', 'Réseau & Système', 'Sécurité', 'Cloud AWS']

const EMPTY = {
  libelle: '', description: '', image: '', technologies: '', github: '', rapport: '',
  categorie: 'Développement', date: new Date().toISOString().split('T')[0],
}

export default function AjouterProjet({ projet, onSubmit, onCancel }) {
  const [form,        setForm]        = useState(EMPTY)
  const [imageMode,   setImageMode]   = useState('url')
  const [rapportMode, setRapportMode] = useState('url')
  const [preview,     setPreview]     = useState('')
  const [saving,      setSaving]      = useState(false)

  // ⚠️ MongoDB renvoie _id, pas id
  const isEdit = Boolean(projet?._id)

  useEffect(() => {
    if (projet) {
      setForm({
        ...EMPTY,
        ...projet,
        technologies: Array.isArray(projet.technologies)
          ? projet.technologies.join(', ')
          : projet.technologies || '',
      })
      setPreview(projet.image || '')
    } else {
      setForm(EMPTY); setPreview('')
    }
  }, [projet])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (name === 'image' && imageMode === 'url') setPreview(value)
  }

  const handleImageFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setForm(p => ({ ...p, image: ev.target.result })); setPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const handleRapportFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    if (file.type !== 'application/pdf') { alert('Veuillez sélectionner un fichier PDF.'); return }
    const reader = new FileReader()
    reader.onload = ev => setForm(p => ({ ...p, rapport: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    // on transmet _id si édition pour que App.jsx sache quelle route appeler
    await onSubmit({
      ...form,
      _id: projet?._id,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
    })
    setSaving(false)
  }

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-slide-up">
          <button onClick={onCancel}
            className="w-10 h-10 rounded-xl border border-white/10 hover:border-teal-400/40 flex items-center justify-center text-slate-400 hover:text-teal-400 transition-all flex-shrink-0">
            <i className="fas fa-arrow-left" />
          </button>
          <h2 className="section-title text-white text-2xl sm:text-3xl">
            {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-5 sm:gap-6 animate-fade-in">

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">

            <div className="card p-4 sm:p-6 space-y-4">
              <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                <i className="fas fa-info-circle text-teal-400 text-xs" />Informations
              </h3>
              <div>
                <label className="label-xs">Libellé <span className="text-red-400">*</span></label>
                <input name="libelle" value={form.libelle} onChange={handleChange} required placeholder="Nom du projet" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Description du projet..." className="input-field resize-none" />
              </div>
              <div>
                <label className="label-xs">Catégorie</label>
                <select name="categorie" value={form.categorie} onChange={handleChange} className="input-field bg-slate-900/80">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">Technologies <span className="text-slate-600 font-normal normal-case">séparées par virgule</span></label>
                <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="React, Node.js, Python..." className="input-field" />
              </div>
              <div>
                <label className="label-xs">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label-xs"><i className="fab fa-github mr-1" />Lien GitHub</label>
                <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/user/repo" className="input-field" />
              </div>
            </div>

            {/* Image */}
            <div className="card p-4 sm:p-5 space-y-3">
              <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                <i className="fas fa-image text-teal-400 text-xs" />Image du projet
              </h3>
              <div className="flex gap-2">
                {['url', 'upload'].map(m => (
                  <button key={m} type="button" onClick={() => setImageMode(m)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all
                      ${imageMode === m ? 'bg-teal-400/10 border-teal-400/40 text-teal-400' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>
                    <i className={`fas ${m === 'url' ? 'fa-link' : 'fa-upload'} mr-1.5`} />{m === 'url' ? 'URL' : 'Upload'}
                  </button>
                ))}
              </div>
              {imageMode === 'url'
                ? <input name="image" value={form.image?.startsWith('data:image') ? '' : form.image || ''} onChange={handleChange} placeholder="https://..." className="input-field" />
                : <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-white/10 hover:border-teal-400/40 rounded-xl cursor-pointer transition-all group">
                    <i className="fas fa-cloud-upload-alt text-slate-600 text-xl group-hover:text-teal-400 mb-1 transition-colors" />
                    <span className="text-xs text-slate-500">Sélectionner une image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                  </label>
              }
            </div>

            {/* Rapport PDF */}
            <div className="card p-4 sm:p-5 space-y-3">
              <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                <i className="fas fa-file-pdf text-red-400 text-xs" />Rapport PDF
                <span className="text-xs text-slate-500 font-normal">(si pas de GitHub)</span>
              </h3>
              <div className="flex gap-2">
                {['url', 'upload'].map(m => (
                  <button key={m} type="button" onClick={() => setRapportMode(m)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all
                      ${rapportMode === m ? 'bg-red-400/10 border-red-400/40 text-red-400' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>
                    <i className={`fas ${m === 'url' ? 'fa-link' : 'fa-upload'} mr-1.5`} />{m === 'url' ? 'URL' : 'Upload PDF'}
                  </button>
                ))}
              </div>
              {rapportMode === 'url'
                ? <input name="rapport" value={form.rapport?.startsWith('data:') ? '' : form.rapport || ''} onChange={handleChange} placeholder="https://.../rapport.pdf" className="input-field" />
                : <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-white/10 hover:border-red-400/30 rounded-xl cursor-pointer transition-all group">
                    <i className="fas fa-file-pdf text-slate-600 text-xl group-hover:text-red-400 mb-1 transition-colors" />
                    <span className="text-xs text-slate-500">Sélectionner un PDF</span>
                    {form.rapport?.startsWith('data:application/pdf') && <span className="text-xs text-red-400 mt-0.5">✓ PDF chargé</span>}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleRapportFile} />
                  </label>
              }
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Enregistrement…</>
                  : <><i className={`fas ${isEdit ? 'fa-check' : 'fa-plus'} text-xs`} />{isEdit ? 'Sauvegarder' : 'Ajouter le projet'}</>
                }
              </button>
              <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
            </div>
          </form>

          {/* Aperçu */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Aperçu</p>
              <div className="card overflow-hidden">
                <div className="h-32 bg-slate-900 relative">
                  {preview
                    ? <img src={preview} alt="Aperçu" className="w-full h-full object-cover opacity-80" onError={() => setPreview('')} />
                    : <div className="w-full h-full flex items-center justify-center"><i className="fas fa-image text-3xl text-slate-700" /></div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {form.categorie && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono text-teal-400">
                      {form.categorie}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display font-bold text-white text-sm mb-1 line-clamp-1">{form.libelle || 'Libellé du projet'}</p>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-2">{form.description || 'Description…'}</p>
                  {form.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {form.technologies.split(',').slice(0, 3).map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} className="tech-badge">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
