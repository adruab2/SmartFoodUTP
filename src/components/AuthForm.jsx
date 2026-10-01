import { useState } from 'react'

function AuthForm({ usuariosRegistrados = [], onLogin, onActualizarPassword }) {
  const [modo, setModo] = useState('login') // 'login' o 'recuperar'
  
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [nuevoPassword, setNuevoPassword] = useState('')
  const [dni, setDni] = useState('')
  
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [exitoMensaje, setExitoMensaje] = useState('')

  const limpiarCampos = () => {
    setCodigo('')
    setPassword('')
    setNuevoPassword('')
    setDni('')
    setError('')
    setExitoMensaje('')
    setMostrarPassword(false)
  }

  const handleSubmitLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!codigo || !password) {
      setError('Por favor, ingresa tu código UTP y contraseña.')
      return
    }

    const resultado = onLogin(codigo, password)
    if (!resultado.exito) {
      setError(resultado.mensaje)
    }
  }

  const handleSubmitRecuperar = (e) => {
    e.preventDefault()
    setError('')
    setExitoMensaje('')

    const codigoFormateado = codigo.trim().toUpperCase()

    if (!codigoFormateado || !dni || !nuevoPassword) {
      setError('Por favor, completa todos los campos de recuperación.')
      return
    }

    if (dni.length !== 8) {
      setError('El DNI debe contener exactamente 8 dígitos.')
      return
    }

    if (nuevoPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.codigoUtp.toUpperCase() === codigoFormateado && u.dni === dni
    )

    if (!usuarioEncontrado) {
      setError('Los datos ingresados no coinciden con ningún usuario registrado.')
      return
    }

    onActualizarPassword(codigoFormateado, { password: nuevoPassword })
    setExitoMensaje('Contraseña actualizada exitosamente. Redirigiendo...')
    setTimeout(() => {
      limpiarCampos()
      setModo('login')
    }, 1800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        padding: '35px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box'
      }}>
        
        {/* Cabecera de la Marca: SmartFood UTP */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#b91c1c', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '18px', letterSpacing: '0.5px', marginBottom: '10px' }}>
            SmartFood UTP
          </div>
          <h2 style={{ color: '#1e293b', fontSize: '20px', margin: '0 0 5px 0', fontWeight: '700' }}>
            {modo === 'login' ? 'Iniciar Sesión' : 'Restablecer Contraseña'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {modo === 'login' ? 'Cafetería Institucional' : 'Verifica tus datos para continuar'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', marginBottom: '20px', borderRadius: '6px', backgroundColor: '#fde8e8', color: '#9b1c1c', fontSize: '13px', borderLeft: '4px solid #b91c1c' }}>
            {error}
          </div>
        )}

        {exitoMensaje && (
          <div style={{ padding: '10px 14px', marginBottom: '20px', borderRadius: '6px', backgroundColor: '#def7ec', color: '#03543f', fontSize: '13px', borderLeft: '4px solid #059669' }}>
            {exitoMensaje}
          </div>
        )}

        {/* VISTA 1: LOGIN */}
        {modo === 'login' && (
          <form onSubmit={handleSubmitLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Código UTP
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej. U20000000"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#64748b' }}
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

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span
                onClick={() => { limpiarCampos(); setModo('recuperar'); }}
                style={{ fontSize: '13px', color: '#0284c7', cursor: 'pointer', fontWeight: '500' }}
              >
                Restablecer contraseña
              </span>
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', backgroundColor: '#b91c1c', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}
            >
              Ingresar
            </button>
          </form>
        )}

        {/* VISTA 2: RESTABLECER CONTRASEÑA */}
        {modo === 'recuperar' && (
          <form onSubmit={handleSubmitRecuperar}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Código UTP
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej. U20000000"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                DNI Registrado
              </label>
              <input
                type="text"
                maxLength={8}
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                placeholder="8 dígitos"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={nuevoPassword}
                onChange={(e) => setNuevoPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}
            >
              Actualizar Contraseña
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span onClick={() => { limpiarCampos(); setModo('login'); }} style={{ color: '#0284c7', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                ← Volver a Iniciar Sesión
              </span>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default AuthForm