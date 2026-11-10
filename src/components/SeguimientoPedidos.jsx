import React from 'react';

export default function SeguimientoPedidos({
  pedidos = [],
  usuario,
  onCancelarPedido,
  onVolverAlMenu
}) {
  const codigoUsuario = typeof usuario === 'object' ? usuario?.codigoUtp : '';
  const nombreUsuario = typeof usuario === 'object' ? usuario?.nombre : usuario;

  // Filtrar pedidos pertenecientes al cliente logueado
  const misPedidos = pedidos.filter(
    (p) => (codigoUsuario && p.codigoUtp === codigoUsuario) || p.estudiante === nombreUsuario
  );

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'En preparación':
        return { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' };
      case 'Listo':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'Entregado':
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
      case 'Cancelado':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
      <button
        onClick={onVolverAlMenu}
        style={{
          background: 'none',
          border: 'none',
          color: '#4b5563',
          cursor: 'pointer',
          fontSize: '14px',
          padding: '0',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        &larr; Volver al menú
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
        Mis Pedidos y Seguimiento
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>
        Consulta el estado en tiempo real de tus solicitudes y revisa tu historial de compras.
      </p>

      {misPedidos.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h3 style={{ color: '#374151', margin: '0 0 8px 0' }}>Aún no tienes pedidos registrados</h3>
          <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>Realiza tu primera orden desde el menú interactivo.</p>
          <button
            onClick={onVolverAlMenu}
            style={{ backgroundColor: '#c8102e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ir al Menú
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {misPedidos.map((pedido) => {
            const estiloBadge = getBadgeColor(pedido.estado);

            return (
              <div
                key={pedido.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginRight: '12px' }}>
                      Pedido {pedido.id}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      Hora: {pedido.hora} | Franja Recojo: <strong>{pedido.franja}</strong>
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: estiloBadge.bg,
                    color: estiloBadge.color,
                    border: `1px solid ${estiloBadge.border}`,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {pedido.estado}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '12px 0', margin: '12px 0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Detalle de Platillos:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {pedido.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563' }}>
                        <span>{item.cantidad}x {item.nombre} ({item.categoria})</span>
                        <span>S/ {(parseFloat(String(item.precio).replace(/[^0-9.]/g, '')) * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#c8102e' }}>
                    Total Pagado: S/ {parseFloat(pedido.total).toFixed(2)}
                  </div>

                  {pedido.estado === 'Pendiente' && (
                    <button
                      onClick={() => onCancelarPedido(pedido.id)}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar Pedido
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}