import { useState } from 'react'

const CAPACIDAD_FRANJA = 10

const ESTADOS = {
  pendiente: { texto: 'PENDIENTE', fondo: '#fef3c7', color: '#b45309' },
  preparacion: { texto: 'EN PREPARACIÓN', fondo: '#ffedd5', color: '#c2410c' },
  listo: { texto: 'LISTO', fondo: '#dcfce7', color: '#166534' },
  entregado: { texto: 'ENTREGADO', fondo: '#e2e8f0', color: '#475569' }
}

const PEDIDOS_INICIALES = [
  { id: '#001', cliente: 'Carlos Gomez M.', detalle: '1x Menu Ejecutivo, 1x Empanada de Carne', total: 16.0, hora: '11:54 AM', estado: 'pendiente' },
  { id: '#002', cliente: 'Ana Sofia Perez', detalle: '1x Sandwich de Pollo, 1x Café Pasado', total: 8.5, hora: '11:55 AM', estado: 'preparacion' },
  { id: '#003', cliente: 'Mateo Diaz Soler', detalle: '2x Empanada de Carne', total: 8.0, hora: '11:57 AM', estado: 'listo' },
  { id: '#004', cliente: 'Laura Villanueva', detalle: '1x Menu Ejecutivo', total: 12.0, hora: '11:58 AM', estado: 'preparacion' },
  { id: '#005', cliente: 'Kevin Paul Salazar', detalle: '2x Sandwich de Pollo', total: 11.0, hora: '12:00 PM', estado: 'pendiente' }
]

const PROXIMA_FRANJA = [
  { id: '#006', detalle: '1x Sándwich de Pollo', cliente: 'Maria Rosales' },
  { id: '#007', detalle: '2x Café Pasado', cliente: 'Juan Medina' },
  { id: '#008', detalle: '1x Menu Ejecutivo', cliente: 'Sandra Diaz' }
]

const soles = (valor) => 'S/ ' + valor.toFixed(2)

const base = { padding: '7px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', border: '1px solid transparent' }
const estiloBoton = {
  principal: { ...base, backgroundColor: '#991b1b', color: '#fff' },
  contorno: { ...base, backgroundColor: '#fff', color: '#334155', borderColor: '#cbd5e1' },
  listo: { ...base, backgroundColor: '#dcfce7', color: '#166534' },
  entregar: { ...base, backgroundColor: '#dbeafe', color: '#1d4ed8' }
}

const celda = { padding: '14px 12px', fontSize: '13px', color: '#334155', borderTop: '1px solid #e2e8f0', verticalAlign: 'middle' }
const encabezado = { padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#1e293b', textAlign: 'left', backgroundColor: '#f1f5f9' }

function ModuloCocina({ usuario = 'Chef Principal', onCerrarSesion }) {
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIALES)

  // Los estados avanzan en orden: pendiente → preparación → listo → entregado
  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)))
  }

  const franjaLlena = pedidos.length >= CAPACIDAD_FRANJA

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      {/* Cabecera */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ height: '70px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#991b1b', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontWeight: '800', fontSize: '16px' }}>
              SmartFood UTP
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Módulo de Cocina</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Sesión activa: {usuario} (COCINA)
            </span>
            <button
              onClick={onCerrarSesion}
              style={{ padding: '7px 14px', backgroundColor: '#fff', color: '#b91c1c', border: '1px solid #b91c1c', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <nav style={{ padding: '0 40px' }}>
          <span style={{ display: 'inline-block', padding: '10px 0', fontSize: '13px', fontWeight: '700', color: '#991b1b', borderBottom: '2px solid #991b1b' }}>
            Cola de Pedidos
          </span>
        </nav>
      </header>

      <main style={{ padding: '30px 40px', maxWidth: '1100px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>

        {/* Franja actual */}
        <section style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#991b1b' }} />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>Franja actual: 12:00 – 12:10</h2>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: franjaLlena ? '#b91c1c' : '#64748b' }}>
            {pedidos.length}/{CAPACIDAD_FRANJA} pedidos en esta franja{franjaLlena ? ' · Franja llena' : ''}
          </span>
        </section>

        {/* Pedidos programados */}
        <section style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>Pedidos Programados (12:00 - 12:10)</h3>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
              <thead>
                <tr>
                  <th style={encabezado}>Pedido</th>
                  <th style={encabezado}>Estudiante / Cliente</th>
                  <th style={encabezado}>Detalle Platillos</th>
                  <th style={encabezado}>Total</th>
                  <th style={encabezado}>Hora Pedido</th>
                  <th style={encabezado}>Estado</th>
                  <th style={{ ...encabezado, textAlign: 'center' }}>Acciones de Cocina</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => {
                  const estado = ESTADOS[p.estado]
                  return (
                    <tr key={p.id} style={{ opacity: p.estado === 'entregado' ? 0.6 : 1 }}>
                      <td style={{ ...celda, fontWeight: '700', color: '#1e293b' }}>{p.id}</td>
                      <td style={celda}>{p.cliente}</td>
                      <td style={celda}>{p.detalle}</td>
                      <td style={{ ...celda, fontWeight: '800', color: '#991b1b' }}>{soles(p.total)}</td>
                      <td style={{ ...celda, color: '#64748b' }}>{p.hora}</td>
                      <td style={celda}>
                        <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', backgroundColor: estado.fondo, color: estado.color, whiteSpace: 'nowrap' }}>
                          {estado.texto}
                        </span>
                      </td>
                      <td style={{ ...celda, textAlign: 'center' }}>
                        {p.estado === 'listo' ? (
                          <button style={estiloBoton.entregar} onClick={() => cambiarEstado(p.id, 'entregado')}>
                            Entregar Pedido
                          </button>
                        ) : p.estado === 'entregado' ? (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Pedido cerrado</span>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                              style={{ ...(p.estado === 'pendiente' ? estiloBoton.principal : estiloBoton.contorno), opacity: p.estado === 'pendiente' ? 1 : 0.6, cursor: p.estado === 'pendiente' ? 'pointer' : 'not-allowed' }}
                              disabled={p.estado !== 'pendiente'}
                              onClick={() => cambiarEstado(p.id, 'preparacion')}
                            >
                              Marcar en preparación
                            </button>
                            <button
                              style={{ ...estiloBoton.listo, opacity: p.estado === 'preparacion' ? 1 : 0.45, cursor: p.estado === 'preparacion' ? 'pointer' : 'not-allowed' }}
                              disabled={p.estado !== 'preparacion'}
                              onClick={() => cambiarEstado(p.id, 'listo')}
                            >
                              Listo
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Próxima franja */}
        <section style={{ backgroundColor: '#e2e8f0', borderRadius: '10px', padding: '16px 20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Próxima franja: 12:10 - 12:20 (Vista previa de cocina)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {PROXIMA_FRANJA.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px 12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{p.id} - {p.detalle}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Estudiante: {p.cliente}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ModuloCocina
