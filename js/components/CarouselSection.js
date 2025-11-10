// CarouselSection Component - image carousel with fullscreen modal
app.component('carousel-section', {
    props: {
        variants: { type: Array, required: true },
        i: { type: Number, required: true },
        show: { type: Boolean, required: true },
        ancho: { type: Number, required: true }
    },

    methods: {
        prev() { this.$emit('prev-image'); },
        next() { this.$emit('next-image'); },
        showImg() { this.$emit('show-image'); },
        hideImg() { this.$emit('hide-image'); }
    },
    template: /*html*/`
    <section class="extra-bg">
        <div class="carousel">
            <div class="carousel-container">
                <button @click="prev" class="btn-arrows" v-if="ancho >= 779">
                    <img src="assets/Arrow left.svg" alt="Anterior">
                </button>
                <div class="carrousel">
                    <img class="img" @click="showImg" :src="variants[i].image" alt="variant image">
                </div>
                <button @click="next" class="btn-arrows" v-if="ancho >= 779">
                    <img src="assets/Arrow right.svg" alt="Siguiente">
                </button>
            </div>
            <div v-if="show" class="full-image" @click="hideImg">
                <div class="full-content img">
                    <img :src="variants[i].image" alt="variant image">
                </div>
            </div>
            <div v-if="ancho <= 779" class="display-flex">
                <button @click="prev" class="btn-arrows">
                    <img src="assets/Arrow left.svg" alt="Anterior">
                </button>
                <button @click="next" class="btn-arrows">
                    <img src="assets/Arrow right.svg" alt="Siguiente">
                </button>
            </div>
        </div>
    </section>
    `
});
