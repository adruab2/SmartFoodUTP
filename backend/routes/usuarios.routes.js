import express from 'express';
import { readData, writeData } from '../server.js';

const router = express.Router();

// GET /api/usuarios -> Obtener todos los usuarios
router.get('/', (req, res) => {
  try {
    const usuarios = readData('usuarios');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// POST /api/usuarios -> Registrar un nuevo usuario (con validación de duplicados)
router.post('/', (req, res) => {
  try {
    const { nombre, dni, codigoUtp, tipo, rol, password } = req.body;

    if (!nombre || !codigoUtp || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const usuarios = readData('usuarios');

    // Validar si el código UTP ya existe
    const existeCodigo = usuarios.some(
      (u) => u.codigoUtp.toUpperCase() === codigoUtp.toUpperCase()
    );
    if (existeCodigo) {
      return res.status(400).json({ error: `El Código UTP "${codigoUtp}" ya está registrado` });
    }

    // Validar si el DNI ya existe (si se proporciona)
    if (dni) {
      const existeDni = usuarios.some((u) => u.dni === dni);
      if (existeDni) {
        return res.status(400).json({ error: `El DNI "${dni}" ya pertenece a otro usuario` });
      }
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      dni: dni || '',
      codigoUtp: codigoUtp.toUpperCase(),
      tipo: tipo || 'Estudiante',
      rol: rol || 'cliente',
      password
    };

    usuarios.push(nuevoUsuario);
    writeData('usuarios', usuarios);

    // Notificar cambio en tiempo real vía WebSockets
    req.io.emit('usuarios_actualizados', usuarios);

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// PUT /api/usuarios/:id -> Actualizar un usuario existente
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, codigoUtp, tipo, rol, password } = req.body;

    const usuarios = readData('usuarios');
    const index = usuarios.findIndex((u) => String(u.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos
    usuarios[index] = {
      ...usuarios[index],
      nombre: nombre || usuarios[index].nombre,
      dni: dni !== undefined ? dni : usuarios[index].dni,
      codigoUtp: codigoUtp ? codigoUtp.toUpperCase() : usuarios[index].codigoUtp,
      tipo: tipo || usuarios[index].tipo,
      rol: rol || usuarios[index].rol,
      password: password || usuarios[index].password
    };

    writeData('usuarios', usuarios);
    req.io.emit('usuarios_actualizados', usuarios);

    res.json({ mensaje: 'Usuario actualizado correctamente', usuario: usuarios[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// DELETE /api/usuarios/:id -> Eliminar o desactivar usuario
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let usuarios = readData('usuarios');

    const existe = usuarios.some((u) => String(u.id) === String(id));
    if (!existe) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuarios = usuarios.filter((u) => String(u.id) !== String(id));
    writeData('usuarios', usuarios);

    req.io.emit('usuarios_actualizados', usuarios);

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

export default router;