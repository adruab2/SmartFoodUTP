import React, { useState } from 'react';

export default function AuthForm({ usuarios = [], onLogin, onRestablecerPassword }) {
  const [modoRestablecer, setModoRestablecer] = useState(false);

  // Estado Login
  const [codigoLogin, setCodigoLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Estado Restablecer
  const [codigoRestablecer, setCodigoRestablecer] = useState('');
  const [dniRestablecer, setDniRestablecer] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarNuevaPassword, setConfirmarNuevaPassword] = useState('');
  const [errorRestablecer, setErrorRestablecer] = useState('');
  const [exitoRestablecer, setExitoRestablecer] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorLogin('');

    if (!codigoLogin || !passwordLogin) {
      setErrorLogin('Ingresa tu Código UTP y contraseña.');
      return;
    }

    const exito = onLogin(codigoLogin.trim(), passwordLogin.trim());
    if (!exito) {
      setErrorLogin('Código UTP o contraseña incorrectos.');
    }
  };

  const handleRestablecerSubmit = (e) => {
    e.preventDefault();
    setErrorRestablecer('');
    setExitoRestablecer('');

    if (!codigoRestablecer || !dniRestablecer || !nuevaPassword || !confirmarNuevaPassword) {
      setErrorRestablecer('Por favor completa todos los campos.');
      return;
    }

    if (nuevaPassword !== confirmarNuevaPassword) {
      setErrorRestablecer('Las contraseñas no coinciden.');
      return;
    }

    // Buscar usuario en la lista global pasando el DNI y Código UTP sin importar espacios/mayúsculas
    const usuarioEncontrado = usuarios.find(
      (u) =>
        u.codigoUtp.trim().toUpperCase() === codigoRestablecer.trim().toUpperCase() &&
        String(u.dni).trim() === String(dniRestablecer).trim()
    );

    if (!usuarioEncontrado) {
      setErrorRestablecer('Los datos ingresados no coinciden con ningún usuario registrado.');
      return;
    }

    // Ejecutar actualización
    onRestablecerPassword(usuarioEncontrado.id, nuevaPassword.trim());
    setExitoRestablecer('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.');
    
    // Limpiar formulario
    setCodigoRestablecer('');
    setDniRestablecer('');
    setNuevaPassword('');
    setConfirmarNuevaPassword('');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            backgroundColor: '#c8102e',
            color: 'white',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '18px',
            display: 'inline-block'
          }}>
            SmartFood UTP
          </span>
        </div>

        {!modoRestablecer ? (
          /* FORMULARIO LOGIN */
          <form onSubmit={handleLoginSubmit}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 6px 0', textAlign: 'center' }}>
              Iniciar Sesión
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0', textAlign: 'center' }}>
              Ingresa tus credenciales para acceder a la plataforma
            </p>

            {errorLogin && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                ⚠️ {errorLogin}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Código UTP
              </label>
              <input
                type="text"
                value={codigoLogin}
                onChange={(e) => setCodigoLogin(e.target.value.toUpperCase())}
                placeholder="Ej. U10000000"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#c8102e',
                color: 'white',
                border: 'none',
                padding: '11px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Ingresar al Sistema
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setModoRestablecer(true); setErrorLogin(''); }}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
              >
                ¿Olvidaste tu contraseña? Restablécela aquí
              </button>
            </div>
          </form>
        ) : (
          /* FORMULARIO RESTABLECER CONTRASEÑA */
          <form onSubmit={handleRestablecerSubmit}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 6px 0', textAlign: 'center' }}>
              Restablecer Contraseña
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0', textAlign: 'center' }}>
              Verifica tus datos para actualizar tu clave
            </p>

            {errorRestablecer && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                ⚠️ {errorRestablecer}
              </div>
            )}

            {exitoRestablecer && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                ✅ {exitoRestablecer}
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Código UTP
              </label>
              <input
                type="text"
                value={codigoRestablecer}
                onChange={(e) => setCodigoRestablecer(e.target.value.toUpperCase())}
                placeholder="Ej. U20000000"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                DNI Registrado
              </label>
              <input
                type="text"
                maxLength={8}
                value={dniRestablecer}
                onChange={(e) => setDniRestablecer(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej. 87654321"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmarNuevaPassword}
                onChange={(e) => setConfirmarNuevaPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '11px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Actualizar Contraseña
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setModoRestablecer(false);
                  setErrorRestablecer('');
                  setExitoRestablecer('');
                }}
                style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
              >
                &larr; Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}