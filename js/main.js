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
            shovelMode: false,          // Modo pala: si está activo, los clics quitan cultivos
            plotCost: 5, // Costo de comprar una parcela
            seedsInventory: [],
            fertilizer: 0,

            selectedSeed: null,
            selectedWater: false,

            plotsLeft: Array(4).fill(false),   // false = no comprada, true = comprada
            plotsRight: Array(4).fill(false),
            deniedLeft: Array(4).fill(false),  // para animación de shake
            deniedRight: Array(4).fill(false),
            cropsLeft: Array(4).fill(null),    // null = vacía, objeto = cultivada
            cropsRight: Array(4).fill(null)
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

        //////////////////////////////////////////////////////////////////////////
        cargarPartida() {
            fetch("http://prueba.test/api/v1/game/data", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then(res => res.json())
                .then(data => {


                    this.seedsInventory = data.items.map(inv => ({
                        id: inv.item.id,
                        name: inv.item.name,
                        image: inv.item.image_url,
                        quantity: inv.quantity,
                        price: inv.item.price
                    }));
                    // Wallet
                    this.coins = data.wallet.balance;
                    // Plots compradas
                    const plotStatuses = data.plots.map(p => Number(p.status));

                    this.plotsLeft = plotStatuses.slice(0, 4);
                    this.plotsRight = plotStatuses.slice(4, 8);

                })
                .catch(err => console.error("Error cargando partida:", err));
        },

        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        checkCropGrowth() {
            const server = 'http://prueba.test';
            const GROWTH_TIME = {
                start: 10000,
                almost: 15000
            };
            console.log("Verificando crecimiento...");
            const now = Date.now();

            const checkAndUpdate = (crop, side, index) => {
                if (!crop || !crop.planted_at) return;

                const plantedAt = new Date(crop.planted_at).getTime();
                const elapsed = now - plantedAt;

                let newPhase = null;

                if (crop.phase === 'start' && elapsed > GROWTH_TIME.start) {
                    newPhase = 'almost';
                } else if (crop.phase === 'almost' && elapsed > GROWTH_TIME.start + GROWTH_TIME.almost) {
                    newPhase = 'done';
                }

                if (newPhase) {
                    fetch(`${server}/api/plots/${crop.id}/phase`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        body: JSON.stringify({ phase: newPhase })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(`Crop ${crop.id} cambiado a fase ${newPhase}`);
                            if (side === 'left') this.cropsLeft[index].phase = newPhase;
                            else this.cropsRight[index].phase = newPhase;
                        });
                }
            };

            this.cropsLeft.forEach((c, i) => checkAndUpdate(c, 'left', i));
            this.cropsRight.forEach((c, i) => checkAndUpdate(c, 'right', i));
        },

        ///////////////////////////////////////////////////////////////////////////
        waterAction() {
            if (this.selectedWater === true) {
                console.log("Acción: Regar");
                this.selectedWater = true;
                document.body.style.cursor = `url(assets/regar.png) 16 16, pointer`;
            }
            else {
                this.clearWaterSelection();
            }
        },

        ///////////////////////////////////////////////////////////////
        clearWaterSelection() {
            this.selectedWater = false;
            document.body.style.cursor = ''; // cambia al cursor normalito
        },

        //////////////////////////////////////////////////////////////
        // Método para abrir/cerrar inventario
        inventoryAction() {
            this.inventoryOpen = !this.inventoryOpen;
            //console.log('Inventario toggle:', this.inventoryOpen); // DEBUG
        },

        ///////////////////////////////////////////////////////////
        // Método para abrir/cerrar el libro
        toggleBook() {
            this.showBook = !this.showBook;
        },

        ///////////////////////////////////////////////////////////
        //cosas del fertilizante
        fertilizeAction() {
            if (this.fertilizer.quantity > 0) {
                this.fertilizer.quantity -= 1;
            }
        },

        ///////////////////////////////////////////////////////
        buyFertilizer() {
            if (this.coins >= 5) {
                this.coins -= 3;
                this.fertilizer.quantity += 3;
            } else {
                console.warn("No tienes suficientes monedas para comprar fertilizante.");
            }
        },

        ///////////////////////////////
        cursorSelected(seed) {
            console.log("Seed seleccionada:", seed);

            // buscar la semilla REAL del inventario
            const realSeed = this.seedsInventory.find(s => s.id === seed.id);

            this.selectedSeed = realSeed ? realSeed : null;

            console.log("Seed usada realmente:", this.selectedSeed);
        },

        ////////////////////////////////////////////////////////////////////////////////
        //cosas con las semillas
        // Comprar semilla: busca por ID y suma 1 unidad
        async buySeed(id) {
            const seed = this.seedsInventory.find(s => s.id === id);
            if (!seed) return;
            const price = seed.price;  // ← precio real desde el inventario
            if (this.coins < price) return;
            seed.quantity += 1;
            this.coins -= price;
            try {
                const res = await fetch(`http://prueba.test/api/plants/${id}/${price}/sumar`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                seed.quantity = data.quantity;
                this.coins = data.wallet_balance;
            } catch {
                seed.quantity -= 1;
                this.coins += price;
            }
        },

        ///////////////////////////////////////////////////////////////////////////
        // Usar semilla desde inventario: recibe SOLO el id y consume 1 unidad
        async useSeed(id) {
            const seed = this.seedsInventory.find(s => s.id === id);
            if (!seed || seed.quantity <= 0) {
                console.warn("NO TIENES SEMILLAS DISPONIBLES", seed);
                return false;
            }
            seed.quantity -= 1;
            try {
                const res = await fetch(`http://prueba.test/api/plants/${id}/restar`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                seed.quantity = data.quantity;
            } catch {
                seed.quantity += 1;
                return false;
            }
            return true;
        },

        /////////////////////////////////////////////////////////////////////////////
        async plantSeed(side, index, seed) {
            try {
                const res = await fetch("http://prueba.test/api/plots/plant", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        side,
                        plot_index: index,
                        seed_id: seed.id
                    })
                });

                console.log("plantSeed - usar semilla id:", this.selectedSeed ? this.selectedSeed.id : null);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al plantar");

                // Activa visualmente el cultivo
                const crops = side === "left" ? this.cropsLeft : this.cropsRight;

                crops[index] = {
                    id: seed.id,
                    seed_id: seed.id,
                    name: seed.name,
                    image: seed.image,
                    phase: "start",  // fase inicial del cultivo
                    planted_at: Date.now()
                };

                // Limpia la selección
                this.selectedSeed = null;
                document.body.style.cursor = "";

                return true;
            } catch (err) {
                console.error("Error al plantar:", err);
                return false;
            }
        },

        /////////////////////////////////////////////////
        handlePlotClick(side, index) {
            const plotList = side === "left" ? this.plotsLeft : this.plotsRight;
            const deniedList = side === "left" ? this.deniedLeft : this.deniedRight;
            const crops = side === "left" ? this.cropsLeft : this.cropsRight;

            // 1. Parcela NO activada → intentar comprar
            if (!plotList[index]) {
                if (this.coins < this.plotCost) {
                    deniedList[index] = true;
                    setTimeout(() => deniedList[index] = false, 400);
                    return;
                }
                this.buyPlot(side, index, this.plotCost);
                return;
            }

            // 2. Ya hay cultivo → ignorar
            if (crops[index]) return;

            // 3. No hay semilla seleccionada
            if (!this.selectedSeed) {
                deniedList[index] = true;
                setTimeout(() => deniedList[index] = false, 400);
                return;
            }

            // 4. Plantar
            this.useSeed(this.selectedSeed.id).then(success => {
                if (success) {
                    this.plantSeed(side, index, this.selectedSeed);
                }
            });
        },

        ///////////////////////////////////////////////////////////////////////////////
        // Botón de la pala: alterna el modo "desplantar"
        // - Activa: limpia selección de semilla y cambia cursor a la pala
        // - Desactiva: restaura el cursor normal
        plantAction() {
            this.shovelMode = !this.shovelMode;
            if (this.shovelMode) {
                this.clearSeedSelection();
                document.body.style.cursor = 'url(assets/shovel.png) 16 16, pointer';
            } else {
                document.body.style.cursor = '';
            }
        },

        ////////////////////////////////////////////////////////////////////
        // Quitar cultivo de una parcela (desplantar)
        // No devuelve semillas ni monedas; solo limpia la parcela
        removeCrop(side, index) {
            const crops = side === 'left' ? this.cropsLeft : this.cropsRight;
            if (!crops[index]) return; // nada que quitar
            crops[index] = null;       // parcela queda vacía
        },

        //////////////////////////////////////////////////////////////////////////
        async buyPlot(side, index) {
            const price = this.plotCost;
            if (this.coins < this.plotCost) {
                const denied = side === 'left' ? this.deniedLeft : this.deniedRight;
                denied[index] = true;
                setTimeout(() => (denied[index] = false), 350);
                return;
            }
            try {
                const res = await fetch("http://prueba.test/api/plots/buy", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({ side, index, price })
                });
                if (!res.ok) throw new Error("Error al comprar parcela");
                const data = await res.json();
                const plots = side === 'left' ? this.plotsLeft : this.plotsRight;
                plots[index] = true;
                this.coins = data.wallet_balance;
                console.log("Parcela comprada:", data);
                await this.cargarPartida();
            } catch (err) {
                console.error("Error comprando parcela:", err);
            }
        },
    },

    ///////////////////////////////////////////////////////////////////
    mounted() {
        window.addEventListener("resize", () => {
            this.ancho = window.innerWidth;
        });
    },
    //Cuando se crar el documento carga el idioa
    created() {
        const savedLang = localStorage.getItem('mushroom-language');
        this.loadLanguage(savedLang || this.lang);
        this.cargarPartida();
    }
});