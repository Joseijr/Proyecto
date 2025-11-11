// GameMain Component - farm image with sidebar actions/inventory
app.component('game-main', {
    props: {
        inventoryOpen: { type: Boolean, required: true },
        seeds: { type: Array, required: true }
    },
    data() {
      return {
        showCodex: false //define que la interfaz de libro esta cerrada cuanod se inicia  y asi se muestra con el v if
      };
    },
    methods: {
        handlePlant() {
            this.$emit('plant-action');
        },
        handleWater() {
            this.$emit('water-action');
        },
        handleInventory() {
            this.$emit('inventory-action');
        },
        handleFertilize() {
            this.$emit('fertilize-action');
        },
        toggleCodex() {
          this.showCodex = !this.showCodex; //hace el libro visible o insiblee
        }
    },
    template: /*html*/`
    <main class="main-content">
        <section class="image-container">
            <img src="assets/bg-granja.png" alt="">
            
            <!-- Panel lateral de inventario/acciones -->
            <aside class="game-sidebar">
                <div class="game-actions">
                    <button class="action-btn" title="Plantar" @click="handlePlant">
                        <img src="assets/shovel.png" alt="Plantar" class="action-icon-img">
                    </button>
                    <button class="action-btn" title="Regar" @click="handleWater">
                        <img src="assets/regar.png" alt="Regar" class="action-icon-img">
                    </button>

                    <button class="action-btn" title="Fertilizar" @click="handleFertilize">
                        <img src="assets/bolsaAbono.png" alt="Fertilizar" class="action-icon-img">
                    </button>

                    <button class="action-btn" title="Inventario" @click="handleInventory" :class="{ 'active': inventoryOpen }">
                        <img src="assets/bolsabase.png" alt="Inventario" class="action-icon-img">
                    </button>

                    <!-- Botón Libro -->
                    <button class="action-btn" @click="toggleCodex" title="Libro">
                    <img src="assets/libroTemporal.jpg" alt="Libro" class="action-icon-img">
                    </button>

                    <!-- Inventario desplegable -->
                    <div v-if="inventoryOpen" class="inventory-dropdown">
                        <div v-for="seed in seeds" :key="seed.id" class="inventory-item">
                            <img :src="seed.image" :alt="seed.name" class="seed-icon">
                            <span class="seed-quantity">{{ seed.quantity }}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </section>

        <!-- Modal/Panel del Libro -->
        <div v-if="showCodex" class="book-modal" @click.self="toggleCodex">
          <div class="book-box">
            <header class="book-box-header">
              <h3 class="white-color">Libro</h3>
              <button class="close-btn" @click="toggleCodex" aria-label="Cerrar">✕</button>
            </header>
            <div class="book-box-body">
              <p class="white-color opacity-70">Aquí irá tu plantilla.</p>
            </div>
          </div>
        </div>
    </main>
    `
});
