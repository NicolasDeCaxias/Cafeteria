# ☕ API de la Cafetería del CRUI

API REST hecha con **Node.js** y **Express** para consultar y administrar los productos del menú de la cafetería.

> **Práctica Profesionalizante I** · Evaluación individual

Los datos se guardan en un array en memoria, sin base de datos. Por eso **los cambios se conservan solo mientras el servidor está en ejecución**: al reiniciarlo vuelven los 4 productos originales.

---

## 📋 Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (se instala junto con Node.js)

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/cafeteria-crui-api.git
cd cafeteria-crui-api

# 2. Instalar las dependencias
npm install

# 3. Iniciar el servidor
npm start
```

Si todo salió bien, la terminal muestra:

```
Servidor escuchando en http://localhost:3000
```

---

## 🛣️ Rutas disponibles

| Método | Ruta | Descripción | Éxito |
|:------:|------|-------------|:-----:|
| `GET` | `/` | Mensaje de bienvenida | 200 |
| `GET` | `/api/productos` | Lista todos los productos | 200 |
| `GET` | `/api/productos/:id` | Busca un producto por su ID | 200 |
| `POST` | `/api/productos` | Crea un producto nuevo | 201 |
| `PUT` | `/api/productos/:id` | Modifica un producto existente | 200 |
| `DELETE` | `/api/productos/:id` | Elimina un producto | 200 |

## 📦 Formato de un producto

```json
{
  "id": 5,
  "nombre": "Jugo de naranja",
  "precio": 2000,
  "categoria": "bebida"
}
```

Para `POST` y `PUT` se envía en el cuerpo (con el encabezado `Content-Type: application/json`):

```json
{
  "nombre": "Jugo de naranja",
  "precio": 2000,
  "categoria": "bebida"
}
```

| Campo | Obligatorio | Regla |
|-------|:-----------:|-------|
| `nombre` | Sí | Texto no vacío |
| `precio` | Sí | Número mayor que cero (no se acepta texto, como `"1000"`) |
| `categoria` | No | Texto |
| `id` | — | Lo genera el servidor; no hay que enviarlo |

## ⚠️ Códigos de error

| Código | Cuándo ocurre | Ejemplo de respuesta |
|:------:|---------------|----------------------|
| `400` | Datos inválidos o JSON mal formado | `{ "error": "El precio debe ser un número mayor que cero" }` |
| `404` | El producto solicitado no existe | `{ "error": "Producto no encontrado" }` |

---

## 🧪 Pruebas

Con el servidor corriendo, abrí **otra terminal** en la carpeta del proyecto y ejecutá:

```bash
node probar.js
```

El script ejecuta 16 pruebas automáticas y muestra el estado HTTP y la respuesta de cada una. Cubre:

- Consultar un producto existente y otro inexistente
- Crear un producto y verificar que aparece en el listado
- Intentar crear productos con datos inválidos
- Modificar un producto y comprobar que cambió
- Eliminar un producto y verificar que ya no existe

También se incluye el archivo `pruebas.http` con las mismas peticiones, para usar con la extensión *REST Client* de VS Code, Postman, Bruno o Thunder Client.

---

## 📁 Estructura del proyecto

```
cafeteria-crui-api/
├── capturas/        # Capturas de las pruebas
├── .gitignore       # Excluye node_modules/
├── package.json     # Dependencias y scripts
├── probar.js        # Script de pruebas automáticas
├── pruebas.http     # Peticiones para REST Client
├── README.md
└── server.js        # Servidor Express con las rutas
```

## 🛠️ Tecnologías

- Node.js
- Express
