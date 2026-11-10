import express from 'express';
import { readData, writeData } from '../server.js';

const router = express.Router();

// POST /api/auth/login -> Iniciar sesión
router.post('/login', (req, res) => {
  const { codigoUtp, password } = req.body;

  if (!codigoUtp || !password) {
    return res.status(400).json({ error: 'Faltan credenciales obligatorias' });
  }

  const usuarios = readData('usuarios');
  const usuario = usuarios.find(
    (u) => u.codigoUtp.toUpperCase() === codigoUtp.toUpperCase() && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({ error: 'Código UTP o contraseña incorrectos' });
  }

  res.json({ mensaje: 'Login exitoso', usuario });
});

// POST /api/auth/restablecer -> Restablecer contraseña con DNI y Código UTP
router.post('/restablecer', (req, res) => {
  const { codigoUtp, dni, nuevaPassword } = req.body;

  if (!codigoUtp || !dni || !nuevaPassword) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const usuarios = readData('usuarios');
  const index = usuarios.findIndex(
    (u) => u.codigoUtp.toUpperCase() === codigoUtp.toUpperCase() && String(u.dni) === String(dni)
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Los datos no coinciden con ningún usuario registrado' });
  }

  usuarios[index].password = nuevaPassword;
  writeData('usuarios', usuarios);

  res.json({ mensaje: 'Contraseña actualizada correctamente' });
});

export default router;