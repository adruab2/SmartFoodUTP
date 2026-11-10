import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Instancia única de WebSocket
export const socket = io(SOCKET_URL);

// Función auxiliar para peticiones HTTP fetch
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ocurrió un error en la solicitud');
  }

  return data;
}

// Endpoints organizados por entidad
export const api = {
  // Autenticación
  login: (codigoUtp, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ codigoUtp, password })
    }),

  restablecerPassword: (codigoUtp, dni, nuevaPassword) =>
    request('/auth/restablecer', {
      method: 'POST',
      body: JSON.stringify({ codigoUtp, dni, nuevaPassword })
    }),

  // Usuarios
  getUsuarios: () => request('/usuarios'),

  crearUsuario: (usuario) =>
    request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario)
    }),

  actualizarUsuario: (id, usuario) =>
    request(`/usuarios/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    }),

  eliminarUsuario: (id) =>
    request(`/usuarios/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Productos
  getProductos: () => request('/productos'),

  crearProducto: (producto) =>
    request('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    }),

  actualizarProducto: (id, producto) =>
    request(`/productos/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(producto)
    }),

  eliminarProducto: (id) =>
    request(`/productos/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  // Franjas Horarias
  getFranjas: () => request('/franjas'),

  actualizarCapacidadFranja: (id, cupos) =>
    request(`/franjas/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ cupos })
    }),

  // Pedidos (Con encodeURIComponent para evitar que '#' corte la URL)
  getPedidos: () => request('/pedidos'),

  crearPedido: (pedido) =>
    request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido)
    }),

  actualizarEstadoPedido: (id, estado) =>
    request(`/pedidos/${encodeURIComponent(id)}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado })
    }),

  cancelarPedido: (id) =>
    request(`/pedidos/${encodeURIComponent(id)}/cancelar`, {
      method: 'PUT'
    })
};