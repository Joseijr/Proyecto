app.component('game-main', {
  data() {
    return {

      loading: false,
      error: null,
      items: [],
      wallet: null,
      plants: []
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

      fetch(server + '/api/v1/garden/plants')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          this.plants = data;
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },
    getInventory() {
      this.loading = true;
      this.error = null;
      const server = 'http://prueba.test';

      fetch(server + '/api/v1/game/data')
        .then(response => {
          if (!response.ok) throw new Error('Network error');
          return response.json();
        })
        .then(data => {
          this.items = data.items;   // Inventario del usuario
          this.wallet = data.wallet; // Monedas del usuario
          this.plants = data.plants; // Plantas disponibles
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },
    //Metodos para sumar y restar
    //De momento solo actualiza los datos de usuario 11
    //osea el primer usuario que se registra luego de las migraciones y seaders 
    async sumar(id, price) {
      const server = 'http://prueba.test';

      try {
        const response = await fetch(`${server}/api/plants/${id}/${price}/sumar`, {
          method: "PUT"
        });

        if (!response.ok) throw new Error('Error al sumar el dato');

        const data = await response.json();

        // Buscamos la planta correspondiente en el front
        const plant = this.plants.find(p => p.id === id);

        // Actualizamos visualmente la cantidad con la que devuelve el back
        if (plant) plant.value = data.quantity;

        // Actualiza balance del wallet
        if (this.wallet && data.wallet_balance !== undefined) {
          this.wallet.balance = data.wallet_balance;
        }

      } catch (error) {
        console.error('Error al sumar:', error);
      }
    }

    ,
    async restar(id) {
      const server = 'http://prueba.test';

      try {
        const response = await fetch(server + `/api/plants/${id}/restar`, {
          method: "PUT"
        });

        if (!response.ok) throw new Error('Error al restar el dato');
        const data = await response.json();

        const plant = this.plants.find(p => p.id === id);
        if (plant) plant.value = data.quantity;

      } catch (error) {
        console.error('Error al restar:', error);
      }
    },



    handlePlant() { this.$emit('plant-action'); },
    handleWater() { this.$emit('water-action'); },
    handleFertilize() { this.$emit('fertilize-action'); },
    handleInventory() { this.$emit('inventory-action'); },
    handleBuyFertilizer() { this.$emit('buy-fertilizer'); },
    handleSelectSeed(seed) { this.$emit('select-seed', seed); },
    handleToggleBook() { this.$emit('toggle-book'); },
    handlePlotClick(side, index) { this.$emit('plot-click', side, index); },

    getCropImage(crop) {
      if (!crop) return null;
      if (crop.phase === 'start') return 'assets/startgrowing.png';
      if (crop.phase === 'almost') return 'assets/almostgrown.png';
      return null;
    }
  },

  created() {
    this.getPlants();
    this.getInventory();
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
          <span class="tool-quantity">{{ wallet ? wallet.balance : 0 }}</span>


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
  <div v-for="it in items"
      :key="it.id"
      class="inventory-item"
      @click="handleSelectSeed(it)">

    <img :src="it.item.image_url" :alt="it.item.name" class="seed-icon">

    <span class="seed-quantity">{{ it.quantity }}</span>
  </div>
</div>



        </div>
      </aside>

      <!-- espacios de cultivoos-->
      <div class="plots-grid plots-left">
        <div v-for="(activated, i) in plotsLeft" :key="'L'+i"
            class="plot-cell"
            :class="{ 'plot-active': activated,
            'plot-denied': deniedLeft[i],
            'plot-planted': cropsLeft[i] }"
            @click="handlePlotClick('left', i)">
          <img v-if="cropsLeft[i]" :src="getCropImage(cropsLeft[i])" class="crop-image" alt="Cultivo">
        </div>
      </div>

      <div class="plots-grid plots-right">
        <div v-for="(activated, i) in plotsRight" :key="'R'+i"
            class="plot-cell"
            :class="{ 'plot-active': activated,
            'plot-denied': deniedRight[i],
            'plot-planted': cropsRight[i] }"
            @click="handlePlotClick('right', i)">
          <img v-if="cropsRight[i]" :src="getCropImage(cropsRight[i])" class="crop-image" alt="Cultivo">
        </div>
      </div>

    </section>

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
       <p class="white-color">Price: {{ p.price }} coins</p>


        <button class="market-buy-btn"
                :disabled="wallet.balance < (p.price || 10)"
                @click="sumar(p.id, p.price)">
          Buy
        </button>


         <!-- Botoncito que resta -->
          <button class="market-buy-btn" @click="restar(p.id)">
            -1
          </button>

      </div>

    </div>
  </div>

</div>

  </main>


  <footer class="green-bg">
    <p class="white-color mt-m">Mushroom's Garden - All rights reserved</p>
  </footer>
  `
});
