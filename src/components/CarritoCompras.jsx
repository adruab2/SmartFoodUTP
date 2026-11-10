import React, { useState, useEffect } from 'react';

export default function CarritoCompras({
  carrito,
  franjasDisponibles = [],
  onCambiarCantidad,
  onEliminar,
  onConfirmar,
  onVolver
}) {
  const primeraDisponible = franjasDisponibles.find(f => f.cupos > 0)?.id || franjasDisponibles[0]?.id;
  const [franjaSeleccionada, setFranjaSeleccionada] = useState(primeraDisponible);
  const [errorFranja, setErrorFranja] = useState('');

  useEffect(() => {
    const obj = franjasDisponibles.find(f => f.id === franjaSeleccionada);
    if (!obj || obj.cupos === 0) {
      const nuevaDisponible = franjasDisponibles.find(f => f.cupos > 0)?.id;
      if (nuevaDisponible) setFranjaSeleccionada(nuevaDisponible);
    }
  }, [franjasDisponibles, franjaSeleccionada]);

  const aNumero = (precioStr) => {
    if (typeof precioStr === 'number') return precioStr;
    return parseFloat(String(precioStr).replace(/[^0-9.]/g, '')) || 0;
  };

  const subtotal = carrito.reduce((acc, item) => acc + aNumero(item.precio) * item.cantidad, 0);
  const servicio = 1.50;
  const total = subtotal + servicio;

  const handleConfirmarPedido = () => {
    if (!franjaSeleccionada) {
      setErrorFranja('Por favor, selecciona una franja horaria para el recojo.');
      return;
    }
    const franjaObj = franjasDisponibles.find(f => f.id === franjaSeleccionada);
    if (franjaObj && franjaObj.cupos === 0) {
      setErrorFranja('La franja seleccionada está llena. Por favor elige otra.');
      return;
    }
    setErrorFranja('');
    onConfirmar(franjaSeleccionada, 'PAGO EN CAJA');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
      <button
        onClick={onVolver}
        style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '14px', padding: '0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        &larr; Volver al menú
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Carrito de Compras</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>
        Revisa tu pedido antes de confirmar. Puedes editar cantidades o eliminar productos antes de pagar.
      </p>

      {carrito.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h3 style={{ color: '#374151', margin: '0 0 8px 0' }}>Tu carrito está vacío</h3>
          <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>Agrega platillos desde el menú para empezar tu pedido.</p>
          <button
            onClick={onVolver}
            style={{ backgroundColor: '#c8102e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ir al Menú
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          
          {/* Lista de Productos */}
          <div>
            {carrito.map((item) => {
              const nombreProd = String(item.nombre).toLowerCase();
              const esAlmuerzoRestringido = (nombreProd.includes('económico') || nombreProd.includes('ejecutivo')) && item.cantidad >= 1;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={item.imagen || '/img/menu-ejecutivo.jpg'}
                        alt={item.nombre}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#111827' }}>{item.nombre}</h4>
                        <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px' }}>
                          {item.categoria}
                        </span>
                        <div style={{ color: '#c8102e', fontWeight: 'bold', fontSize: '14px' }}>
                          S/ {aNumero(item.precio).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        style={{
                          border: '1px solid #d1d5db',
                          backgroundColor: item.cantidad <= 1 ? '#f3f4f6' : 'white',
                          color: item.cantidad <= 1 ? '#9ca3af' : '#111827',
                          borderRadius: '6px',
                          width: '32px',
                          height: '32px',
                          cursor: item.cantidad <= 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center', fontSize: '15px' }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                        disabled={esAlmuerzoRestringido}
                        style={{
                          border: '1px solid #d1d5db',
                          backgroundColor: esAlmuerzoRestringido ? '#f3f4f6' : 'white',
                          color: esAlmuerzoRestringido ? '#9ca3af' : '#111827',
                          borderRadius: '6px',
                          width: '32px',
                          height: '32px',
                          cursor: esAlmuerzoRestringido ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => onEliminar(item.id)}
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {esAlmuerzoRestringido && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#b91c1c', fontWeight: '500' }}>
                      ℹ️ Límite máximo alcanzado (1 Almuerzo por cliente al día - Regla RN01).
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Franja Horaria, Método de Pago (Pago en Caja) y Resumen */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            
            {/* FRANJA HORARIA */}
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
              1. Franja Horaria de Recojo (10 min)
            </h3>
            
            {errorFranja && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>
                {errorFranja}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {franjasDisponibles.map((f) => (
                <label
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${franjaSeleccionada === f.id ? '#c8102e' : '#e5e7eb'}`,
                    backgroundColor: franjaSeleccionada === f.id ? '#fff5f5' : f.cupos === 0 ? '#f9fafb' : 'white',
                    cursor: f.cupos === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="franja"
                      checked={franjaSeleccionada === f.id}
                      onChange={() => setFranjaSeleccionada(f.id)}
                      disabled={f.cupos === 0}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: f.cupos === 0 ? '#9ca3af' : '#111827' }}>
                      {f.hora}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: f.cupos === 0 ? '#dc2626' : '#16a34a' }}>
                    {f.cupos === 0 ? 'Agotado' : `${f.cupos} cupos`}
                  </span>
                </label>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

            {/* MÉTODO DE PAGO */}
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
              2. Método de Pago
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #c8102e',
                  backgroundColor: '#fff5f5',
                  color: '#c8102e',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'default'
                }}
              >
                💵 Pago en Caja
              </button>
            </div>

            <div style={{ backgroundColor: '#fdf8f6', border: '1px solid #ffedd5', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '12px', color: '#9a3412' }}>
              ℹ️ Abonarás el monto exacto con tarjeta, Yape o efectivo directamente en la caja de la cafetería al retirar tu pedido.
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

            {/* RESUMEN */}
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
              Resumen del Pedido
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
              <span>Servicio</span>
              <span>S/ {servicio.toFixed(2)}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#c8102e', marginBottom: '16px' }}>
              <span>Total a Pagar</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirmarPedido}
              style={{
                width: '100%',
                backgroundColor: '#c8102e',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}