import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setSending(false)
    setForm({ prenom: '', nom: '', email: '', sujet: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const infos = [
    { icon: 'fa-map-marker-alt', label: 'Localisation', value: 'Dakar, Sénégal' },
    { icon: 'fa-envelope', label: 'Email', value: 'contact@portfolio-g3.com' },
    { icon: 'fa-phone', label: 'Téléphone', value: '+221 77 200 08 13' },
  ]

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-teal-400 font-medium mb-3 tracking-widest text-sm uppercase">Prendre contact</p>
          <h2 className="section-title">
            <span className="text-white">Contactez-</span>
            <span className="text-teal-400">nous</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-md mx-auto">
            Une question, une opportunité ? Nous vous répondrons dans les meilleurs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left info panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-6">
              <h3 className="text-white font-display font-semibold text-lg">Coordonnées</h3>
              {infos.map((info, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${info.icon} text-teal-400 text-sm`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider">{info.label}</p>
                    <p className="text-white text-sm mt-0.5">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="card p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-4">Réseaux sociaux</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: 'fa-linkedin', href: 'https://linkedin.com', color: 'hover:text-blue-400' },
                  { icon: 'fa-github', href: '#', color: 'hover:text-slate-200' },
                  { icon: 'fa-whatsapp', href: 'https://wa.me/221772000813', color: 'hover:text-green-400' },
                  { icon: 'fa-instagram', href: '#', color: 'hover:text-pink-400' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 ${s.color} hover:border-teal-400/30 transition-all duration-200`}
                  >
                    <i className={`fab ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 animate-scale-in">
                  <div className="w-20 h-20 rounded-full bg-teal-400/20 flex items-center justify-center text-4xl">
                    ✅
                  </div>
                  <h3 className="text-white font-display font-bold text-xl">Message envoyé !</h3>
                  <p className="text-slate-400 text-center max-w-xs">
                    Merci pour votre message. Nous vous répondrons très prochainement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Prénom</label>
                      <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Votre prénom" required className="input-field" />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Nom</label>
                      <input name="nom" value={form.nom} onChange={handleChange} placeholder="Votre nom" required className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" required className="input-field" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Sujet</label>
                    <input name="sujet" value={form.sujet} onChange={handleChange} placeholder="Sujet de votre message" className="input-field" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Écrivez votre message ici..." required className="input-field resize-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
