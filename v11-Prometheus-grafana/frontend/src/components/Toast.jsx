import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const isError = type === 'error'

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-up max-w-xs sm:max-w-sm backdrop-blur-sm
        ${isError ? 'bg-red-500/10 border-red-500/40 text-red-200' : 'bg-teal-400/10 border-teal-400/40 text-teal-200'}`}
      role="alert"
    >
      <i className={`fas ${isError ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-teal-400'} mt-0.5 flex-shrink-0`} />
      <span className="text-sm leading-snug flex-1">{message}</span>
      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors flex-shrink-0 ml-1">
        <i className="fas fa-times text-xs" />
      </button>
    </div>
  )
}
