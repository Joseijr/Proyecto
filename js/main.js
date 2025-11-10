const app = Vue.createApp({
    data() {
        return {
            show: false,
            i: 0,
            image: "../assets/Illustrationproyecto1.jpg",
            variants: [
                { id: 1, image: "../assets/Illustrationproyecto1.jpg" },
                { id: 2, image: "../assets/Illustrationproyecto2.jpg" },
                { id: 3, image: "../assets/Illustrationproyecto3.jpg" },
                { id: 3, image: "../assets/bg-granja.png" }
            ],


            t: {},
            lang: "en",
            menu: false,

            //Obtiene el tamaño de la pantalla
            ancho: window.innerWidth,
        };
    },


    computed: {
        // Computed property para obtener la imagen actual
        currentImage() {
            return this.variants[this.i].image;
        }
    },

    methods: {
        //carga el idioma
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
        },

        // Método para imagen siguiente
        nextImage() {
            if (this.i < this.variants.length - 1) {
                this.i++;
            } else {
                this.i = 0;
            }
        },

        // Método para imagen anterior
        prevImage() {
            if (this.i > 0) {
                this.i--;
            } else {
                this.i = this.variants.length - 1;
            }
        },
        hideImage() {
            this.show = false;
        },

        showImage() {
            this.show = true;
        },
        //respuesta de botones 
        logInBtn() {
            console.log("boton de iniciar sesion o login");
        },

        SignInBtn() {
            console.log("boton de registrarse o sign in");
        },

        showHam() {
            if (this.menu == false) {
                this.menu = true;
            } else {
                this.menu = false;
            }

        },

        // Game actions - métodos para los botones del juego
        plantAction() {
            console.log("Acción: editar parcela");
        },

        waterAction() {
            console.log("Acción: Regar");
        },

        inventoryAction() {
            console.log("Acción: Abrir inventario");
        },


    },

    mounted() { // Hace cambios cada que se actualiza el DOM
        window.addEventListener("resize", () => {
            this.ancho = window.innerWidth;
        });
    },
    //Cuando se crar el documento carga el idioa
    created() {
        const savedLang = localStorage.getItem('mushroom-language');
        this.loadLanguage(savedLang || this.lang);
    }



});


