import React, { useState } from 'react';

const productosMenu = [
  {
    id: 1,
    nombre: 'Menu Ejecutivo (pollo + ensalada)',
    categoria: 'ALMUERZOS',
    precio: 'S/ 12.00',
    imagen: '/img/menu-ejecutivo.jpg'
  },
  {
    id: 2,
    nombre: 'Sandwich de Pollo',
    categoria: 'DESAYUNOS',
    precio: 'S/ 5.50',
    imagen: '/img/sandwich-pollo.jpg'
  },
  {
    id: 3,
    nombre: 'Empanada de Carne',
    categoria: 'SNACKS',
    precio: 'S/ 4.00',
    imagen: '/img/empanada-carne.jpg'
  },
  {
    id: 4,
    nombre: 'Café Pasado / Infusión',
    categoria: 'BEBIDAS',
    precio: 'S/ 3.00',
    imagen: '/img/cafe-pasado.jpg'
  }
];

export default function MenuCafeteria({
  confirmado = false,
  onAgregarAlPedido
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODOS');

  const categorias = ['TODOS', 'ALMUERZOS', 'DESAYUNOS', 'SNACKS', 'BEBIDAS'];

  const productosFiltrados = categoriaSeleccionada === 'TODOS'
    ? productosMenu
    : productosMenu.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
      {/* Banner de confirmación */}
      {confirmado && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
          <strong>¡Pedido confirmado!</strong> Tu solicitud ha sido enviada a la cocina.
        </div>
      )}

      {/* Título y Filtros */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Menú del Día</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0' }}>
          Selecciona tus platillos y realiza tu pedido de manera rápida y sencilla.
        </p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              style={{
                backgroundColor: categoriaSeleccionada === cat ? '#c8102e' : '#ffffff',
                color: categoriaSeleccionada === cat ? '#ffffff' : '#374151',
                border: `1px solid ${categoriaSeleccionada === cat ? '#c8102e' : '#d1d5db'}`,
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {productosFiltrados.map(producto => (
          <div
            key={producto.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
              <div>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
                  {producto.categoria}
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{producto.nombre}</h3>
                <div style={{ color: '#c8102e', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>{producto.precio}</div>
              </div>
              <button
                onClick={() => onAgregarAlPedido(producto)}
                style={{
                  width: '100%',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Agregar al Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}