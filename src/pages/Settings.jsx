import AdminLayout from '../components/admin/AdminLayout'
import { usePreferences } from '../context/PreferencesContext'

function Settings() {
  const { language, setLanguage, languageOptions, theme, setTheme, themeOptions, t } = usePreferences()

  return (
    <AdminLayout
      eyebrow={t('settings.eyebrow')}
      title={t('settings.title')}
      breadcrumbs={[t('navigation.panel'), t('navigation.settings')]}
    >
      <section className="settings-grid">
        <article className="section-card settings-card settings-intro-card">
          <header className="section-header">
            <h3>{t('settings.title')}</h3>
            <p>{t('settings.subtitle')}</p>
          </header>
        </article>

        <article className="section-card settings-card">
          <header className="section-header">
            <h3>{t('settings.appearanceTitle')}</h3>
            <p>{t('settings.appearanceDescription')}</p>
          </header>
          <label className="settings-field">
            <span>{t('settings.themeLabel')}</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value)} className="catalog-select">
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
            </select>
          </label>
        </article>

        <article className="section-card settings-card">
          <header className="section-header">
            <h3>{t('settings.languageTitle')}</h3>
            <p>{t('settings.languageDescription')}</p>
          </header>
          <label className="settings-field">
            <span>{t('settings.languageLabel')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="catalog-select">
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.key)}
                </option>
              ))}
            </select>
          </label>
        </article>

        <article className="section-card settings-card settings-summary-card">
          <header className="section-header">
            <h3>{t('settings.previewTitle')}</h3>
          </header>
          <dl className="settings-summary-list">
            <div>
              <dt>{t('settings.previewTheme')}</dt>
              <dd>{t(themeOptions.find((option) => option.value === theme)?.key || 'themes.light')}</dd>
            </div>
            <div>
              <dt>{t('settings.previewLanguage')}</dt>
              <dd>{t(languageOptions.find((option) => option.value === language)?.key || 'languages.spanish')}</dd>
            </div>
          </dl>
          <p className="settings-saved-copy">{t('settings.savedMessage')}</p>
        </article>
      </section>
    </AdminLayout>
  )
}

export default Settings
