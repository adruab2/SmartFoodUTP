import { useState } from 'react'
import CarritoCompras from './CarritoCompras'

function MenuCafeteria({ usuario, onCerrarSesion }) {
  const [verCarrito, setVerCarrito] = useState(false)
  const [carrito, setCarrito] = useState([])
  const [confirmado, setConfirmado] = useState(false)

  const productos = [
    { id: 1, nombre: 'Menu Ejecutivo (pollo + ensalada)', precio: 'S/ 12.00', categoria: 'Almuerzos', imagen: '/img/menu-ejecutivo.jpg' },
    { id: 2, nombre: 'Sandwich de Pollo', precio: 'S/ 5.50', categoria: 'Desayunos', imagen: '/img/sandwich-pollo.jpg' },
    { id: 3, nombre: 'Empanada de Carne', precio: 'S/ 4.00', categoria: 'Snacks', imagen: '/img/empanada-carne.jpg' },
    { id: 4, nombre: 'Café Pasado / Infusión', precio: 'S/ 3.00', categoria: 'Bebidas', imagen: '/img/cafe-pasado.jpg' }
  ]

  const agregarAlPedido = (prod) => {
    setConfirmado(false)
    const existe = carrito.find((item) => item.id === prod.id)
    if (existe) {
      setCarrito(carrito.map((item) => (item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setCarrito([...carrito, { ...prod, cantidad: 1 }])
    }
  }

  const cambiarCantidad = (id, cambio) => {
    setCarrito(carrito.map((item) => (item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + cambio) } : item)))
  }

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id))
  }

  const confirmarPedido = () => {
    setCarrito([])
    setVerCarrito(false)
    setConfirmado(true)
  }

  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0)

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

          {/* Botón del carrito */}
          <button
            onClick={() => setVerCarrito(true)}
            aria-label="Ver carrito de compras"
            style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#dcfce7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            {totalProductos > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px', padding: '0 4px', boxSizing: 'border-box', borderRadius: '9px', backgroundColor: '#b91c1c', color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalProductos}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Contenido: carrito o catálogo */}
      {verCarrito ? (
        <CarritoCompras
          carrito={carrito}
          onCambiarCantidad={cambiarCantidad}
          onEliminar={eliminarDelCarrito}
          onVolver={() => setVerCarrito(false)}
          onConfirmar={confirmarPedido}
        />
      ) : (
        <main style={{ padding: '35px 40px', maxWidth: '1000px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', color: '#1e293b', marginBottom: '8px', fontWeight: '700' }}>Menú del Día</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Selecciona tus platillos y realiza tu pedido de manera rápida y sencilla.</p>

          {confirmado && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534' }}>
              Pedido confirmado.
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {productos.map((prod) => (
              <div key={prod.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  style={{ width: 'calc(100% + 40px)', height: '130px', objectFit: 'cover', margin: '-20px -20px 16px -20px', borderRadius: '10px 10px 0 0', display: 'block' }}
                />
                <div>
                  <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {prod.categoria}
                  </span>
                  <h3 style={{ fontSize: '16px', margin: '12px 0 6px 0', color: '#1e293b', fontWeight: '700' }}>{prod.nombre}</h3>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', margin: '0 0 15px 0' }}>{prod.precio}</p>
                </div>
                <button
                  onClick={() => agregarAlPedido(prod)}
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
      )}
    </div>
  )
}

export default MenuCafeteria
