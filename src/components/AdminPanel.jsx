import { useState } from 'react'

function AdminPanel({ usuario, rolUsuario, usuariosRegistrados, onAgregarUsuario, onActualizarUsuario, onEliminarUsuario, onCerrarSesion }) {
  const [tab, setTab] = useState(rolUsuario === 'cocina' ? 'menu' : 'usuarios')

  const [editandoCodigo, setEditandoCodigo] = useState(null)
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState('')
  const [codigoUtp, setCodigoUtp] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [tipoUsuario, setTipoUsuario] = useState('estudiante')
  const [subRolAdmin, setSubRolAdmin] = useState('administrador')
  
  const [mensaje, setMensaje] = useState('')
  
  // Estado para el modal de confirmación de eliminación personalizado
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  const generarCodigoUTP = () => {
    const aleatorio8Digitos = Math.floor(10000000 + Math.random() * 90000000)
    setCodigoUtp(`U${aleatorio8Digitos}`)
  }

  const limpiarFormulario = () => {
    setEditandoCodigo(null)
    setNombre('')
    setDni('')
    setCodigoUtp('')
    setPassword('')
    setMostrarPassword(false)
    setTipoUsuario('estudiante')
    setSubRolAdmin('administrador')
  }

  const handleIniciarEdicion = (u) => {
    setEditandoCodigo(u.codigoUtp)
    setCodigoUtp(u.codigoUtp)
    setNombre(u.nombre || '')
    setDni(u.dni || '')
    setPassword(u.password || '')
    setMostrarPassword(false)
    setTipoUsuario(u.tipoUsuario || 'estudiante')
    
    if (u.tipoUsuario === 'personal') {
      setSubRolAdmin(u.rol || 'administrador')
    } else {
      setSubRolAdmin('administrador')
    }
    setMensaje('')
  }

  const handleGuardarUsuario = (e) => {
    e.preventDefault()
    setMensaje('')
    const utpRegex = /^[uU]\d{8}$/

    if (!nombre || !dni || !codigoUtp) {
      setMensaje('Por favor, completa el nombre, DNI y Código UTP.')
      return
    }

    if (!password) {
      setMensaje('Por favor, ingresa una contraseña para el usuario.')
      return
    }

    if (dni.length !== 8) {
      setMensaje('El DNI debe contener exactamente 8 dígitos.')
      return
    }

    if (!utpRegex.test(codigoUtp.trim())) {
      setMensaje('El Código UTP debe tener el formato U seguido de 8 números (Ej. U20000000).')
      return
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const codigoFormateado = codigoUtp.trim().toUpperCase()

    if (!editandoCodigo) {
      const yaExisteCodigo = usuariosRegistrados.some(
        (u) => u.codigoUtp.toUpperCase() === codigoFormateado
      )
      if (yaExisteCodigo) {
        setMensaje(`El código UTP "${codigoFormateado}" ya se encuentra registrado.`)
        return
      }
    }

    const yaExisteDni = usuariosRegistrados.some(
      (u) => u.dni === dni && u.codigoUtp !== editandoCodigo
    )
    if (yaExisteDni) {
      setMensaje(`El DNI "${dni}" ya pertenece a otro usuario registrado.`)
      return
    }

    let rolFinal = 'cliente'
    if (tipoUsuario === 'personal') {
      rolFinal = subRolAdmin
    }

    const datosUsuario = {
      codigoUtp: codigoFormateado,
      nombre,
      dni,
      password,
      tipoUsuario,
      rol: rolFinal
    }

    if (editandoCodigo) {
      onActualizarUsuario(editandoCodigo, datosUsuario)
      setMensaje(`Usuario ${codigoFormateado} actualizado exitosamente.`)
    } else {
      onAgregarUsuario(datosUsuario)
      setMensaje(`Usuario ${nombre} (${codigoFormateado}) registrado exitosamente.`)
    }

    limpiarFormulario()
  }

  const solicitarEliminacion = (codigo) => {
    const usuarioActualObj = usuariosRegistrados.find(u => u.nombre === usuario)
    if (usuarioActualObj && usuarioActualObj.codigoUtp === codigo) {
      setMensaje('No puedes eliminar tu propia cuenta mientras tienes la sesión activa.')
      return
    }
    setUsuarioAEliminar(codigo)
  }

  const confirmarEliminacion = () => {
    if (usuarioAEliminar) {
      onEliminarUsuario(usuarioAEliminar)
      setMensaje(`Usuario ${usuarioAEliminar} eliminado correctamente.`)
      setUsuarioAEliminar(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      
      {/* Cabecera Superior Institucional SmartFood UTP */}
      <header style={{ backgroundColor: '#ffffff', height: '70px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#b91c1c', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontWeight: '800', fontSize: '16px' }}>
            SmartFood UTP
          </div>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            {rolUsuario === 'cocina' ? 'Módulo de Cocina' : 'Panel de Administración'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#334155' }}>
            Sesión activa: <strong>{usuario}</strong> <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>({rolUsuario})</span>
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

      {/* Contenido Principal */}
      <main style={{ padding: '35px 40px', maxWidth: '1100px', width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
        
        {/* Pestañas de Navegación */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #e2e8f0', marginBottom: '25px' }}>
          {rolUsuario === 'administrador' && (
            <button
              onClick={() => setTab('usuarios')}
              style={{
                padding: '10px 4px',
                border: 'none',
                borderBottom: tab === 'usuarios' ? '3px solid #b91c1c' : '3px solid transparent',
                backgroundColor: 'transparent',
                fontWeight: tab === 'usuarios' ? '700' : '500',
                color: tab === 'usuarios' ? '#b91c1c' : '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '-2px'
              }}
            >
              Gestión de Usuarios y Roles
            </button>
          )}

          <button
            onClick={() => setTab('menu')}
            style={{
              padding: '10px 4px',
              border: 'none',
              borderBottom: tab === 'menu' ? '3px solid #b91c1c' : '3px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: tab === 'menu' ? '700' : '500',
              color: tab === 'menu' ? '#b91c1c' : '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '-2px'
            }}
          >
            Gestión del Menú de Comidas
          </button>
        </div>

        {/* Pestaña: Gestión de Usuarios */}
        {tab === 'usuarios' && rolUsuario === 'administrador' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', color: '#1e293b', margin: 0, fontWeight: '700' }}>
                  {editandoCodigo ? `Modificar Usuario: ${editandoCodigo}` : 'Registrar Nuevo Usuario en el Sistema'}
                </h2>
                {editandoCodigo && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    style={{ padding: '5px 10px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
              
              {mensaje && (
                <div style={{
                  padding: '10px 14px',
                  marginBottom: '15px',
                  borderRadius: '6px',
                  backgroundColor: mensaje.includes('exitosamente') || mensaje.includes('correctamente') ? '#def7ec' : '#fde8e8',
                  color: mensaje.includes('exitosamente') || mensaje.includes('correctamente') ? '#03543f' : '#9b1c1c',
                  fontSize: '13px'
                }}>
                  {mensaje}
                </div>
              )}

              <form onSubmit={handleGuardarUsuario} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Nombre Completo:</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ana María Torres"
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>DNI:</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="8 dígitos"
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Código UTP:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      maxLength={9}
                      disabled={!!editandoCodigo}
                      value={codigoUtp}
                      onChange={(e) => setCodigoUtp(e.target.value)}
                      placeholder="Ej. U20000000"
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', backgroundColor: editandoCodigo ? '#f1f5f9' : '#fff' }}
                    />
                    {!editandoCodigo && (
                      <button
                        type="button"
                        onClick={generarCodigoUTP}
                        style={{ padding: '9px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                      >
                        Generar
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Contraseña:</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      style={{ width: '100%', padding: '9px', paddingRight: '40px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                      title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {mostrarPassword ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Tipo de Usuario:</label>
                  <select
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="estudiante">Estudiante (Cliente)</option>
                    <option value="docente">Docente (Cliente)</option>
                    <option value="personal">Personal Administrativo</option>
                  </select>
                </div>

                {tipoUsuario === 'personal' && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#b91c1c' }}>
                      Función del Personal Administrativo:
                    </label>
                    <select
                      value={subRolAdmin}
                      onChange={(e) => setSubRolAdmin(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #b91c1c', backgroundColor: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="administrador">Administrador del Sistema</option>
                      <option value="cocina">Personal de Cocina</option>
                    </select>
                  </div>
                )}

                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '11px', backgroundColor: editandoCodigo ? '#0284c7' : '#b91c1c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {editandoCodigo ? 'Actualizar Usuario' : 'Guardar Nuevo Usuario'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabla de Usuarios Registrados */}
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>Usuarios Registrados</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left', marginTop: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px' }}>Código UTP</th>
                    <th style={{ padding: '10px' }}>Nombre</th>
                    <th style={{ padding: '10px' }}>DNI</th>
                    <th style={{ padding: '10px' }}>Tipo</th>
                    <th style={{ padding: '10px' }}>Rol Asignado</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosRegistrados.map((u, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 10px', fontWeight: '600' }}>{u.codigoUtp}</td>
                      <td style={{ padding: '12px 10px' }}>{u.nombre || '-'}</td>
                      <td style={{ padding: '12px 10px' }}>{u.dni || '-'}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>{u.tipoUsuario || 'Estudiante'}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: u.rol === 'administrador' ? '#fee2e2' : u.rol === 'cocina' ? '#fef08a' : '#dcfce7',
                          color: u.rol === 'administrador' ? '#991b1b' : u.rol === 'cocina' ? '#854d0e' : '#166534'
                        }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleIniciarEdicion(u)}
                          style={{ marginRight: '6px', padding: '5px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => solicitarEliminacion(u.codigoUtp)}
                          style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pestaña: Gestión del Menú */}
        {tab === 'menu' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '18px', color: '#1e293b', marginTop: 0, fontWeight: '700' }}>Gestión del Menú de Comidas</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Módulo para agregar, modificar precios o actualizar la disponibilidad de los platos en tiempo real.</p>
          </div>
        )}

      </main>

      {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
      {usuarioAEliminar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b', fontWeight: '700' }}>Confirmar Eliminación</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 25px 0', lineHeight: '1.5' }}>
              ¿Estás seguro de que deseas eliminar al usuario con código <strong>{usuarioAEliminar}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setUsuarioAEliminar(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPanel