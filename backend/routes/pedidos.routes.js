import express from 'express';
import { readData, writeData } from '../server.js';

const router = express.Router();

// GET /api/pedidos -> Obtener historial de todos los pedidos
router.get('/', (req, res) => {
  try {
    const pedidos = readData('pedidos');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

// POST /api/pedidos -> Crear un nuevo pedido con validación de RN01 y descuento de cupos
router.post('/', (req, res) => {
  try {
    const { estudiante, codigoUtp, items, franja, metodoPago, total } = req.body;

    if (!codigoUtp || !items || !items.length || !franja) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para el pedido' });
    }

    const pedidos = readData('pedidos');
    const franjas = readData('franjas');

    // Validación Regla de Negocio RN01: 1 Almuerzo Económico o Ejecutivo por usuario al día
    const intentaPedirAlmuerzo = items.some((item) => {
      const n = String(item.nombre).toLowerCase();
      return n.includes('económico') || n.includes('ejecutivo');
    });

    if (intentaPedirAlmuerzo) {
      const yaComproHoy = pedidos.some(
        (p) =>
          p.codigoUtp === codigoUtp &&
          p.estado !== 'Cancelado' &&
          p.items.some((it) => {
            const n = String(it.nombre).toLowerCase();
            return n.includes('económico') || n.includes('ejecutivo');
          })
      );

      if (yaComproHoy) {
        return res.status(400).json({
          error: 'Regla RN01: Ya registraste un pedido de Almuerzo Económico o Ejecutivo el día de hoy.'
        });
      }
    }

    // Validación y descuento de cupo en la franja seleccionada
    const indexFranja = franjas.findIndex((f) => f.id === franja);
    if (indexFranja === -1) {
      return res.status(404).json({ error: 'La franja horaria seleccionada no existe' });
    }

    if (franjas[indexFranja].cupos <= 0) {
      return res.status(400).json({ error: 'La franja horaria seleccionada ya no tiene cupos disponibles' });
    }

    // Descontar cupo
    franjas[indexFranja].cupos = Math.max(0, franjas[indexFranja].cupos - 1);
    writeData('franjas', franjas);

    // Crear pedido
    const nuevoPedido = {
      id: `#00${pedidos.length + 1}`,
      estudiante: estudiante || 'Cliente',
      codigoUtp,
      items,
      franja,
      metodoPago: metodoPago || 'PAGO EN CAJA',
      total: parseFloat(total) || 0,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: 'Pendiente'
    };

    pedidos.push(nuevoPedido);
    writeData('pedidos', pedidos);

    // Emitir eventos en tiempo real vía WebSockets
    req.io.emit('pedidos_actualizados', pedidos);
    req.io.emit('franjas_actualizadas', franjas);

    res.status(201).json({ mensaje: 'Pedido registrado con éxito', pedido: nuevoPedido });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el pedido' });
  }
});

// PUT /api/pedidos/:id/estado -> Actualizar estado con búsqueda flexible de ID
router.put('/:id/estado', (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'Debes enviar un estado válido' });
    }

    const pedidos = readData('pedidos');
    const index = pedidos.findIndex(
      (p) =>
        String(p.id) === String(id) ||
        String(p.id).replace('#', '') === String(id).replace('#', '')
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedidos[index].estado = estado;
    writeData('pedidos', pedidos);

    req.io.emit('pedidos_actualizados', pedidos);

    res.json({ mensaje: 'Estado de pedido actualizado', pedido: pedidos[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
});

// PUT /api/pedidos/:id/cancelar -> Cancelar pedido y devolver cupo
router.put('/:id/cancelar', (req, res) => {
  try {
    const { id } = req.params;
    const pedidos = readData('pedidos');
    const franjas = readData('franjas');

    const indexPedido = pedidos.findIndex(
      (p) =>
        String(p.id) === String(id) ||
        String(p.id).replace('#', '') === String(id).replace('#', '')
    );

    if (indexPedido === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedidos[indexPedido].estado !== 'Pendiente') {
      return res.status(400).json({ error: 'Solo se pueden cancelar pedidos en estado Pendiente' });
    }

    pedidos[indexPedido].estado = 'Cancelado';
    writeData('pedidos', pedidos);

    const indexFranja = franjas.findIndex((f) => f.id === pedidos[indexPedido].franja);
    if (indexFranja !== -1) {
      franjas[indexFranja].cupos += 1;
      writeData('franjas', franjas);
    }

    req.io.emit('pedidos_actualizados', pedidos);
    req.io.emit('franjas_actualizadas', franjas);

    res.json({ mensaje: 'Pedido cancelado con éxito y cupo liberado', pedido: pedidos[indexPedido] });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
});

export default router;