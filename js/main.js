const app = Vue.createApp({
    data() {
        return {
            image: "../assets/Illustrationproyecto1.jpg",
            variants: [
                { id: 1, image: "../assets/Illustrationproyecto1.jpg" },
                { id: 2, image: "../assets/Illustrationproyecto2.jpg" },
                { id: 3, image: "../assets/Illustrationproyecto3.jpg" }
            ],


            t: {},
            lang: "en"
        };
    },

    methods: {
        //carca el idioma
        loadLanguage(lang) {
            //ruta del json "Carpeta lang +Idioma ingles por defecto+.json"
            fetch("../lang/" + lang + ".json")
                //convierte el texto de json en un objeto
                .then(response => response.json())
                //cuando lo obtiene lo mete en variable "t"
                .then(data => {
                    this.t = data;
                    this.lang = lang;
                    localStorage.setItem('mushroom-language', lang);
                })
        },
        //actualiza el idioma
        changeLanguage(lang) {
            this.loadLanguage(lang);
        }
    },
    //Cuando se crar el documento carga el idioa
    created() {
        const savedLang = localStorage.getItem('mushroom-language');
        this.loadLanguage(savedLang || this.lang);
    }
});

app.mount("#app");
