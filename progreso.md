# Documentación detallada del sistema de juego

Este documento explica cada variable y cada método del juego, línea por línea, incluyendo condiciones (if), bucles y efectos en el estado.

---

## Estado reactivo (data)

```js
coins: 10,                 // Monedas iniciales del jugador
plotCost: 5,               // Costo global para comprar una parcela
showBook: false,           // Controla la visibilidad del modal "libro/mercado"
inventoryOpen: false,      // Indica si el inventario desplegable está abierto
selectedSeed: null,        // Objeto de la semilla actualmente seleccionada o null si no hay selección
shovelMode: false,         // Modo pala (true = desplantar al hacer clic en la parcela)

seedsInventory: [          // Inventario de semillas (lista reactiva)
  { id: 'albaca', name: 'Albaca', image: 'assets/albacaSeeds.png', quantity: 10 },
  { id: 'mandragora', name: 'Mandragora', image: 'assets/mandragoraSeed.png', quantity: 5 }
],

fertilizer: {              // Estado del fertilizante
  id: 'fertilizer_basic',
  name: 'Fertilizer',
  image: 'assets/bolsaAbono.png',
  price: 3,                // Precio por compra
  quantity: 0              // Cantidad disponible
},

// Grillas de parcelas (lado izquierdo y derecho)
plotsLeft:  Array(12).fill(false),  // false = no comprada, true = comprada
plotsRight: Array(12).fill(false),

// Flags para animación de "denegado" (falta de monedas) por celda
deniedLeft:  Array(12).fill(false),
deniedRight: Array(12).fill(false),

// Cultivos plantados por celda; null = vacío o un objeto cultivo
// Cultivo: { seedId, seedName, phase, plantedAt }
cropsLeft:  Array(12).fill(null),
cropsRight: Array(12).fill(null)
```

Notas:
- Cada Array(12) representa 12 celdas por lado. Vue hace reactivo cada índice.
- plantedAt es un timestamp en milisegundos (Date.now()).

---

## Propiedades computadas

```js
currentImage() {           // Devuelve la imagen activa según algún índice this.i (si existe en tu código)
  return this.variants[this.i].image; // Lee variantes e índice actual para mostrar imagen
}
```

---

## Métodos de UI

### inventoryAction

```js
inventoryAction() {             // Alterna la visibilidad del inventario
  this.inventoryOpen = !this.inventoryOpen; // Cambia true↔false
}
```

### toggleBook

```js
toggleBook() {                  // Alterna la visibilidad del modal "libro/mercado"
  this.showBook = !this.showBook; // Cambia true↔false
}
```

---

## Gestión del cursor y selección de semilla

### cursorSelected(seed)

```js
cursorSelected(seed) {                                  // Se ejecuta al hacer clic en una semilla del inventario
  if (this.selectedSeed && this.selectedSeed.id === seed.id) { // if: ¿hay una semilla seleccionada y es la misma?
    this.clearSeedSelection();                          // Sí: deselecciona y restaura cursor
    return;                                             // Sale para no ejecutar el resto
  }
  this.shovelMode = false;                              // Al seleccionar semilla, apaga el modo pala
  this.selectedSeed = seed;                             // Guarda la semilla como selección actual
  document.body.style.cursor = `url(${seed.image}) 16 16, pointer`; // Cambia cursor a la imagen de la semilla
}
```

Explicación del cursor:
- url(${seed.image}): usa la imagen de la semilla como cursor.
- 16 16: hotspot centrado aprox (punto de clic).
- pointer: fallback si no carga la imagen.

### clearSeedSelection

```js
clearSeedSelection() {                    // Limpia la selección de semilla y el cursor
  this.selectedSeed = null;               // Quita la referencia de la semilla seleccionada
  if (!this.shovelMode) document.body.style.cursor = ''; // if: solo restaura cursor si la pala NO está activa
}
```

---

## Herramientas

### plantAction (modo pala)

```js
plantAction() {
  this.shovelMode = !this.shovelMode;          // Alterna el modo pala
  if (this.shovelMode) {                       // Si ahora está en modo pala:
    this.clearSeedSelection();                 // Limpia cualquier semilla seleccionada
    document.body.style.cursor = 'url(assets/shovel.png) 16 16, pointer'; // Cambia cursor a pala
  } else {
    document.body.style.cursor = '';           // Restaura cursor normal
  }
}
```

---

## Orquestador de acciones: handlePlotClick

```js
handlePlotClick(side, index) {
  const plots = side === 'left' ? this.plotsLeft : this.plotsRight;
  const crops = side === 'left' ? this.cropsLeft : this.cropsRight;

  if (this.shovelMode) {                        // Si está en modo pala:
    if (crops[index]) this.removeCrop(side, index); // Si hay cultivo, lo quita
    else console.log('No hay un cultivo para quitar en esta parcela.');
    return;
  }
  if (!plots[index]) { this.buyPlot(side, index); return; } // Si no comprada, compra parcela
  if (plots[index] && !crops[index] && this.selectedSeed) {
    this.plantSeed(side, index); return;        // Si comprada y vacía, planta semilla
  }
  if (crops[index]) console.log('Ya hay un cultivo aquí:', crops[index]);
}
```

---

## Compra de parcelas: buyPlot

```js
buyPlot(side, index) {
  const plots  = side === 'left' ? this.plotsLeft  : this.plotsRight;
  const denied = side === 'left' ? this.deniedLeft : this.deniedRight;

  if (this.coins >= this.plotCost) {            // Si hay suficientes monedas:
    plots[index] = true;                       // Marca parcela como comprada
    this.coins -= this.plotCost;               // Resta el costo de la parcela
  } else {
    denied[index] = true;                      // Activa animación de "denegado"
    setTimeout(() => (denied[index] = false), 350); // Desactiva después de 350ms
  }
}
```

---

## Gestión de semillas

### Uso y compra de semillas

```js
useSeed(id) {
  const seed = this.seedsInventory.find(seedItem => seedItem.id === id);
  if (seed && seed.quantity > 0) {
    seed.quantity -= 1;                        // Resta 1 a la cantidad de semillas
    return true;
  }
  return false;
}

buySeed(id) {
  const seed = this.seedsInventory.find(seedItem => seedItem.id === id);
  if (seed) seed.quantity += 1;                // Suma 1 a la cantidad de semillas
}
```

---

## Fertilizante

### Uso y compra de fertilizante

```js
fertilizeAction() {
    if (this.fertilizer.quantity > 0) {
        this.fertilizer.quantity -= 1;          // Resta 1 al fertilizante disponible
    }
}

buyFertilizer() {
    this.fertilizer.quantity += 3;            // Suma 3 unidades de fertilizante
}
```

---

## Flujo de Comunicación (Eventos)

### De GameMain.js → main.js

```javascript
// En GameMain.js
this.$emit('buy-seed', seedId);

// Se recibe en main.js
@buy-seed="buySeed"
```

**Analogía:**  
El componente hijo (GameMain) es como un **empleado** que grita "¡Cliente quiere comprar albaca!". El padre (main.js) escucha y ejecuta `buySeed('albaca')`.

### Todos los Eventos

| Evento Vue | Método en main.js | ¿Qué hace? |
|------------|-------------------|------------|
| `@inventory-action` | `inventoryAction()` | Abre/cierra inventario |
| `@buy-seed` | `buySeed(id)` | Compra 1 semilla |
| `@sell-seed` | `sellSeed(id)` | Vende 1 semilla |
| `@use-seed` | `useSeed(seed)` | Usa 1 semilla (plantar) |
| `@fertilize-action` | `fertilizeAction()` | Usa 1 fertilizante |
| `@buy-fertilizer` | `buyFertilizer()` | Compra +3 fertilizante |

---

## 🎨 Componentes Vue

### GameMain.js - La Interfaz del Juego

**Responsabilidades:**
1. Mostrar la granja (imagen de fondo)
2. Sidebar con botones de acción
3. Inventario desplegable
4. Modal del mercado (libro)

**Props que recibe:**
- `inventoryOpen`: ¿Está abierto el inventario?
- `seeds`: Array de semillas
- `fertilizer`: Objeto del fertilizante

**Eventos que emite:**
- `inventory-action`, `buy-seed`, `sell-seed`, `use-seed`, etc.

**Analogía:**  
Es como la **pantalla de tu teléfono**. Muestra información y envía señales cuando tocas botones.

---

## 🔍 Búsqueda con `.find()`

```javascript
const seed = this.seeds.find(seedItem => seedItem.id === id);
```

**¿Qué hace `.find()`?**  
Busca el **primer elemento** que cumpla la condición.

**Paso a paso:**
1. Recorre el array `seeds` uno por uno
2. Por cada `seedItem`, compara: `seedItem.id === 'albaca'`?
3. Si encuentra coincidencia, devuelve ese objeto
4. Si no encuentra nada, devuelve `undefined`

**Analogía:**  
Es como buscar un libro en una biblioteca:
- Recorres estante por estante (`seedItem`)
- Miras el código (`seedItem.id`)
- Cuando coincide, lo tomas y dejas de buscar

---

## 🧩 Conceptos Clave

### `const` dentro de métodos

```javascript
const seed = this.seeds.find(...);
```

**¿Por qué `const`?**  
Es una variable **temporal** que solo vive durante la ejecución del método.

**Analogía:**  
Como un **post-it** que pegas mientras buscas algo y luego lo tiras. No necesitas guardarlo en `data()` porque no es información permanente.

### Operador `&&` (AND lógico)

```javascript
if (seed && seed.quantity > 0)
```

**¿Qué significa?**  
"Si `seed` existe **Y** su cantidad es mayor a 0"

**Analogía:**  
Solo puedes abrir una puerta si:
1. Tienes la llave (`seed` existe)
2. **Y** la llave está en buen estado (`quantity > 0`)

Si falta cualquiera de las dos, no abres.

---

## 📊 Resumen Visual

```
Usuario hace clic en "Comprar Albaca"
         ↓
GameMain.js emite: this.$emit('buy-seed', 'albaca')
         ↓
game.html escucha: @buy-seed="buySeed"
         ↓
main.js ejecuta: buySeed('albaca')
         ↓
Busca la semilla: const seed = this.seeds.find(...)
         ↓
Suma 1: seed.quantity += 1
         ↓
Vue detecta el cambio y actualiza la UI automáticamente ✨
```

---

## 🎓 Glosario

- **Prop**: Datos que un componente hijo recibe del padre
- **Emit**: Evento que un hijo envía al padre
- **Reactive**: Datos que Vue vigila para actualizar la interfaz automáticamente
- **Template**: HTML que Vue renderiza dinámicamente
- **Component**: Pieza reutilizable de UI con su propia lógica

---

¿Necesitas que explique algo más específico? 🚀