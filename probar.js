// Script de pruebas: ejecutar con el servidor corriendo (npm start) -> node probar.js
const BASE = 'http://localhost:3000';

let fallos = 0;

async function probar(titulo, metodo, ruta, cuerpo, estadoEsperado) {
  const opciones = { method: metodo };
  if (cuerpo !== undefined) {
    opciones.headers = { 'Content-Type': 'application/json' };
    opciones.body = typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo);
  }
  const res = await fetch(BASE + ruta, opciones);
  const texto = await res.text();
  const ok = res.status === estadoEsperado;
  if (!ok) fallos++;

  console.log(`\n${ok ? '✅' : '❌'} ${titulo}`);
  console.log(`   ${metodo} ${ruta}${cuerpo !== undefined ? '  ' + (typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo)) : ''}`);
  console.log(`   Estado: ${res.status} (esperado: ${estadoEsperado})`);
  console.log(`   Respuesta: ${texto}`);
  return texto;
}

(async () => {
  try {
    await probar('Bienvenida', 'GET', '/', undefined, 200);
    await probar('Listar todos', 'GET', '/api/productos', undefined, 200);
    await probar('Producto existente', 'GET', '/api/productos/2', undefined, 200);
    await probar('Producto inexistente', 'GET', '/api/productos/99', undefined, 404);

    await probar('Crear producto válido', 'POST', '/api/productos',
      { nombre: 'Jugo de naranja', precio: 2000, categoria: 'bebida' }, 201);
    await probar('Verificar que el nuevo aparece', 'GET', '/api/productos', undefined, 200);

    await probar('Crear con precio como texto', 'POST', '/api/productos', { nombre: 'Té', precio: '1000' }, 400);
    await probar('Crear con nombre vacío', 'POST', '/api/productos', { nombre: '', precio: 1000 }, 400);
    await probar('Crear con precio cero', 'POST', '/api/productos', { nombre: 'Té', precio: 0 }, 400);
    await probar('Crear con JSON mal formado', 'POST', '/api/productos', '{nombre', 400);

    await probar('Modificar producto', 'PUT', '/api/productos/1',
      { nombre: 'Café con leche grande', precio: 2200, categoria: 'bebida' }, 200);
    await probar('Verificar la modificación', 'GET', '/api/productos/1', undefined, 200);
    await probar('Modificar con datos inválidos', 'PUT', '/api/productos/1', { nombre: '', precio: 10 }, 400);
    await probar('Modificar producto inexistente', 'PUT', '/api/productos/99', { nombre: 'X', precio: 10 }, 404);

    await probar('Eliminar producto', 'DELETE', '/api/productos/3', undefined, 200);
    await probar('Verificar que ya no existe', 'GET', '/api/productos/3', undefined, 404);
    await probar('Eliminar producto inexistente', 'DELETE', '/api/productos/99', undefined, 404);

    console.log(fallos === 0
      ? '\n🎉 Todas las pruebas pasaron.'
      : `\n⚠️  ${fallos} prueba(s) fallaron.`);
  } catch (e) {
    console.log('\nNo se pudo conectar. ¿Está el servidor corriendo con "npm start"?');
  }
})();
