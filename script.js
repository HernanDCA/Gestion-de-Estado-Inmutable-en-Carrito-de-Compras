// 1. Inventario previo cargado en memoria
const inventario = [
  { id: 1, nombre: "Teclado Mecánico", precio: 100, stock: 5 },
  { id: 2, nombre: "Monitor 27", precio: 300, stock: 2 },
  { id: 3, nombre: "Mouse Pad Gamer", precio: 20, stock: 0 }, // Producto agotado
  { id: 4, nombre: "Auriculares USB", precio: 80, stock: 3 }
];

// ==========================================
// FUNCIÓN PRINCIPAL CON REGLAS INMUTABLES
// ==========================================

/**
 * Retorna una nueva lista de productos con descuento aplicado y marca de oferta,
 * conservando solo aquellos con stock > 0 y garantizando inmutabilidad estricta.
 * 
 * @param {Array} listaProductos - Array original de productos.
 * @param {number} porcentajeDescuento - Porcentaje a descontar (0-100).
 * @returns {Array} Nuevo array con copias transformadas de los productos.
 */
function aplicarDescuentoTemporada(listaProductos, porcentajeDescuento) {
  return listaProductos
    // Paso 1: .filter() genera un NUEVO array con solo los productos disponibles (stock > 0)
    .filter(producto => producto.stock > 0)
    // Paso 2: .map() crea un NUEVO objeto en memoria para cada elemento utilizando el operador Spread (...)
    .map(producto => {
      const precioCalculado = producto.precio * (1 - porcentajeDescuento / 100);

      return {
        ...producto,                 // Copia todas las propiedades del producto original
        precio: precioCalculado,    // Sobrescribe el precio con el nuevo valor descontado
        enOferta: true              // Añade la nueva propiedad requerida
      };
    });
}

// ==========================================
// INTERACCIÓN CON EL DOM Y PRUEBAS
// ==========================================

const formDescuento = document.getElementById("formDescuento");
const inputPorcentaje = document.getElementById("porcentaje");

const tbodyOriginal = document.querySelector("#tablaOriginal tbody");
const tbodyNuevo = document.querySelector("#tablaNuevo tbody");

const elemTestPrecio = document.getElementById("testPrecioOriginal");
const elemTestIdentidad = document.getElementById("testIdentidadMemoria");
const elemTestFiltrado = document.getElementById("testFiltradoStock");

// Función auxiliar para renderizar datos en las tablas
function renderizarTablas(nuevoInventario) {
  // Renderizar Inventario Original
  tbodyOriginal.innerHTML = "";
  inventario.forEach(p => {
    const tr = document.createElement("tr");
    if (p.stock === 0) tr.classList.add("agotado");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
    `;
    tbodyOriginal.appendChild(tr);
  });

  // Renderizar Nuevo Inventario Transformado
  tbodyNuevo.innerHTML = "";
  nuevoInventario.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio.toFixed(2)}</td>
      <td><span class="badge-oferta">${p.enOferta ? "En Oferta" : "Normal"}</span></td>
    `;
    tbodyNuevo.appendChild(tr);
  });
}

// Función auxiliar para ejecutar y mostrar las verificaciones de inmutabilidad
function ejecutarVerificaciones(nuevoInventario) {
  // Verificación 1: El precio original no sufrió alteraciones
  const pruebaPrecio = inventario[0].precio === 100;
  elemTestPrecio.innerHTML = `
    1. inventario[0].precio === 100 &rightarrow; 
    <span class="${pruebaPrecio ? 'pass' : 'fail'}">${pruebaPrecio}</span> 
    ${pruebaPrecio ? '(ÉXITO: El precio del objeto original se mantiene intacto)' : '(FALLO: El objeto original fue alterado)'}
  `;

  // Verificación 2: Comparación de identidad por referencia en memoria
  const esDistintaReferencia = (inventario[0] == nuevoInventario[0]) === false;
  elemTestIdentidad.innerHTML = `
    2. inventario[0] == nuevoInventario[0] &rightarrow; 
    <span class="${esDistintaReferencia ? 'pass' : 'fail'}">${inventario[0] == nuevoInventario[0]}</span> 
    ${esDistintaReferencia ? '(ÉXITO: Son referencias distintas en memoria)' : '(FALLO: Son la misma referencia)'}
  `;

  // Verificación 3: Solo incluye elementos con stock > 0
  const sinAgotados = nuevoInventario.every(p => p.stock > 0);
  elemTestFiltrado.innerHTML = `
    3. Todos los productos tienen stock > 0 &rightarrow; 
    <span class="${sinAgotados ? 'pass' : 'fail'}">${sinAgotados}</span> 
    (${nuevoInventario.length} de ${inventario.length} productos incluidos)
  `;
}

// Evento Submit: Procesa la transformación cuando el usuario envía el formulario
formDescuento.addEventListener("submit", (e) => {
  e.preventDefault();

  const porcentaje = parseFloat(inputPorcentaje.value) || 0;

  // Ejecución de la función inmutable
  const nuevoInventario = aplicarDescuentoTemporada(inventario, porcentaje);

  // Actualizar la interfaz y evaluar los test de memoria
  renderizarTablas(nuevoInventario);
  ejecutarVerificaciones(nuevoInventario);
});

// Carga inicial al abrir la página (con 20% de descuento por defecto)
document.addEventListener("DOMContentLoaded", () => {
  const nuevoInicial = aplicarDescuentoTemporada(inventario, 20);
  renderizarTablas(nuevoInicial);
  ejecutarVerificaciones(nuevoInicial);
});