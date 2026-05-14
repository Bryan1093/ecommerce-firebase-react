import AdminLayout from '../../components/admin/AdminLayout'
import { useStore } from '../../context/StoreContext'

function Marketing() {
  const { promotions } = useStore()

  return (
    <AdminLayout eyebrow="Growth" title="Promociones y contenido" breadcrumbs={['Admin', 'Marketing']}>
      <section className="modern-grid three-cols">
        {promotions.map((promotion) => (
          <article key={promotion.id} className="feature-panel">
            <p className="item-category">{promotion.status}</p>
            <h3>{promotion.name}</h3>
            <p>{promotion.description}</p>
            <div className="catalog-actions">
              <button type="button" className="btn btn-ghost">
                Editar campaña
              </button>
              <button type="button" className="btn btn-primary">
                Publicar banner
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="section-card">
        <header className="section-header">
          <h3>Próximos módulos premium</h3>
          <p>Roadmap visual para diferenciar la operación comercial.</p>
        </header>
        <ul className="chip-list">
          <li className="chip">Búsqueda inteligente</li>
          <li className="chip">Motor de recomendaciones</li>
          <li className="chip">Segmentación por ticket</li>
          <li className="chip">Loyalty y puntos</li>
          <li className="chip">Automatizaciones WhatsApp</li>
        </ul>
      </section>
    </AdminLayout>
  )
}

export default Marketing
