import express from 'express';
import { readData, writeData } from '../server.js';

const router = express.Router();

// GET /api/productos -> Obtener catálogo de platillos
router.get('/', (req, res) => {
  try {
    const productos = readData('productos');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platillos' });
  }
});

// POST /api/productos -> Agregar un nuevo platillo al menú
router.post('/', (req, res) => {
  try {
    const { nombre, categoria, precio, imagen } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const productos = readData('productos');

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      categoria: categoria || 'ALMUERZOS',
      precio,
      imagen: imagen || '/img/menu-ejecutivo.jpg'
    };

    productos.push(nuevoProducto);
    writeData('productos', productos);

    // Emitir catálogo actualizado a todos los clientes conectados
    req.io.emit('productos_actualizados', productos);

    res.status(201).json({ mensaje: 'Platillo agregado con éxito', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el platillo' });
  }
});

// PUT /api/productos/:id -> Editar un platillo del menú
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, imagen } = req.body;

    const productos = readData('productos');
    const index = productos.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }

    productos[index] = {
      ...productos[index],
      nombre: nombre || productos[index].nombre,
      categoria: categoria || productos[index].categoria,
      precio: precio || productos[index].precio,
      imagen: imagen || productos[index].imagen
    };

    writeData('productos', productos);
    req.io.emit('productos_actualizados', productos);

    res.json({ mensaje: 'Platillo actualizado con éxito', producto: productos[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el platillo' });
  }
});

// DELETE /api/productos/:id -> Eliminar un platillo del menú
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let productos = readData('productos');

    const existe = productos.some((p) => String(p.id) === String(id));
    if (!existe) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }

    productos = productos.filter((p) => String(p.id) !== String(id));
    writeData('productos', productos);

    req.io.emit('productos_actualizados', productos);

    res.json({ mensaje: 'Platillo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el platillo' });
  }
});

export default router;