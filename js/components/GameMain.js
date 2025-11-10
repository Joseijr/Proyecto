// GameMain Component - farm image with sidebar actions/inventory
app.component('game-main', {
    props: {
        // Puede recibir props en el futuro para estado del juego
    },
    emits: ['plant-action', 'water-action', 'inventory-action'],
    methods: {
        handlePlant() {
            this.$emit('plant-action');
        },
        handleWater() {
            this.$emit('water-action');
        },
        handleInventory() {
            this.$emit('inventory-action');
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
                    <button class="action-btn" title="Inventario" @click="handleInventory">
                        <img src="assets/bolsabase.png" alt="Inventario" class="action-icon-img">
                    </button>
                </div>
            </aside>
        </section>
    </main>
    `
});
