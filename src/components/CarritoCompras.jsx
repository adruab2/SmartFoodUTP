const COSTO_SERVICIO = 1.5
const DESCUENTO = 0

// Convierte 'S/ 12.00' en 12
const aNumero = (precio) => parseFloat(precio.replace('S/', '').trim())
const soles = (valor) => 'S/ ' + valor.toFixed(2)

function CarritoCompras({ carrito, onCambiarCantidad, onEliminar, onVolver, onConfirmar }) {
  const subtotal = carrito.reduce((total, item) => total + aNumero(item.precio) * item.cantidad, 0)
  const total = subtotal - DESCUENTO + (carrito.length > 0 ? COSTO_SERVICIO : 0)

  const botonCantidad = (deshabilitado) => ({
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: deshabilitado ? '#f1f5f9' : '#dcfce7',
    color: deshabilitado ? '#94a3b8' : '#166534',
    fontWeight: '700',
    fontSize: '16px',
    cursor: deshabilitado ? 'not-allowed' : 'pointer'
  })

  return (
    <main style={{ padding: '35px 40px', maxWidth: '1000px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
      <button
        onClick={onVolver}
        style={{ background: 'none', border: 'none', padding: 0, marginBottom: '16px', color: '#475569', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
      >
        ← Volver al menú
      </button>

      <h2 style={{ fontSize: '24px', color: '#1e293b', margin: '0 0 8px 0', fontWeight: '800' }}>Carrito de Compras</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 25px 0' }}>
        Revisa tu pedido antes de confirmar. Puedes editar cantidades o eliminar productos antes de pagar.
      </p>

      {carrito.length === 0 ? (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '15px' }}>Tu carrito está vacío. Elige algo del menú para empezar tu pedido.</p>
          <button
            onClick={onVolver}
            style={{ padding: '10px 20px', backgroundColor: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
          >
            Ver el menú
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          {/* Lista de productos */}
          <div style={{ flex: '2 1 420px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {carrito.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{item.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                      {item.categoria}
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: '#991b1b' }}>
                      {soles(aNumero(item.precio) * item.cantidad)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button aria-label="Quitar una unidad" onClick={() => onCambiarCantidad(item.id, -1)} disabled={item.cantidad <= 1} style={botonCantidad(item.cantidad <= 1)}>−</button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{item.cantidad}</span>
                    <button aria-label="Agregar una unidad" onClick={() => onCambiarCantidad(item.id, 1)} style={botonCantidad(false)}>+</button>
                  </div>

                  <button
                    onClick={() => onEliminar(item.id)}
                    style={{ background: 'none', border: 'none', padding: 0, color: '#b91c1c', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <aside style={{ flex: '1 1 280px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>Resumen del Pedido</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
              <span>Subtotal</span><strong style={{ color: '#1e293b' }}>{soles(subtotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
              <span>Descuento</span><strong style={{ color: '#15803d' }}>{soles(DESCUENTO)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              <span>Servicio</span><strong style={{ color: '#1e293b' }}>{soles(COSTO_SERVICIO)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>Total a Pagar</span>
              <span style={{ fontSize: '19px', fontWeight: '800', color: '#991b1b' }}>{soles(total)}</span>
            </div>

            <button
              onClick={onConfirmar}
              style={{ width: '100%', padding: '12px', backgroundColor: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
            >
              Confirmar Pedido
            </button>
            <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#64748b' }}>Puedes pagar con tarjeta, Yape o efectivo en caja.</p>
          </aside>
        </div>
      )}
    </main>
  )
}

export default CarritoCompras