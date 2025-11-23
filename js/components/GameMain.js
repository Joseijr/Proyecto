app.component('game-main', {
  data() {
    return {
      plants: [],
      loading: false,
      error: null
    };
  },
  props: {
    inventoryOpen: { type: Boolean, required: true },
    seeds: { type: Array, required: true },
    fertilizer: { type: Object, required: true },
    coins: { type: Number, required: true },
    selectedSeed: { type: Object, default: null },
    showBook: { type: Boolean, required: true },
    plotsLeft: { type: Array, required: true },
    plotsRight: { type: Array, required: true },
    deniedLeft: { type: Array, required: true },
    deniedRight: { type: Array, required: true },
    cropsLeft: { type: Array, required: true },
    cropsRight: { type: Array, required: true }
  },

  methods: {

    getPlants() {
      this.loading = true;
      this.error = null;
      const server = 'http://prueba.test';
      // Replace the URL below with your custom API link
      fetch(server + '/api/v1/garden/plants')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          this.plants = data;
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },
    // Solo emite eventos al padre
    handlePlant() { this.$emit('plant-action'); },
    handleWater() { this.$emit('water-action'); },
    handleFertilize() { this.$emit('fertilize-action'); },
    handleInventory() { this.$emit('inventory-action'); },
    handleBuyFertilizer() { this.$emit('buy-fertilizer'); },
    handleSelectSeed(seed) { this.$emit('select-seed', seed); },
    handleToggleBook() { this.$emit('toggle-book'); },
    handlePlotClick(side, index) { this.$emit('plot-click', side, index); },

    // obtener imagen según fase del cultivo
    getCropImage(crop) {
      if (!crop) return null;
      if (crop.phase === 'start') return 'assets/startgrowing.png';
      if (crop.phase === 'almost') return 'assets/almostgrown.png';
      return null;
    }
  },
  created() {
    this.getPlants();
  },
  template: /*html*/`
  <main class="main-content">
    <section class="image-container">
      <img src="assets/bg-granja.png" alt="">
      <aside class="game-sidebar">
        <div class="game-actions">

          <!-- Monedas -->
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

          <button class="action-btn" title="Fertilizar (usa 1)" @click="handleFertilize">
            <img src="assets/bolsaAbono.png" alt="Fertilizar" class="action-icon-img">
            <span class="tool-quantity" :class="{ empty: fertilizer.quantity <= 0 }">{{ fertilizer.quantity }}</span>
          </button>

          <button class="action-btn" @click="handleToggleBook" title="Libro / Mercado">
            <img src="assets/book.png" alt="Libro" class="action-icon-img">
          </button>

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

    <!-- Grillas de parcelas -->
    <div class="plots-grid plots-left">
      <div v-for="(activated, i) in plotsLeft" :key="'L'+i"
           class="plot-cell"
           :class="{
             'plot-active': activated,
             'plot-denied': deniedLeft[i],
             'plot-planted': cropsLeft[i]
           }"
           @click="handlePlotClick('left', i)">
        <img v-if="cropsLeft[i]" :src="getCropImage(cropsLeft[i])" class="crop-image" alt="Cultivo">
      </div>
    </div>

    <div class="plots-grid plots-right">
      <div v-for="(activated, i) in plotsRight" :key="'R'+i"
           class="plot-cell"
           :class="{
             'plot-active': activated,
             'plot-denied': deniedRight[i],
             'plot-planted': cropsRight[i]
           }"
           @click="handlePlotClick('right', i)">
        <img v-if="cropsRight[i]" :src="getCropImage(cropsRight[i])" class="crop-image" alt="Cultivo">
      </div>
    </div>

    <!-- Modal Mercado -->
<div v-if="showBook" class="book-modal" @click.self="handleToggleBook">
  <div class="book-box">
    <header class="book-box-header">
      <h3 class="white-color">Market</h3>
      <button class="close-btn" @click="handleToggleBook" aria-label="Cerrar">✕</button>
    </header>
    <div class="book-box-body">

      <!-- Lista de plantas como items de la tienda -->
      <div v-for="p in plants" :key="p.id" class="market-item">
        <img :src="p.image_url" :alt="p.name" class="market-img">
        <h4 class="white-color">{{ p.name }}</h4>
        <p class="white-color">Price: {{ p.price || 10 }} coins</p>
        <button class="market-buy-btn"
                :disabled="coins < (p.price || 10)"
                @click="$emit('buy-item', p)">
          Buy
        </button>
      </div>

      

    </div>
  </div>
</div>
  </main>
  `
});
