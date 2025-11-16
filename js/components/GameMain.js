app.component('game-main', {


  props: {
    inventoryOpen: { type: Boolean, required: true },
    seeds: { type: Array, required: true },
    fertilizer: { type: Object, required: true },
    coins: { type: Number, required: true }
  },



  data() {
    return { 
      showCodex: false,
      plotsLeft: Array(12).fill(false),
      plotsRight: Array(12).fill(false),
      deniedLeft: Array(12).fill(false), //se usan mas q nada para la animacion cuando no hay monedas pa comprar
      deniedRight: Array(12).fill(false),
    };
  },



  methods: {
    handlePlant() { this.$emit('plant-action'); },

    handleWater() { this.$emit('water-action'); },

    handleFertilize() { this.$emit('fertilize-action'); },

    handleInventory() { this.$emit('inventory-action'); },

    handleBuyFertilizer() { this.$emit('buy-fertilizer'); },

    toggleCodex() { this.showCodex = !this.showCodex; },


    togglePlot(side, index) {
      const list = side === 'left' ? this.plotsLeft : this.plotsRight;
      const denied = side === 'left' ? this.deniedLeft : this.deniedRight;
      //lo hice por lados para no pasarla tan mal entonces tiene q verificar los lados
      //el codigo dice si es es left entonces usa deniedLeft sino usa deniedRight
      //y si no tiene monedas le da el feedback visual

      // Ya comprada → no hace nada
      if (list[index]) return;

      const COST = 5;
      if (this.coins >= COST) {
        list[index] = true;               // compra la parcela
        this.$emit('spend-coins', COST);  // descuenta monedas
      } else {
        denied[index] = true;             // avisa si no se puede con la sacudida
        setTimeout(() => (denied[index] = false), 400); //esto es para que la animacion no explote,le da una pausita
        //a la animacion de sacudida de cuqando no se puede comprar y ya luego sigue en lo suyo.
      }
    }
  },


  mounted() {
    console.log('Seeds recibidas:', this.seeds); 
    console.log('Inventory open:', this.inventoryOpen); 
  },

  template: /*html*/`
  <main class="main-content">
    <section class="image-container">
      <img src="assets/bg-granja.png" alt="">
      <aside class="game-sidebar">
        <div class="game-actions">

          <div class="coin-display" title="Monedas">
            <img src="assets/coin.png" alt="Monedas" class="coin-icon-img">
            <span class="tool-quantity">{{ coins }}</span>
          </div>

          <button class="action-btn" title="Quitar planta" @click="handlePlant">
            <img src="assets/shovel.png" alt="Quitar planta" class="action-icon-img">
          </button>

          <button class="action-btn" title="Regar" @click="handleWater">
            <img src="assets/regar.png" alt="Regar" class="action-icon-img">
          </button>

          <!-- Fertilizante con contador -->
          <button class="action-btn" title="Fertilizar (usa 1)" @click="handleFertilize">
            <img src="assets/bolsaAbono.png" alt="Fertilizar" class="action-icon-img">
            <span class="tool-quantity" :class="{ empty: fertilizer.quantity <= 0 }">{{ fertilizer.quantity }}</span>
          </button>


          <!-- Libro / Mercado -->
          <button class="action-btn" @click="toggleCodex" title="Libro / Mercado">
            <img src="assets/libroTemporal.jpg" alt="Libro" class="action-icon-img">
          </button>

          <!-- Inventario (solo semillas) -->
          <button class="action-btn" title="Inventario" @click="handleInventory" :class="{ 'active': inventoryOpen }">
            <img src="assets/bolsabase.png" alt="Inventario" class="action-icon-img">
          </button>

          <div v-if="inventoryOpen" class="inventory-dropdown">
            <div v-for="seed in seeds"
                :key="seed.id"
                class="inventory-item"
                :class="{ selected: selectedSeed && selectedSeed.id === seed.id }"
                @click="handleSelectSeed(seed)">
              <img :src="seed.image" :alt="seed.name" class="seed-icon">
              <span class="seed-quantity">{{ seed.quantity }}</span>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <!-- Grilla de parcelas - izquierda y derecha -->
    <div class="plots-grid plots-left">
      <div v-for="(activated, i) in plotsLeft" :key="'L'+i"
           class="plot-cell"
           :class="{ 'plot-active': activated, 'plot-denied': deniedLeft[i] }"
           @click="togglePlot('left', i)"></div>
    </div>
    <div class="plots-grid plots-right">
      <div v-for="(activated, i) in plotsRight" :key="'R'+i"
           class="plot-cell"
           :class="{ 'plot-active': activated, 'plot-denied': deniedRight[i] }"
           @click="togglePlot('right', i)"></div>
    </div>

    <!-- Interfaz del libro: comprar +3 fertilizante -->
    <div v-if="showCodex" class="book-modal" @click.self="toggleCodex">
      <div class="book-box">
        <header class="book-box-header">
          <h3 class="white-color">Market</h3>
          <button class="close-btn" @click="toggleCodex" aria-label="Cerrar">✕</button>
        </header>
        <div class="book-box-body">
          <div class="market-item">
            <img :src="fertilizer.image" :alt="fertilizer.name" class="market-img">
            <h4 class="white-color">{{ fertilizer.name }}</h4>
            <p class="white-color">Units: {{ fertilizer.quantity }}</p>
            <p class="white-color">Price: {{ fertilizer.price }}</p>
            <button class="market-buy-btn"  :disabled="coins < 3" @click="handleBuyFertilizer">Buy +3</button>
          </div>
        </div>
      </div>
    </div>
  </main>
  `
});
