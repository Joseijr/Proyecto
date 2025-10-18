const app = Vue.createApp({


    data() {
        return {

            image: "../assets/Illustrationproyecto1.jpg",
            variants: [
                { id: 1, image: "../assets/Illustrationproyecto1.jpg" },
                { id: 2, image: "../assets/Illustrationproyecto2.jpg" },
                { id: 3, image: "../assets/Illustrationproyecto3.jpg" },
            ]
        };
    },

    methods: {
        showImage(variant) {
            this.selectedImage = variant.image;
            console.log(variant.id);


        },

    }
});