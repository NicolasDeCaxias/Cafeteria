const express = require('express');

const app = express();
const PORT = 3000;

// Middleware para interpretar el cuerpo de las peticiones como JSON
app.use(express.json());

// "Base de datos" en memoria: los cambios duran mientras el servidor esté en ejecución
const productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

// Genera un id nuevo: el mayor existente + 1 (así nunca se repite, aunque se eliminen productos)
function generarId() {
  return productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
}

// Valida los datos de un producto. Devuelve un mensaje de error o null si todo está bien.
function validarProducto(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return 'El cuerpo de la petición debe ser un objeto JSON';
  }
  const { nombre, precio, categoria } = datos;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El nombre es obligatorio y no puede estar vacío';
  }
  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0) {
    return 'El precio debe ser un número mayor que cero';
  }
  if (categoria !== undefined && typeof categoria !== 'string') {
    return 'La categoría, si se envía, debe ser texto';
  }
  return null;
}

// Busca el índice de un producto por id (viene como texto en la URL). Devuelve -1 si no existe.
function buscarIndice(idParam) {
  const id = Number(idParam);
  return productos.findIndex(p => p.id === id);
}

// GET / -> bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

// GET /api/productos -> listar todos
app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

// GET /api/productos/:id -> buscar uno
app.get('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json(productos[indice]);
});

// POST /api/productos -> crear
app.post('/api/productos', (req, res) => {
  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { nombre, precio, categoria } = req.body;
  const nuevo = { id: generarId(), nombre: nombre.trim(), precio };
  if (categoria !== undefined) nuevo.categoria = categoria;

  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT /api/productos/:id -> modificar
app.put('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { nombre, precio, categoria } = req.body;
  // Se conserva el id original; el cliente no puede cambiarlo
  const actualizado = { id: productos[indice].id, nombre: nombre.trim(), precio };
  if (categoria !== undefined) actualizado.categoria = categoria;

  productos[indice] = actualizado;
  res.status(200).json(actualizado);
});

// DELETE /api/productos/:id -> eliminar
app.delete('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const [eliminado] = productos.splice(indice, 1);
  res.status(200).json({ mensaje: 'Producto eliminado', producto: eliminado });
});

// Manejo de errores: JSON mal formado -> 400
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
