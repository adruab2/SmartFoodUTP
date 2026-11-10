import express from 'express';
import { readData, writeData } from '../server.js';

const router = express.Router();

// GET /api/franjas -> Obtener lista de franjas horarias y sus cupos actuales
router.get('/', (req, res) => {
  try {
    const franjas = readData('franjas');
    res.json(franjas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las franjas horarias' });
  }
});

// PUT /api/franjas/:id -> Modificar la capacidad máxima de una franja desde el panel Admin
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { cupos } = req.body;

    if (cupos === undefined || isNaN(cupos)) {
      return res.status(400).json({ error: 'Debes enviar un número válido de cupos' });
    }

    const franjas = readData('franjas');
    const index = franjas.findIndex((f) => f.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Franja horaria no encontrada' });
    }

    franjas[index].cupos = Math.max(0, parseInt(cupos, 10));
    writeData('franjas', franjas);

    // Sincronizar cupos en tiempo real con todos los clientes
    req.io.emit('franjas_actualizadas', franjas);

    res.json({ mensaje: 'Capacidad de franja actualizada correctamente', franja: franjas[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la franja horaria' });
  }
});

export default router;