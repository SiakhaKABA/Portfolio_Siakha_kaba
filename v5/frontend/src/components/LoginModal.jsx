import { useState } from 'react'

export default function LoginModal({ onLogin, onClose }) {
  const [pwd,     setPwd]     = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onLogin(pwd)
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect')
      setShaking(true)
      setPwd('')
      setTimeout(() => setShaking(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center modal-overlay bg-slate-900/70 px-4" onClick={onClose}>
      <div className={`card p-6 sm:p-8 w-full max-w-sm animate-scale-in ${shaking ? 'animate-shake' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
            <i className="fas fa-lock text-teal-400 text-xl" />
          </div>
        </div>
        <h2 className="text-white font-display font-bold text-xl text-center mb-1">Espace propriétaire</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Entrez votre mot de passe pour accéder aux fonctions d'administration.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password" value={pwd}
              onChange={e => { setPwd(e.target.value); setError('') }}
              placeholder="Mot de passe" autoFocus disabled={loading}
              className={`input-field text-center tracking-widest ${error ? 'border-red-400 focus:border-red-400' : ''}`}
            />
            {error && <p className="mt-2 text-red-400 text-xs text-center">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={loading}>Annuler</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading
                ? <><i className="fas fa-spinner fa-spin mr-2 text-xs" />Vérification…</>
                : <><i className="fas fa-unlock mr-2 text-xs" />Connexion</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
