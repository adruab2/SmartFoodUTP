function MenuCafeteria({ usuario, onCerrarSesion }) {
  const productos = [
    { id: 1, nombre: 'Menu Ejecutivo (Chaufa + Refresco)', precio: 'S/ 12.00', categoria: 'Almuerzos' },
    { id: 2, nombre: 'Sandwich de Pollo', precio: 'S/ 5.50', categoria: 'Desayunos' },
    { id: 3, nombre: 'Empanada de Carne', precio: 'S/ 4.00', categoria: 'Snacks' },
    { id: 4, nombre: 'Café Pasado / Infusión', precio: 'S/ 3.00', categoria: 'Bebidas' }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Cabecera Superior SmartFood UTP */}
      <header style={{ backgroundColor: '#ffffff', height: '70px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#b91c1c', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontWeight: '800', fontSize: '16px' }}>
            SmartFood UTP
          </div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Cafetería Institucional</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#334155' }}>
            Bienvenido, <strong>{usuario}</strong>
          </span>
          <button
            onClick={onCerrarSesion}
            style={{
              padding: '7px 14px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido / Catálogo */}
      <main style={{ padding: '35px 40px', maxWidth: '1000px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', color: '#1e293b', marginBottom: '8px', fontWeight: '700' }}>Menú del Día</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Selecciona tus platillos y realiza tu pedido de manera rápida y sencilla.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {productos.map((prod) => (
            <div key={prod.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {prod.categoria}
                </span>
                <h3 style={{ fontSize: '16px', margin: '12px 0 6px 0', color: '#1e293b', fontWeight: '700' }}>{prod.nombre}</h3>
                <p style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', margin: '0 0 15px 0' }}>{prod.precio}</p>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '9px',
                  backgroundColor: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Agregar al Pedido
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MenuCafeteria