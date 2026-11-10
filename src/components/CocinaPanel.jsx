import React, { useState } from 'react';

export default function CocinaPanel({
  usuario,
  pedidos = [],
  onCerrarSesion,
  onCambiarEstadoPedido
}) {
  const [filtroEstado, setFiltroEstado] = useState('TODOS'); // 'TODOS' | 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado'

  const nombreMostrar = typeof usuario === 'object' ? usuario?.nombre : usuario;

  // Filtrar pedidos no cancelados
  const pedidosVisibles = pedidos.filter((p) => {
    if (p.estado === 'Cancelado') return false;
    if (filtroEstado === 'TODOS') return true;
    return p.estado === filtroEstado;
  });

  // Métricas rápidas para el chef
  const cantPendientes = pedidos.filter((p) => p.estado === 'Pendiente').length;
  const cantEnPreparacion = pedidos.filter((p) => p.estado === 'En preparación').length;
  const cantListos = pedidos.filter((p) => p.estado === 'Listo').length;

  const getBadgeStyle = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'En preparación':
        return { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' };
      case 'Listo':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'Entregado':
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
      default:
        return { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* HEADER COCINA */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ backgroundColor: '#c8102e', color: 'white', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}>
            SmartFood UTP
          </span>
          <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '600' }}>👨‍🍳 Módulo de Cocina / Preparación</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#374151' }}>
            Chef a cargo: <strong>{nombreMostrar || 'Chef Principal'}</strong>
          </span>
          <button
            onClick={onCerrarSesion}
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* TARJETAS RESUMEN DE ESTADO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 'bold' }}>PENDIENTES POR PREPARAR</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e', marginTop: '4px' }}>{cantPendientes}</div>
          </div>
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>EN PREPARACIÓN (EN COCINA)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8', marginTop: '4px' }}>{cantEnPreparacion}</div>
          </div>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>LISTOS PARA ENTREGA</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginTop: '4px' }}>{cantListos}</div>
          </div>
        </div>

        {/* FILTROS DE PESTAÑAS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['TODOS', 'Pendiente', 'En preparación', 'Listo', 'Entregado'].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroEstado(st)}
              style={{
                backgroundColor: filtroEstado === st ? '#374151' : 'white',
                color: filtroEstado === st ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* LISTADO DE COMANDAS */}
        {pedidosVisibles.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <h3 style={{ color: '#374151', margin: 0 }}>No hay pedidos en esta categoría</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Los nuevos pedidos de los estudiantes aparecerán automáticamente aquí.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {pedidosVisibles.map((p) => {
              const badge = getBadgeStyle(p.estado);

              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{p.id}</span>
                      <span style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {p.estado}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                      👤 Cliente: <strong>{p.estudiante}</strong> ({p.codigoUtp})
                    </div>
                    <div style={{ fontSize: '13px', color: '#c8102e', fontWeight: 'bold', marginBottom: '12px' }}>
                      ⏰ Franja Horaria Recojo: {p.franja}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '12px 0' }} />

                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Platillos a preparar:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      {p.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#111827', backgroundColor: '#f9fafb', padding: '6px 10px', borderRadius: '6px' }}>
                          <span style={{ fontWeight: 'bold', color: '#c8102e' }}>{it.cantidad}x</span>
                          <span style={{ flex: 1, marginLeft: '8px' }}>{it.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACCIONES DEL CHEF SEGÚN ESTADO */}
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                    {p.estado === 'Pendiente' && (
                      <button
                        onClick={() => onCambiarEstadoPedido(p.id, 'En preparación')}
                        style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                      >
                        🔥 Empezar Preparación
                      </button>
                    )}

                    {p.estado === 'En preparación' && (
                      <button
                        onClick={() => onCambiarEstadoPedido(p.id, 'Listo')}
                        style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                      >
                        ✅ Marcar como Listo
                      </button>
                    )}

                    {p.estado === 'Listo' && (
                      <button
                        onClick={() => onCambiarEstadoPedido(p.id, 'Entregado')}
                        style={{ width: '100%', backgroundColor: '#4b5563', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                      >
                        📦 Entregar al Cliente
                      </button>
                    )}

                    {p.estado === 'Entregado' && (
                      <div style={{ textAlign: 'center', fontSize: '12px', color: '#16a34a', fontWeight: 'bold', padding: '6px' }}>
                        ✓ Orden despachada
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}