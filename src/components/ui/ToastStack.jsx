import { useEffect } from 'react'
import { usePreferences } from '../../context/PreferencesContext'

function ToastStack({ toasts, onDismiss }) {
  const { t } = usePreferences()

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        onDismiss(toast.id)
      }, 2600),
    )

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, onDismiss])

  return (
    <section className="toast-stack" aria-live="polite" aria-label={t('common.notifications')}>
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <p>{toast.message}</p>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label={t('common.close')}>
            ×
          </button>
        </article>
      ))}
    </section>
  )
}

export default ToastStack
