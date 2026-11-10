import React, { useState } from 'react';

export default function AdminPanel({
  usuario,
  usuarios = [],
  productos = [],
  franjas = [],
  pedidos = [],
  onCerrarSesion,
  onAgregarUsuario,
  onActualizarUsuario,
  onEliminarUsuario,
  onAgregarProducto,
  onActualizarProducto,
  onEliminarProducto,
  onActualizarCapacidadFranja
}) {
  const [pestañaActiva, setPestañaActiva] = useState('usuarios'); // 'usuarios' | 'menu' | 'capacidad'

  // --- Estado Formulario Usuarios ---
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    dni: '',
    codigoUtp: '',
    tipo: 'Estudiante',
    rol: 'cliente',
    password: '',
    confirmPassword: ''
  });
  const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);
  const [errorUsuario, setErrorUsuario] = useState('');

  // --- Estado Formulario Productos ---
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    categoria: 'ALMUERZOS',
    precioNum: '10.00',
    imagen: '/img/menu-ejecutivo.jpg'
  });
  const [editandoProductoId, setEditandoProductoId] = useState(null);
  const [errorProducto, setErrorProducto] = useState('');

  const nombreMostrar = typeof usuario === 'object' ? usuario?.nombre : usuario;

  // Generador de Código UTP (U + 8 dígitos aleatorios)
  const handleGenerarCodigoUtp = () => {
    let codigoGenerado = '';
    let existe = true;

    while (existe) {
      const numAleatorio = Math.floor(10000000 + Math.random() * 90000000);
      codigoGenerado = `U${numAleatorio}`;
      existe = usuarios.some((u) => u.codigoUtp === codigoGenerado);
    }

    setFormUsuario((prev) => ({ ...prev, codigoUtp: codigoGenerado }));
  };

  // Handlers Usuario
  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    setErrorUsuario('');

    const { nombre, dni, codigoUtp, password, confirmPassword, rol, tipo } = formUsuario;

    if (!nombre || !codigoUtp || !password || !confirmPassword) {
      setErrorUsuario('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorUsuario('Las contraseñas no coinciden.');
      return;
    }

    const existeCodigo = usuarios.some(
      (u) => u.codigoUtp.toUpperCase() === codigoUtp.toUpperCase() && u.id !== editandoUsuarioId
    );
    if (existeCodigo) {
      setErrorUsuario(`El Código UTP "${codigoUtp}" ya se encuentra registrado.`);
      return;
    }

    if (dni) {
      const existeDni = usuarios.some((u) => u.dni === dni && u.id !== editandoUsuarioId);
      if (existeDni) {
        setErrorUsuario(`El DNI "${dni}" ya pertenece a otro usuario.`);
        return;
      }
    }

    if (editandoUsuarioId) {
      onActualizarUsuario({ id: editandoUsuarioId, nombre, dni, codigoUtp, tipo, rol, password });
      setEditandoUsuarioId(null);
    } else {
      onAgregarUsuario({ nombre, dni, codigoUtp, tipo, rol, password });
    }

    setFormUsuario({
      nombre: '',
      dni: '',
      codigoUtp: '',
      tipo: 'Estudiante',
      rol: 'cliente',
      password: '',
      confirmPassword: ''
    });
  };

  const handleEditarUsuarioClick = (u) => {
    setEditandoUsuarioId(u.id);
    setErrorUsuario('');
    setFormUsuario({
      nombre: u.nombre,
      dni: u.dni || '',
      codigoUtp: u.codigoUtp,
      tipo: u.tipo || 'Estudiante',
      rol: u.rol,
      password: u.password || '',
      confirmPassword: u.password || ''
    });
  };

  // Handlers Producto
  const handleGuardarProducto = (e) => {
    e.preventDefault();
    setErrorProducto('');

    const { nombre, categoria, precioNum, imagen } = formProducto;
    const monto = parseFloat(precioNum);

    if (!nombre || isNaN(monto) || monto <= 0) {
      setErrorProducto('Ingresa un nombre válido y un precio mayor a 0.');
      return;
    }

    const precioFormateado = `S/ ${monto.toFixed(2)}`;

    if (editandoProductoId) {
      onActualizarProducto({ id: editandoProductoId, nombre, categoria, precio: precioFormateado, imagen });
      setEditandoProductoId(null);
    } else {
      onAgregarProducto({ nombre, categoria, precio: precioFormateado, imagen });
    }

    setFormProducto({ nombre: '', categoria: 'ALMUERZOS', precioNum: '10.00', imagen: '/img/menu-ejecutivo.jpg' });
  };

  const handleEditarProductoClick = (p) => {
    setEditandoProductoId(p.id);
    setErrorProducto('');

    const numStr = String(p.precio).replace(/[^0-9.]/g, '') || '0.00';

    setFormProducto({
      nombre: p.nombre,
      categoria: p.categoria,
      precioNum: numStr,
      imagen: p.imagen
    });
  };

  // Métricas para Reportes
  const totalVentas = pedidos
    .filter((p) => p.estado !== 'Cancelado')
    .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);

  const pedidosPorFranja = franjas.map((f) => {
    const cant = pedidos.filter((p) => p.franja === f.id && p.estado !== 'Cancelado').length;
    return { ...f, pedidosActuales: cant };
  });

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* HEADER ADMIN */}
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
          <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '600' }}>Panel de Administración</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#374151' }}>
            Sesión activa: <strong>{nombreMostrar || 'Admin General'}</strong>
          </span>
          <button
            onClick={onCerrarSesion}
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* PESTAÑAS PRINCIPALES */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
          <button
            onClick={() => setPestañaActiva('usuarios')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              color: pestañaActiva === 'usuarios' ? '#c8102e' : '#4b5563',
              borderBottom: pestañaActiva === 'usuarios' ? '3px solid #c8102e' : 'none'
            }}
          >
            Gestión de Usuarios y Roles
          </button>
          <button
            onClick={() => setPestañaActiva('menu')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              color: pestañaActiva === 'menu' ? '#c8102e' : '#4b5563',
              borderBottom: pestañaActiva === 'menu' ? '3px solid #c8102e' : 'none'
            }}
          >
            Gestión del Menú de Comidas
          </button>
          <button
            onClick={() => setPestañaActiva('capacidad')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              color: pestañaActiva === 'capacidad' ? '#c8102e' : '#4b5563',
              borderBottom: pestañaActiva === 'capacidad' ? '3px solid #c8102e' : 'none'
            }}
          >
            Capacidad por Franja y Reportes
          </button>
        </div>

        {/* PESTAÑA 1: GESTIÓN DE USUARIOS Y ROLES */}
        {pestañaActiva === 'usuarios' && (
          <div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>
                {editandoUsuarioId ? 'Editar Usuario en el Sistema' : 'Registrar Nuevo Usuario en el Sistema'}
              </h3>

              {errorUsuario && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>
                  ⚠️ {errorUsuario}
                </div>
              )}

              <form onSubmit={handleGuardarUsuario}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nombre Completo</label>
                    <input
                      type="text"
                      value={formUsuario.nombre}
                      onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                      placeholder="Ej. Ana María Torres"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>DNI</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={formUsuario.dni}
                      onChange={(e) => setFormUsuario({ ...formUsuario, dni: e.target.value.replace(/\D/g, '') })}
                      placeholder="8 dígitos"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Código UTP</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={formUsuario.codigoUtp}
                        onChange={(e) => setFormUsuario({ ...formUsuario, codigoUtp: e.target.value.toUpperCase() })}
                        placeholder="Ej. U20000000"
                        style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                      <button
                        type="button"
                        onClick={handleGenerarCodigoUtp}
                        style={{
                          backgroundColor: '#374151',
                          color: 'white',
                          border: 'none',
                          padding: '0 14px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Generar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Rol de Acceso</label>
                    <select
                      value={formUsuario.rol}
                      onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}
                    >
                      <option value="cliente">Estudiante / Docente (Cliente)</option>
                      <option value="cocina">Chef / Personal de Cocina</option>
                      <option value="administrador">Administrador General</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Contraseña</label>
                    <input
                      type="password"
                      value={formUsuario.password}
                      onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                      placeholder="Mínimo 3 caracteres"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={formUsuario.confirmPassword}
                      onChange={(e) => setFormUsuario({ ...formUsuario, confirmPassword: e.target.value })}
                      placeholder="Repite la contraseña"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#c8102e', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {editandoUsuarioId ? 'Guardar Cambios' : 'Guardar Nuevo Usuario'}
                  </button>
                  {editandoUsuarioId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoUsuarioId(null);
                        setErrorUsuario('');
                        setFormUsuario({ nombre: '', dni: '', codigoUtp: '', tipo: 'Estudiante', rol: 'cliente', password: '', confirmPassword: '' });
                      }}
                      style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* TABLA USUARIOS */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ padding: '16px 20px', fontSize: '16px', fontWeight: 'bold', color: '#111827', borderBottom: '1px solid #e5e7eb', margin: 0 }}>
                Usuarios Registrados ({usuarios.length})
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '12px 16px' }}>Código UTP</th>
                    <th style={{ padding: '12px 16px' }}>Nombre</th>
                    <th style={{ padding: '12px 16px' }}>DNI</th>
                    <th style={{ padding: '12px 16px' }}>Rol Asignado</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{u.codigoUtp}</td>
                      <td style={{ padding: '12px 16px' }}>{u.nombre}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.dni || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          backgroundColor: u.rol === 'administrador' ? '#fee2e2' : u.rol === 'cocina' ? '#fef3c7' : '#dcfce7',
                          color: u.rol === 'administrador' ? '#991b1b' : u.rol === 'cocina' ? '#92400e' : '#15803d',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleEditarUsuarioClick(u)}
                          style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginRight: '6px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onEliminarUsuario(u.id)}
                          style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Desactivar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: GESTIÓN DEL MENÚ */}
        {pestañaActiva === 'menu' && (
          <div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>
                {editandoProductoId ? 'Editar Platillo del Menú' : 'Agregar Nuevo Platillo al Menú'}
              </h3>

              {errorProducto && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>
                  ⚠️ {errorProducto}
                </div>
              )}

              <form onSubmit={handleGuardarProducto}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nombre del Platillo</label>
                    <input
                      type="text"
                      value={formProducto.nombre}
                      onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                      placeholder="Ej. Arroz con Pollo"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Categoría</label>
                    <select
                      value={formProducto.categoria}
                      onChange={(e) => setFormProducto({ ...formProducto, categoria: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}
                    >
                      <option value="ALMUERZOS">ALMUERZOS</option>
                      <option value="DESAYUNOS">DESAYUNOS</option>
                      <option value="SNACKS">SNACKS</option>
                      <option value="BEBIDAS">BEBIDAS</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Precio</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRight: 'none',
                        padding: '9px 12px',
                        borderRadius: '6px 0 0 6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#374151',
                        userSelect: 'none'
                      }}>
                        S/
                      </span>
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={formProducto.precioNum}
                        onChange={(e) => setFormProducto({ ...formProducto, precioNum: e.target.value })}
                        placeholder="10.00"
                        style={{ flex: 1, padding: '9px 12px', borderRadius: '0 6px 6px 0', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Ruta de Imagen</label>
                    <input
                      type="text"
                      value={formProducto.imagen}
                      onChange={(e) => setFormProducto({ ...formProducto, imagen: e.target.value })}
                      placeholder="/img/menu-ejecutivo.jpg"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {editandoProductoId ? 'Guardar Cambios' : 'Agregar Al Menú'}
                  </button>
                  {editandoProductoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoProductoId(null);
                        setErrorProducto('');
                        setFormProducto({ nombre: '', categoria: 'ALMUERZOS', precioNum: '10.00', imagen: '/img/menu-ejecutivo.jpg' });
                      }}
                      style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* TABLA PRODUCTOS */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ padding: '16px 20px', fontSize: '16px', fontWeight: 'bold', color: '#111827', borderBottom: '1px solid #e5e7eb', margin: 0 }}>
                Catálogo de Platillos Activos ({productos.length})
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '12px 16px' }}>Plato</th>
                    <th style={{ padding: '12px 16px' }}>Categoría</th>
                    <th style={{ padding: '12px 16px' }}>Precio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.imagen} alt={p.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                        {p.nombre}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                          {p.categoria}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#c8102e' }}>{p.precio}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleEditarProductoClick(p)}
                          style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginRight: '6px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onEliminarProducto(p.id)}
                          style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
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

        {/* PESTAÑA 3: CAPACIDAD Y REPORTES */}
        {pestañaActiva === 'capacidad' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* CONFIGURACIÓN FRANJAS */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
                Capacidad Máxima por Franja (10 min)
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
                Ajusta el cupo máximo de pedidos simultáneos que la cocina puede procesar por intervalo.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {franjas.map((f) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{f.hora}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Cupos disponibles actuales: <strong>{f.cupos}</strong></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#374151' }}>Máx:</span>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        defaultValue={f.cupos}
                        onBlur={(e) => onActualizarCapacidadFranja(f.id, parseInt(e.target.value, 10) || 0)}
                        style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: 'bold' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REPORTES Y MÉTRICAS */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
                Reporte Básico de Ventas y Demanda
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>RECAUDACIÓN TOTAL</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d', marginTop: '4px' }}>
                    S/ {totalVentas.toFixed(2)}
                  </div>
                </div>
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 'bold' }}>PEDIDOS REGISTRADOS</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d4ed8', marginTop: '4px' }}>
                    {pedidos.filter((p) => p.estado !== 'Cancelado').length}
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 12px 0' }}>Ocupación por Horas Pico:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pedidosPorFranja.map((pf) => (
                  <div key={pf.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '10px 14px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                    <span>{pf.hora}</span>
                    <span style={{ fontWeight: 'bold', color: pf.pedidosActuales >= 5 ? '#dc2626' : '#16a34a' }}>
                      {pf.pedidosActuales} pedidos procesados
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}