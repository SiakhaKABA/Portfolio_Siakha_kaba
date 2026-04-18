import { useState, useEffect } from 'react'

export default function AjouterProjet({ projetAEditer, onAjouter, onModifier, onAnnuler }) {
  const isEdit = !!projetAEditer

  const [form, setForm] = useState({
    libelle: '',
    description: '',
    image: '',
    technologies: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill form if editing
  useEffect(() => {
    if (projetAEditer) {
      setForm({
        libelle: projetAEditer.libelle || '',
        description: projetAEditer.description || '',
        image: projetAEditer.image || '',
        technologies: Array.isArray(projetAEditer.technologies)
          ? projetAEditer.technologies.join(', ')
          : projetAEditer.technologies || '',
      })
      setImagePreview(projetAEditer.image || '')
    }
  }, [projetAEditer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (name === 'image') setImagePreview(value)
  }

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setForm(prev => ({ ...prev, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const newErrors = {}
    if (!form.libelle.trim()) newErrors.libelle = 'Le libellé est requis.'
    if (!form.description.trim()) newErrors.description = 'La description est requise.'
    if (!form.technologies.trim()) newErrors.technologies = 'Au moins une technologie est requise.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const projetData = {
      libelle: form.libelle.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      date: projetAEditer?.date || new Date().toISOString().split('T')[0],
    }

    if (isEdit) {
      await onModifier(projetAEditer.id, projetData)
    } else {
      await onAjouter(projetData)
    }
    setSubmitting(false)
  }

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-teal-400 font-medium mb-3 tracking-widest text-sm uppercase">
            {isEdit ? 'Modifier' : 'Nouveau projet'}
          </p>
          <h2 className="section-title">
            <span className="text-white">{isEdit ? 'Éditer le ' : 'Ajouter un '}</span>
            <span className="text-teal-400">Projet</span>
          </h2>
        </div>

        {/* Form card */}
        <div className="card p-8 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Libellé */}
            <div>
              <label className="block mb-2 text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Libellé <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="libelle"
                value={form.libelle}
                onChange={handleChange}
                placeholder="Ex: Application E-commerce"
                className={`input-field ${errors.libelle ? 'border-red-400 focus:border-red-400' : ''}`}
              />
              {errors.libelle && <p className="mt-1 text-red-400 text-xs">{errors.libelle}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez votre projet, ses fonctionnalités, son contexte..."
                className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
              />
              {errors.description && <p className="mt-1 text-red-400 text-xs">{errors.description}</p>}
            </div>

            {/* Image */}
            <div className="space-y-4">
              <label className="block text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Image du projet
              </label>

              {/* File upload */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-400/10 text-teal-400 border border-teal-400/30 rounded-xl font-medium cursor-pointer hover:bg-teal-400/20 transition-all duration-200 whitespace-nowrap text-sm"
                >
                  <i className="fas fa-upload" />
                  Choisir un fichier
                </label>
                <span className="text-slate-500 text-sm truncate flex-1">
                  {imageFile ? imageFile.name : 'Aucun fichier choisi'}
                </span>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs">OU URL</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* URL input */}
              <input
                type="url"
                name="image"
                value={form.image.startsWith('data:') ? '' : form.image}
                onChange={handleChange}
                placeholder="https://exemple.com/image.jpg"
                className="input-field"
              />

              {/* Preview */}
              {imagePreview && (
                <div className="relative h-40 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setImageFile(null); setForm(p => ({ ...p, image: '' })) }}
                      className="w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                    Aperçu
                  </div>
                </div>
              )}
            </div>

            {/* Technologies */}
            <div>
              <label className="block mb-2 text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Technologies <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Tailwind CSS..."
                className={`input-field ${errors.technologies ? 'border-red-400' : ''}`}
              />
              <p className="mt-1.5 text-slate-500 text-xs">Séparez les technologies par des virgules</p>
              {errors.technologies && <p className="mt-1 text-red-400 text-xs">{errors.technologies}</p>}

              {/* Tech preview badges */}
              {form.technologies && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {form.technologies.split(',').map(t => t.trim()).filter(Boolean).map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={onAnnuler}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                )}
                {isEdit ? '✏️ Mettre à jour' : '+ Ajouter le projet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
