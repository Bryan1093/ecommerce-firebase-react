import { usePreferences } from '../context/PreferencesContext'

function Footer() {
  const { t } = usePreferences()

  return (
    <footer className="site-footer">
      <small>{t('footer.text', { year: new Date().getFullYear() })}</small>
    </footer>
  )
}

export default Footer
