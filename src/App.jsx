import { useState } from 'react'
import AuthForm from './components/AuthForm'
import AdminPanel from './components/AdminPanel'
import MenuCafeteria from './components/MenuCafeteria'

function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null) // Guardará el nombre o datos del usuario
  const [rolUsuario, setRolUsuario] = useState(null)

  const [usuarios, setUsuarios] = useState([
    { codigoUtp: 'U20000000', password: '123456', rol: 'administrador', nombre: 'Admin General', dni: '12345678', tipoUsuario: 'personal' },
    { codigoUtp: 'U30000000', password: '123456', rol: 'cocina', nombre: 'Chef Principal', dni: '87654321', tipoUsuario: 'personal' },
    { codigoUtp: 'U10000000', password: '123456', rol: 'cliente', nombre: 'Estudiante Ejemplo', dni: '45678912', tipoUsuario: 'estudiante' }
  ])

  const handleLogin = (codigo, password) => {
    const usuarioEncontrado = usuarios.find(
      (u) => u.codigoUtp.toUpperCase() === codigo.toUpperCase() && u.password === password
    )

    if (usuarioEncontrado) {
      // Guardamos el NOMBRE del usuario en lugar del código
      setUsuarioAutenticado(usuarioEncontrado.nombre)
      setRolUsuario(usuarioEncontrado.rol)
      return { exito: true, rol: usuarioEncontrado.rol }
    } else {
      return { exito: false, mensaje: 'Código UTP o contraseña incorrectos.' }
    }
  }

  const handleAgregarUsuario = (nuevoUsuario) => {
    setUsuarios((prev) => [...prev, nuevoUsuario])
  }

  const handleActualizarUsuario = (codigoUtp, datosActualizados) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.codigoUtp.toUpperCase() === codigoUtp.toUpperCase()) {
          return {
            ...u,
            ...datosActualizados,
            password: datosActualizados.password ? datosActualizados.password : u.password
          }
        }
        return u;
      })
    )
  }

  const handleEliminarUsuario = (codigoUtp) => {
    setUsuarios((prev) => prev.filter((u) => u.codigoUtp.toUpperCase() !== codigoUtp.toUpperCase()))
  }

  const handleCerrarSesion = () => {
    setUsuarioAutenticado(null)
    setRolUsuario(null)
  }

  return (
    <div>
      {!usuarioAutenticado ? (
        <AuthForm
          usuariosRegistrados={usuarios}
          onLogin={handleLogin}
          onActualizarPassword={handleActualizarUsuario}
        />
      ) : rolUsuario === 'cliente' ? (
        <MenuCafeteria
          usuario={usuarioAutenticado} // Aquí se pasa el nombre del usuario
          onCerrarSesion={handleCerrarSesion}
        />
      ) : (
        <AdminPanel
          usuario={usuarioAutenticado} // Aquí se pasa el nombre del usuario
          rolUsuario={rolUsuario}
          usuariosRegistrados={usuarios}
          onAgregarUsuario={handleAgregarUsuario}
          onActualizarUsuario={handleActualizarUsuario}
          onEliminarUsuario={handleEliminarUsuario}
          onCerrarSesion={handleCerrarSesion}
        />
      )}
    </div>
  )
}

export default App