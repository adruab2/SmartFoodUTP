import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import MenuCafeteria from './components/MenuCafeteria';
import CarritoCompras from './components/CarritoCompras';
import AdminPanel from './components/AdminPanel';
import SeguimientoPedidos from './components/SeguimientoPedidos';
import CocinaPanel from './components/CocinaPanel';
import { api, socket } from './services/api';

export default function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);

  // Estados sincronizados con el Backend
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [franjas, setFranjas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados locales de interfaz
  const [carrito, setCarrito] = useState([]);
  const [vistaActual, setVistaActual] = useState('menu');
  const [confirmado, setConfirmado] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState('');

  const mostrarNotificacion = (msg) => {
    setMensajeNotificacion(msg);
    setTimeout(() => {
      setMensajeNotificacion('');
    }, 4500);
  };

  // Carga inicial de datos desde la API
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resUsuarios, resProductos, resFranjas, resPedidos] = await Promise.all([
          api.getUsuarios(),
          api.getProductos(),
          api.getFranjas(),
          api.getPedidos()
        ]);
        setUsuarios(resUsuarios);
        setProductos(resProductos);
        setFranjas(resFranjas);
        setPedidos(resPedidos);
      } catch (error) {
        mostrarNotificacion('Error conectando con el servidor backend: ' + error.message);
      }
    };

    cargarDatosIniciales();

    // Suscripción a eventos WebSockets en tiempo real
    socket.on('usuarios_actualizados', (data) => setUsuarios(data));
    socket.on('productos_actualizados', (data) => setProductos(data));
    socket.on('franjas_actualizadas', (data) => setFranjas(data));
    socket.on('pedidos_actualizados', (data) => setPedidos(data));

    return () => {
      socket.off('usuarios_actualizados');
      socket.off('productos_actualizados');
      socket.off('franjas_actualizadas');
      socket.off('pedidos_actualizados');
    };
  }, []);

  // Login a través de la API
  const handleLogin = async (codigo, password) => {
    try {
      const res = await api.login(codigo, password);
      setUsuarioAutenticado(res.usuario);
      setRolUsuario(res.usuario.rol);
      setVistaActual('menu');
      return true;
    } catch (error) {
      return false;
    }
  };

  // Restablecer contraseña a través de la API
  const handleRestablecerPassword = async (idUsuario, nuevaPassword) => {
    try {
      const usuario = usuarios.find((u) => u.id === idUsuario);
      if (!usuario) return;
      await api.restablecerPassword(usuario.codigoUtp, usuario.dni, nuevaPassword);
      mostrarNotificacion('Contraseña actualizada correctamente en el servidor.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const handleCerrarSesion = () => {
    setUsuarioAutenticado(null);
    setRolUsuario(null);
    setCarrito([]);
    setVistaActual('menu');
    setConfirmado(false);
    setMensajeNotificacion('');
  };

  // CRUD Usuarios en Backend
  const handleAgregarUsuario = async (nuevoUsuario) => {
    try {
      await api.crearUsuario(nuevoUsuario);
      mostrarNotificacion('Usuario registrado en la base de datos.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const handleActualizarUsuario = async (usuarioEditado) => {
    try {
      await api.actualizarUsuario(usuarioEditado.id, usuarioEditado);
      mostrarNotificacion('Usuario actualizado con éxito.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await api.eliminarUsuario(id);
      mostrarNotificacion('Usuario eliminado del sistema.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  // CRUD Productos en Backend
  const handleAgregarProducto = async (nuevoProd) => {
    try {
      await api.crearProducto(nuevoProd);
      mostrarNotificacion('Platillo agregado al menú correctamente.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const handleActualizarProducto = async (prodEditado) => {
    try {
      await api.actualizarProducto(prodEditado.id, prodEditado);
      mostrarNotificacion('Platillo actualizado en el catálogo.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await api.eliminarProducto(id);
      mostrarNotificacion('Platillo eliminado del catálogo.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  // Capacidad de Franjas en Backend
  const handleActualizarCapacidadFranja = async (idFranja, nuevaCapacidad) => {
    try {
      await api.actualizarCapacidadFranja(idFranja, nuevaCapacidad);
      mostrarNotificacion('Capacidad de franja actualizada.');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  // Cambiar Estado Pedido desde Cocina en Backend
  const handleCambiarEstadoPedido = async (idPedido, nuevoEstado) => {
    try {
      await api.actualizarEstadoPedido(idPedido, nuevoEstado);
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  // Cancelar Pedido en Backend
  const handleCancelarPedido = async (idPedido) => {
    try {
      await api.cancelarPedido(idPedido);
      mostrarNotificacion(`Pedido ${idPedido} cancelado y cupo liberado.`);
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  const yaComproAlmuerzoHoy = () => {
    if (!usuarioAutenticado) return false;
    return pedidos.some(
      (p) =>
        p.codigoUtp === usuarioAutenticado.codigoUtp &&
        p.estado !== 'Cancelado' &&
        p.items.some((item) => {
          const n = String(item.nombre).toLowerCase();
          return n.includes('económico') || n.includes('ejecutivo');
        })
    );
  };

  const handleAgregarAlPedido = (producto) => {
    const nombreProd = String(producto.nombre).toLowerCase();
    const esAlmuerzo = nombreProd.includes('económico') || nombreProd.includes('ejecutivo');

    if (esAlmuerzo && yaComproAlmuerzoHoy()) {
      mostrarNotificacion('Regla RN01: Ya registraste un pedido de Almuerzo el día de hoy.');
      return;
    }

    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => String(item.id) === String(producto.id));

      if (esAlmuerzo) {
        const yaTieneAlmuerzoEnCarrito = prevCarrito.some((item) => {
          const n = String(item.nombre).toLowerCase();
          return n.includes('económico') || n.includes('ejecutivo');
        });

        if ((existe && existe.cantidad >= 1) || (!existe && yaTieneAlmuerzoEnCarrito)) {
          mostrarNotificacion('Regla RN01: Solo se permite 1 Almuerzo por cliente al día.');
          return prevCarrito;
        }
      }

      if (existe) {
        return prevCarrito.map((item) =>
          String(item.id) === String(producto.id)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };

  const handleCambiarCantidad = (id, nuevaCantidad) => {
    const num = parseInt(nuevaCantidad, 10);
    if (isNaN(num) || num < 1) return;

    setCarrito((prevCarrito) => {
      const producto = prevCarrito.find((item) => String(item.id) === String(id));
      if (!producto) return prevCarrito;

      const nombreProd = String(producto.nombre).toLowerCase();
      const esAlmuerzo = nombreProd.includes('económico') || nombreProd.includes('ejecutivo');

      if (esAlmuerzo && (num > 1 || yaComproAlmuerzoHoy())) {
        mostrarNotificacion('Regla RN01: Solo se permite 1 Almuerzo por cliente al día.');
        return prevCarrito;
      }

      return prevCarrito.map((item) =>
        String(item.id) === String(id) ? { ...item, cantidad: num } : item
      );
    });
  };

  const handleEliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => String(item.id) !== String(id)));
  };

  const handleConfirmarPedido = async (franjaHoraria, metodoPago = 'PAGO EN CAJA') => {
    const aNum = (str) => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
    const subtotal = carrito.reduce((acc, i) => acc + aNum(i.precio) * i.cantidad, 0);

    const payload = {
      estudiante: usuarioAutenticado ? usuarioAutenticado.nombre : 'Cliente',
      codigoUtp: usuarioAutenticado ? usuarioAutenticado.codigoUtp : '',
      items: carrito,
      franja: franjaHoraria,
      metodoPago: metodoPago.toUpperCase(),
      total: (subtotal + 1.50).toFixed(2)
    };

    try {
      await api.crearPedido(payload);
      setCarrito([]);
      setVistaActual('pedidos');
      setConfirmado(true);
      mostrarNotificacion('¡Pedido registrado con éxito en el sistema!');
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  };

  if (!usuarioAutenticado) {
    return (
      <AuthForm
        usuarios={usuarios}
        onLogin={handleLogin}
        onRestablecerPassword={handleRestablecerPassword}
      />
    );
  }

  const nombreUsuarioTexto = usuarioAutenticado ? usuarioAutenticado.nombre : 'Usuario';
  const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const misPedidosActivos = pedidos.filter(
    (p) => p.codigoUtp === usuarioAutenticado?.codigoUtp && p.estado !== 'Entregado' && p.estado !== 'Cancelado'
  ).length;

  if (rolUsuario === 'administrador') {
    return (
      <AdminPanel
        usuario={nombreUsuarioTexto}
        usuarios={usuarios}
        productos={productos}
        franjas={franjas}
        pedidos={pedidos}
        onCerrarSesion={handleCerrarSesion}
        onAgregarUsuario={handleAgregarUsuario}
        onActualizarUsuario={handleActualizarUsuario}
        onEliminarUsuario={handleEliminarUsuario}
        onAgregarProducto={handleAgregarProducto}
        onActualizarProducto={handleActualizarProducto}
        onEliminarProducto={handleEliminarProducto}
        onActualizarCapacidadFranja={handleActualizarCapacidadFranja}
      />
    );
  }

  if (rolUsuario === 'cocina') {
    return (
      <div>
        {mensajeNotificacion && (
          <div style={{ maxWidth: '1100px', margin: '16px auto 0 auto', padding: '0 20px' }}>
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ℹ️ {mensajeNotificacion}</span>
              <button onClick={() => setMensajeNotificacion('')} style={{ background: 'none', border: 'none', color: '#991b1b', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
            </div>
          </div>
        )}
        <CocinaPanel
          usuario={nombreUsuarioTexto}
          pedidos={pedidos}
          onCerrarSesion={handleCerrarSesion}
          onCambiarEstadoPedido={handleCambiarEstadoPedido}
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '40px' }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ backgroundColor: '#c8102e', color: 'white', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}>
            SmartFood UTP
          </span>
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setConfirmado(false); setVistaActual('menu'); }}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: vistaActual === 'menu' ? 'bold' : 'normal',
                color: vistaActual === 'menu' ? '#c8102e' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Menú
            </button>
            <button
              onClick={() => { setConfirmado(false); setVistaActual('pedidos'); }}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: vistaActual === 'pedidos' ? 'bold' : 'normal',
                color: vistaActual === 'pedidos' ? '#c8102e' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px',
                position: 'relative'
              }}
            >
              Mis Pedidos
              {misPedidosActivos > 0 && (
                <span style={{ marginLeft: '4px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', fontWeight: 'bold' }}>
                  {misPedidosActivos}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#374151' }}>
            Bienvenido, <strong>{nombreUsuarioTexto}</strong>
          </span>
          <button
            onClick={handleCerrarSesion}
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            Cerrar Sesión
          </button>
          <button
            onClick={() => {
              setConfirmado(false);
              setVistaActual(vistaActual === 'carrito' ? 'menu' : 'carrito');
            }}
            style={{
              position: 'relative',
              backgroundColor: vistaActual === 'carrito' ? '#dcfce7' : '#eef2ff',
              color: '#16a34a',
              border: '1px solid #bbf7d0',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🛒
            {totalItemsCarrito > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#dc2626', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold' }}>
                {totalItemsCarrito}
              </span>
            )}
          </button>
        </div>
      </header>

      {mensajeNotificacion && (
        <div style={{ maxWidth: '1100px', margin: '0 auto 16px auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>ℹ️ {mensajeNotificacion}</span>
            <button onClick={() => setMensajeNotificacion('')} style={{ background: 'none', border: 'none', color: '#991b1b', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
          </div>
        </div>
      )}

      <main>
        {vistaActual === 'carrito' && (
          <CarritoCompras
            carrito={carrito}
            franjasDisponibles={franjas}
            onCambiarCantidad={handleCambiarCantidad}
            onEliminar={handleEliminarDelCarrito}
            onConfirmar={handleConfirmarPedido}
            onVolver={() => setVistaActual('menu')}
          />
        )}
        {vistaActual === 'pedidos' && (
          <SeguimientoPedidos
            pedidos={pedidos}
            usuario={usuarioAutenticado}
            onCancelarPedido={handleCancelarPedido}
            onVolverAlMenu={() => setVistaActual('menu')}
          />
        )}
        {vistaActual === 'menu' && (
          <MenuCafeteria
            carrito={carrito}
            confirmado={confirmado}
            onAgregarAlPedido={handleAgregarAlPedido}
          />
        )}
      </main>
    </div>
  );
}