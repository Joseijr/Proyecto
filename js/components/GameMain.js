app.component('game-main', {
  data() {
    return {
      loading: false,
      error: null,
      wallet: null,
      missions: [],
      plots: [],
      activeTab: '1'
    };
  },

  props: {
    inventoryOpen: { type: Boolean, required: true },
    fertilizer: { type: Object, required: true },
    coins: { type: Number, required: true },
    selectedSeed: { type: Object, default: null },
    showBook: { type: Boolean, required: true },
    plotsLeft: { type: Array, required: true },
    plotsRight: { type: Array, required: true },
    deniedLeft: { type: Array, required: true },
    deniedRight: { type: Array, required: true },
    cropsLeft: { type: Array, required: true },
    cropsRight: { type: Array, required: true },

  },

  methods: {

    getInventory() {
      this.loading = true;
      this.error = null;
      const server = 'http://prueba.test';


      fetch(server + '/api/v1/game/data', {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(data => {
          this.items = data.items;   // inventario del usuario
          this.wallet = data.wallet; // monedas del usuario
          this.plots = data.plots;   // parcelas del usuario
          this.loading = false;
        })
        .catch(err => {
          this.error = err.message;
          this.loading = false;
        });

    },

    async sumar(id, price) {
      const server = 'http://prueba.test';
      const item = this.items.find(i => i.id === id);
      if (item) item.quantity += 1;

      try {
        const res = await fetch(`${server}/api/plants/${id}/${price}/sumar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        if (!res.ok) throw new Error("Error al comprar");

        const data = await res.json();

        if (item) item.quantity = data.quantity;
        if (this.wallet?.balance !== undefined) {
          this.wallet.balance = data.wallet_balance;
        }

      } catch (err) {
        console.error(err);
        if (item) item.quantity -= 1;
      }
    },
    async restar(id) {
      const server = 'http://prueba.test/';

      try {
        const res = await fetch(`${server}/api/plants/${id}/restar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        if (!res.ok) throw new Error("Error al restar");

        const data = await res.json();

        const item = this.items.find(i => i.id === id);
        if (item) item.quantity = data.quantity;

      } catch (err) {
        console.error(err);
      }
    },
    async buyPlot(side, index, price) {
      const server = 'http://prueba.test';

      try {
        const res = await fetch(`${server}/api/plots/buy`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({
            side,
            index,
            price
          })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al comprar parcela");

        // Descontar balance en el front
        this.wallet.balance = data.wallet_balance;

        // Activar visualmente la parcela
        if (side === 'left') this.plotsLeft[index] = true;
        else this.plotsRight[index] = true;

      } catch (err) {
        alert("Error: " + err.message);
      }
    },

    async generateMissions() {
      const server = 'http://prueba.test';
      try {
        const res = await fetch(`${server}/api/v1/missions/generate`, {
          method: 'POST',
        });
        const data = await res.json();
        if (data.success) {
          alert('Misiones generadas correctamente');
          this.getMissions(); // recarga las misiones
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Error al generar misiones: ' + err.message);
      }
    },
    getMissions() {
      this.loading = true;
      this.error = null;
      const server = 'http://prueba.test';
      fetch(server + '/api/v1/missions') // Endpoint de tus misiones
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.missions = data;
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },

    handlePlant() { this.$emit('plant-action'); },
    handleWater() { this.$emit('water-action'); },
    handleFertilize() { this.$emit('fertilize-action'); },
    handleInventory() { this.$emit('inventory-action'); },
    handleSelectSeed(seed) { this.$emit('select-seed', seed); },
    handleToggleBook() { this.$emit('toggle-book'); },
    handlePlotClick(side, index) { this.$emit('buy-plot', side, index, this.plotCost); },

    getCropImage(crop) {
      if (!crop) return null;
      if (crop.phase === 'start') return 'assets/startgrowing.png';
      if (crop.phase === 'almost') return 'assets/almostgrown.png';
      return null;
    }
  },

  created() {
    this.getInventory();  // solo llama a inventario
    this.getMissions();

  },

  template: /*html*/`
  <main class="main-content">
    <section class="image-container">
      <img src="assets/bg-granja.png" alt="">
      <aside class="game-sidebar">
        <div class="game-actions">

          <div class="coin-display" title="Monedas">
            <img src="assets/coin.png" alt="Monedas" class="coin-icon-img">
            <span class="tool-quantity">{{ wallet ? wallet.balance : 0 }}</span>
          </div>


          <!--
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
          -->
          <button class="action-btn" @click="handleToggleBook" title="Libro / Mercado">
            <img src="assets/book.png" alt="Libro" class="action-icon-img">
          </button>

          <button class="action-btn" title="Inventario" @click="handleInventory" :class="{ 'active': inventoryOpen }">
            <img src="assets/bolsabase.png" alt="Inventario" class="action-icon-img">
          </button>

          <div v-if="inventoryOpen" class="inventory-dropdown">
            <div v-for="it in items" :key="it.id" class="inventory-item" @click="handleSelectSeed(it)">
              <img :src="it.item.image_url" :alt="it.item.name" class="seed-icon">
              <span class="seed-quantity">{{ it.quantity }}</span>
            </div>
          </div>

        </div>
      </aside>

      <div class="plots-grid plots-left">
        <div v-for="(activated, i) in plotsLeft" :key="'L'+i"
             class="plot-cell"
             :class="{ 'plot-active': activated,
                       'plot-denied': deniedLeft[i],
                       'plot-planted': cropsLeft[i] }"
             @click="$emit('plot-click', 'left', i)">

          <img v-if="cropsLeft[i]" :src="getCropImage(cropsLeft[i])" class="crop-image" alt="Cultivo">
        </div>
      </div>

      <div class="plots-grid plots-right">
        <div v-for="(activated, i) in plotsRight" :key="'R'+i"
             class="plot-cell"
             :class="{ 'plot-active': activated,
                       'plot-denied': deniedRight[i],
                       'plot-planted': cropsRight[i] }"
            @click="$emit('plot-click', 'right', i)">
          <img v-if="cropsRight[i]" :src="getCropImage(cropsRight[i])" class="crop-image" alt="Cultivo">
        </div>
      </div>

    </section>

  <!-- Modal Mercado -->
<div v-if="showBook" class="book-modal" @click.self="handleToggleBook">
  <div class="book-box">
    <header class="book-box-header">
      <h3 class="white-color">Welcome to gardener diaries!</h3>
      <div>
      <button class="tab-button" @click="activeTab = '1'">Tienda</button>
      <button class="tab-button" @click="activeTab = '2'">Misiones</button>
      </div>
      <button class="close-btn" @click="handleToggleBook" aria-label="Cerrar">✕</button>

    </header>

    <div class="book-box-body">


      <!--Modulo de Tienda-->

      <div v-for="it in items"
           :key="'store-' + it.id"
           class="market-item"
           v-if="activeTab === '1'">

        <img :src="it.item.image_url" :alt="it.item.name" class="market-img">
        <h4 class="white-color">{{ it.item.name }}</h4>
        <p class="white-color">{{ it.item.price }} Buttons</p>

        <button class="market-buy-btn"
                :disabled="wallet.balance < (it.item.price || 10)"
                @click="sumar(it.id, it.item.price)">
          Buy
        </button>
      </div>



      <!--Modulo de Misiones-->



      <div v-for="m in missions"
           :key="'mission-' + m.id"
           class="mission-item"
           v-if="activeTab === '2'">

        <p class="extra-color text-xl">{{ m.title }}</p>
        <span class="white-color">{{ m.description }}</span><br>

        <p class="white-color">Recompensa:
          <span class="extra-color">{{ m.reward }}</span> Buttons
        </p>

        <button class="market-buy-btn">Reclamar</button>
        <hr>
      </div>

    </div>
  </div>
</div>



  </main>
  `
});


