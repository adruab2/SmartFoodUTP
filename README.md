# SmartFood UTP - Automatización de Pedidos en Cafeterías

Curso de Desarrollo Full Stack  
Framework: React con Vite (Frontend) y Node.js con Express (Backend)

---

## 1. Descripción del Proyecto

SmartFood UTP es una aplicación web Full-Stack desarrollada para optimizar la atención y reducir las colas en las cafeterías de la Universidad Tecnológica del Perú (UTP) mediante un sistema de pedidos programados por franjas horarias.

La aplicación cuenta con tres tipos de acceso:
- **Administrador:** Puede registrar y gestionar usuarios (roles), administrar el menú del día (platos, precios, stock) y configurar el cupo máximo de pedidos por cada franja horaria.
- **Chef (Cocina):** Visualiza la cola de pedidos organizada por franjas horarias y actualiza los estados de preparación en tiempo real.
- **Cliente (Estudiante / Docente):** Consulta el menú del día, agrega platillos al carrito, selecciona una franja de recojo con cupo disponible y realiza el seguimiento en vivo de su orden.

---

## 2. Estructura del Proyecto

El proyecto está organizado en una arquitectura desacoplada Frontend / Backend:

```text
SmartFoodUTP/
├── backend/
│   ├── data/                          # Persistencia local en archivos JSON
│   │   ├── usuarios.json              # Cuentas, roles y contraseñas
│   │   ├── productos.json             # Catálogo de alimentos y stock
│   │   ├── pedidos.json               # Órdenes registradas y estados
│   │   └── franjas.json               # Franjas horarias y cupos
│   ├── routes/                        # Rutas y controladores de la API REST
│   │   ├── auth.routes.js             # Login y restablecimiento de contraseña
│   │   ├── usuarios.routes.js         # Gestión de usuarios y roles
│   │   ├── productos.routes.js        # Consulta y mantenimiento del menú
│   │   └── pedidos.routes.js          # Procesamiento de pedidos y estados
│   ├── server.js                      # Configuración de Express y Socket.IO
│   └── package.json                   # Dependencias del backend
├── src/                               # Código fuente del Frontend (React + Vite)
│   ├── components/                    # Pantallas y vistas según rol
│   │   ├── AuthForm.jsx               # Formulario de inicio de sesión
│   │   ├── ResetPassword.jsx          # Pantalla de restablecimiento de clave
│   │   ├── MenuCafeteria.jsx          # Catálogo de platillos y categorías
│   │   ├── CarritoCompras.jsx         # Carrito, cálculo de totales y selección de franja
│   │   ├── SeguimientoPedidos.jsx     # Historial y estado en vivo del cliente
│   │   ├── ModuloCocina.jsx           # Panel de cocina y comanda digital
│   │   └── AdminPanel.jsx             # Panel de gestión de usuarios, menú y franjas
│   ├── services/
│   │   └── api.js                     # Instancia de Socket.IO y llamadas Fetch REST
│   ├── App.jsx                        # Enrutamiento condicional según sesión y rol
│   └── main.jsx                       # Punto de entrada de React
├── index.html                         # Plantilla base HTML
├── package.json                       # Dependencias del frontend
├── vite.config.js                     # Configuración de Vite
└── README.md                          # Documentación del proyecto
```

---

## 3. Tecnologías y Librerías

- **Frontend:**
  - React 18 con Vite
  - Socket.IO Client (`socket.io-client`) para sincronización en tiempo real
  - CSS / Tailwind CSS para diseño responsivo
- **Backend:**
  - Node.js y Express.js
  - Socket.IO (`socket.io`) montado sobre servidor HTTP
  - CORS (`cors`) para comunicación entre puertos
- **Persistencia:** Archivos locales en formato JSON (`fs/promises`)
- **Consumo interno:** Fetch API hacia los endpoints REST locales

---

## 4. Instalación y Ejecución

### Prerrequisitos
- Node.js (v18 o superior)
- npm

### Pasos para iniciar

1. Iniciar el Backend (Servidor):
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *El servidor quedará escuchando en `http://localhost:5000` con la API REST y WebSockets activos.*

2. Iniciar el Frontend (Cliente Web):
   En una nueva terminal abierta en la raíz del proyecto:
   ```bash
   npm install
   npm run dev
   ```
   *La aplicación estará disponible en `http://localhost:5173` desde el navegador.*

---

## 5. Cuentas de Acceso

El sistema incluye cuentas iniciales para probar los diferentes roles:

| Rol | Código UTP | Contraseña | Funcionalidad |
| :--- | :--- | :--- | :--- |
| **Administrador** | `U20000000` | `123` | Gestión integral de usuarios, carta de comidas, cupos por franja horaria y reportes. |
| **Chef (Cocina)** | `U30000000` | `123` | Recepción de comandas en vivo, avance de estados y control de producción. |
| **Estudiante** | `U10000000` | `123` | Consulta de menú, armado de carrito, reserva de franja y seguimiento del pedido. |

También es posible registrar nuevos usuarios o restablecer contraseñas desde la plataforma.

---

## 6. Comunicación y Tiempo Real (API REST + WebSockets)

El proyecto articula dos capas de comunicación entre el frontend y el backend:
- **API REST (HTTP / JSON):**
  - Autenticación (`POST /api/auth/login`).
  - Obtención y actualización del catálogo (`GET` / `POST` / `PUT /api/productos`).
  - Registro de pedidos con validación en servidor de la regla **RN01** (máximo 1 almuerzo por estudiante al día) y control de cupo por franja (`POST /api/pedidos`).
- **WebSockets (Socket.IO):**
  - **Canal bidireccional:** El backend emite el evento `pedidos_actualizados` cada vez que ingresa una orden o cuando el chef cambia un estado.
  - **Sincronización:** Tanto el panel de cocina (`ModuloCocina.jsx`) como el seguimiento del estudiante actualizan sus interfaces en tiempo real sin recargar la página.