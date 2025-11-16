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

            // Game inventory state
            showBook: false,
            inventoryOpen: false,
            plotCost: 5, // Costo de comprar una parcela
            seedsInventory: [
                { id: 'albaca', name: 'Albaca', image: 'assets/albacaSeeds.png', quantity: 1 },
                { id: 'mandragora', name: 'Mandragora', image: 'assets/mandragoraSeed.png', quantity: 5 }
            ],
            fertilizer: { 
                id: 'fertilizer_basic', 
                name: 'Fertilizer', 
                image: 'assets/bolsaAbono.png', 
                price: 3,
                quantity: 0 
            },
            coins: 15,
            
            selectedSeed: null,


            plotsLeft: Array(12).fill(false),   // false = no comprada, true = comprada
            plotsRight: Array(12).fill(false),
            deniedLeft: Array(12).fill(false),  // para animación de shake
            deniedRight: Array(12).fill(false),
            cropsLeft: Array(12).fill(null),    // null = vacía, objeto = cultivada
            cropsRight: Array(12).fill(null)
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

        //métodos para los botones del juego
        plantAction() {
            console.log("Acción: editar parcela");
            if (this.selectedSeed) {
                this.useSeed(this.selectedSeed.id); // ← pasar solo id
                this.clearSeedSelection();
            }
        },

        waterAction() {
            console.log("Acción: Regar");
        },

        // Método para abrir/cerrar inventario
        inventoryAction() {
            this.inventoryOpen = !this.inventoryOpen;
            //console.log('Inventario toggle:', this.inventoryOpen); // DEBUG
        },
        
        // Método para abrir/cerrar el libro
        toggleBook() {
            this.showBook = !this.showBook;
        },
        
        //cosas del fertilizante
        fertilizeAction() {
            if (this.fertilizer.quantity > 0) {
                this.fertilizer.quantity -= 1;
            }
        },
        
        buyFertilizer() {
            if (this.coins >= 5) { 
                this.coins -= 3;
                this.fertilizer.quantity += 3;
                } else{
                    console.warn("No tienes suficientes monedas para comprar fertilizante.");
                }
        
        },

        //cosas con las semillas
        
        // Comprar semilla: busca por ID y suma 1 unidad
        buySeed(id) {
            const seed = this.seedsInventory.find(seedItem => seedItem.id === id);
            if (seed) seed.quantity += 1;
        },
        
        // Usar semilla desde inventario: recibe SOLO el id y consume 1 unidad
        useSeed(id) {
            if (!id) return false;
            const seedInInventory = this.seedsInventory.find(s => s.id === id);
            if (!seedInInventory || seedInInventory.quantity <= 0) return false;
            seedInInventory.quantity -= 1;
            return true;
        },

        //cambio del mouse conlas semillas

        selectSeed(seed) {
            // Si ya está seleccionada la misma semilla, deseleccionar
            if (this.selectedSeed && this.selectedSeed.id === seed.id) {
                this.clearSeedSelection();
                return;
            }
            
            // Si no, seleccionar la nueva semilla
            this.selectedSeed = seed;
            // Cambia el cursor al PNG de la semilla (hotspot centrado aproximado)
            document.body.style.cursor = `url(${seed.image}) 16 16, pointer`;
            //url(${seed.image}) es lo mismo que decir "url(" + seed.image + ") 16 16, pointer"
        },

        clearSeedSelection() {
            this.selectedSeed = null;
            document.body.style.cursor = ''; // cambia al cursor normalito
        },

        plantSeed(side, index) {
            const crops = side === 'left' ? this.cropsLeft : this.cropsRight;

            if (!this.selectedSeed) {
                console.log("Selecciona una semilla del inventario primero");
                return;
            }

            // Consumir 1 semilla usando SOLO el id
            if (!this.useSeed(this.selectedSeed.id)) {
                console.log("No tienes semillas de este tipo");
                return;
            }

            crops[index] = {
                seedId: this.selectedSeed.id,
                seedName: this.selectedSeed.name,
                phase: 'start',
                plantedAt: Date.now()
            };

            this.clearSeedSelection();
        },

        //metodo que te gasta las monedas del inventario cuando las usas
        spendCoins(amount) {
            if (this.coins >= amount) this.coins -= amount; // evita negativos
        },

        handlePlotClick(side, index) {
            const plots = side === 'left' ? this.plotsLeft : this.plotsRight;
            const crops = side === 'left' ? this.cropsLeft : this.cropsRight;

            // Si la parcela no está comprada, intentar comprarla
            if (!plots[index]) {
                this.buyPlot(side, index);
                return;
            }

            // Si la parcela está comprada pero vacía, y hay semilla seleccionada intenta plantar
            if (plots[index] && !crops[index] && this.selectedSeed) {
                this.plantSeed(side, index);
                return;
            }

            // Si ya hay un cultivo, mostrar info o permitir cosechar
            if (crops[index]) {
                console.log('Ya hay un cultivo aquí:', crops[index]);
            }
        },

        buyPlot(side, index) {
            const plots = side === 'left' ? this.plotsLeft : this.plotsRight;
            const denied = side === 'left' ? this.deniedLeft : this.deniedRight;

            if (this.coins >= this.plotCost) {
                plots[index] = true;
                this.coins -= this.plotCost;
            } else {
                // Activar animación de shake
                denied[index] = true;
                setTimeout(() => (denied[index] = false), 350);
            }
        }



    },

    mounted() { 
        window.addEventListener("resize", () => {
            this.ancho = window.innerWidth;
        });

        //este era para que cuando le das a escape se deseleccionara la semilla pero yano se usa pq no me gusto jiji
        // window.addEventListener('keydown', e => {
        //     if (e.key === 'Escape') this.clearSeedSelection();
        // });
    },
    //Cuando se crar el documento carga el idioa
    created() {
        const savedLang = localStorage.getItem('mushroom-language');
        this.loadLanguage(savedLang || this.lang);
    }



});


