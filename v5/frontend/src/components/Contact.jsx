import { useState } from 'react'

export default function Contact({ showToast }) {
  const [form,    setForm]    = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    showToast('✓ Message envoyé ! Je vous répondrai rapidement.')
    setForm({ nom: '', email: '', sujet: '', message: '' })
    setSending(false)
  }

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <section className="min-h-screen py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10 sm:mb-14 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 mb-4">
            <i className="fas fa-envelope text-teal-400 text-xs" />
            <span className="text-teal-400 text-xs font-mono tracking-widest uppercase">Contact</span>
          </div>
          <h2 className="section-title text-white mb-3">
            Travaillons <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">ensemble</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
            Disponible pour des missions en cybersécurité, administration réseau ou projets IT.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-5 sm:gap-8">

          {/* Infos */}
          <div className="md:col-span-2 space-y-4 animate-slide-up">
            <div className="card p-4 sm:p-6 space-y-4">
              <h3 className="font-display font-bold text-white">Coordonnées</h3>
              {[
                { icon: 'fa-envelope',     label: 'Email',       value: 'siakha.kaba49@gmail.com', href: 'mailto:siakha.kaba49@gmail.com', color: 'text-teal-400'    },
                { icon: 'fa-phone',        label: 'Téléphone',   value: '+221 77 200 08 13',        href: 'tel:+221772000813',              color: 'text-emerald-400' },
                { icon: 'fa-map-marker-alt', label: 'Localisation', value: 'Dakar, Sénégal',       href: null,                             color: 'text-violet-400'  },
              ].map(({ icon, label, value, href, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${icon} ${color} text-sm`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-mono uppercase tracking-wider">{label}</p>
                    {href
                      ? <a href={href} className={`text-sm ${color} hover:opacity-80 transition-opacity font-medium`}>{value}</a>
                      : <p className="text-sm text-slate-300">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-display font-semibold text-white text-sm">Disponible</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">
                Ouvert aux opportunités : CDI, CDD, missions freelance en cybersécurité et administration réseau.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Cybersécurité', 'Réseaux', 'Audit', 'Data'].map(s => (
                  <span key={s} className="tech-badge">{s}</span>
                ))}
              </div>
            </div>

            <div className="card p-4 sm:p-5">
              <h4 className="font-display font-semibold text-white text-sm mb-3">Langues</h4>
              {[
                { lang: 'Français', level: 'Courant', pct: 95 },
                { lang: 'Wolof',    level: 'Natif',   pct: 100 },
                { lang: 'Soninké',  level: 'Natif',   pct: 100 },
              ].map(({ lang, level, pct }) => (
                <div key={lang} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{lang}</span>
                    <span className="text-slate-500 font-mono">{level}</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="md:col-span-3 card p-4 sm:p-6 space-y-4 animate-fade-in h-fit">
            <h3 className="font-display font-bold text-white">Envoyer un message</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Nom <span className="text-red-400">*</span></label>
                <input name="nom" value={form.nom} onChange={set('nom')} required placeholder="Votre nom" className="input-field" />
              </div>
              <div>
                <label className="label-xs">Email <span className="text-red-400">*</span></label>
                <input type="email" name="email" value={form.email} onChange={set('email')} required placeholder="email@exemple.com" className="input-field" />
              </div>
            </div>

            <div>
              <label className="label-xs">Sujet <span className="text-red-400">*</span></label>
              <input name="sujet" value={form.sujet} onChange={set('sujet')} required placeholder="Objet du message" className="input-field" />
            </div>

            <div>
              <label className="label-xs">Message <span className="text-red-400">*</span></label>
              <textarea name="message" value={form.message} onChange={set('message')} required rows={5}
                placeholder="Décrivez votre projet ou opportunité..." className="input-field resize-none" />
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
              {sending
                ? <><div className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Envoi en cours…</>
                : <><i className="fas fa-paper-plane text-xs" />Envoyer le message</>
              }
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
