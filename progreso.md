# 📚 Documentación del Sistema de Juego - Mushroom's Garden

## 🎯 Visión General

Imagina tu juego como una **tienda de jardinería** donde:
- Tienes un **inventario** (bolsa) con semillas
- Tienes **herramientas** (pala, regadera, fertilizante)
- Hay un **mercado** (libro) donde compras y vendes

---

## 🗂️ Estructura de Datos (data)

### `seeds` - Tu Caja de Semillas
```javascript
seeds: [
    { id: 'albaca', name: 'Albaca', image: 'assets/albacaSeeds.png', quantity: 10 },
    { id: 'mandragora', name: 'Mandragora', image: 'assets/mandragoraSeed.png', quantity: 5 }
]
```

**Analogía:** Como una caja de zapatos con etiquetas:
- `id`: código único (como un código de barras)
- `name`: nombre visible
- `image`: foto del producto
- `quantity`: cuántas unidades tienes

### `fertilizer` - Tu Bolsa de Abono
```javascript
fertilizer: { 
    id: 'fertilizer_basic', 
    name: 'Fertilizante', 
    image: 'assets/bolsaAbono.png', 
    quantity: 0 
}
```

**Analogía:** Una bolsa de abono con un contador visible. Empiezas con 0.

### `inventoryOpen` - Estado del Inventario
```javascript
inventoryOpen: false
```

**Analogía:** Un interruptor de luz. `false` = inventario cerrado, `true` = inventario abierto.

---

## 🛠️ Métodos Principales

### 1️⃣ `inventoryAction()` - Abrir/Cerrar el Inventario

```javascript
inventoryAction() {
    this.inventoryOpen = !this.inventoryOpen;
}
```

**¿Qué hace?**  
Alterna el estado del inventario (como un interruptor).

**Analogía:**  
Es como abrir o cerrar tu mochila:
- Si está cerrada (`false`) → se abre (`true`)
- Si está abierta (`true`) → se cierra (`false`)

**Cuándo se usa:**  
Cuando haces clic en el botón de la bolsa 🎒

---

### 2️⃣ `buySeed(id)` - Comprar una Semilla

```javascript
buySeed(id) {
    const seed = this.seeds.find(seedItem => seedItem.id === id);
    if (seed) seed.quantity += 1;
}
```

**¿Qué hace?**  
1. Busca la semilla por su `id` (como buscar un producto por código de barras)
2. Si la encuentra, suma 1 a su cantidad

**Analogía:**  
Vas al mercado y compras **1 paquete de semillas de albaca**. El vendedor actualiza tu caja:
- Antes: `albaca: 10`
- Después: `albaca: 11`

**Cuándo se usa:**  
Cuando haces clic en "Comprar +1" en el libro/mercado.

---

### 3️⃣ `sellSeed(id)` - Vender una Semilla

```javascript
sellSeed(id) {
    const seed = this.seeds.find(seedItem => seedItem.id === id);
    if (seed && seed.quantity > 0) seed.quantity -= 1;
}
```

**¿Qué hace?**  
1. Busca la semilla por `id`
2. Verifica que tengas al menos 1 (`quantity > 0`)
3. Si sí, resta 1

**Analogía:**  
Vendes 1 paquete de semillas al mercado. Solo puedes vender si tienes stock:
- Antes: `mandragora: 5`
- Después: `mandragora: 4`

**Cuándo se usa:**  
Cuando haces clic en "Vender -1" en el mercado.

---

### 4️⃣ `useSeed(seed)` - Usar una Semilla

```javascript
useSeed(seed) {
    const seedInInventory = this.seeds.find(seedItem => seedItem.id === seed.id);
    if (seedInInventory && seedInInventory.quantity > 0) seedInInventory.quantity -= 1;
}
```

**¿Qué hace?**  
1. Busca la semilla en tu inventario
2. Si la tienes, consume 1 unidad (como plantarla)

**Analogía:**  
Sacas 1 semilla de tu bolsa y la plantas en la tierra:
- Antes: `albaca: 10`
- Después: `albaca: 9`

**Cuándo se usa:**  
Cuando haces clic en una semilla del inventario lateral.

---

### 5️⃣ `fertilizeAction()` - Usar Fertilizante

```javascript
fertilizeAction() {
    if (this.fertilizer.quantity > 0) {
        this.fertilizer.quantity -= 1;
    }
}
```

**¿Qué hace?**  
Consume 1 unidad de fertilizante (solo si tienes).

**Analogía:**  
Abres la bolsa de abono y echas 1 puñado en la planta:
- Antes: `fertilizer: 3`
- Después: `fertilizer: 2`

**Cuándo se usa:**  
Cuando haces clic en el botón de la bolsa de abono 💩

---

### 6️⃣ `buyFertilizer()` - Comprar Fertilizante

```javascript
buyFertilizer() {
    this.fertilizer.quantity += 3;
}
```

**¿Qué hace?**  
Compra 3 unidades de fertilizante de golpe.

**Analogía:**  
Compras una bolsa nueva de abono que trae 3 porciones:
- Antes: `fertilizer: 0`
- Después: `fertilizer: 3`

**Cuándo se usa:**  
Cuando haces clic en "Comprar +3" en el mercado (libro).

---

## 🔄 Flujo de Comunicación (Eventos)

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