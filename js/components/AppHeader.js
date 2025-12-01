app.component('app-header', {
    props: {
        t: { type: Object, required: true },
        lang: { type: String, required: true },
        ancho: { type: Number, required: true },
        menu: { type: Boolean, required: true },
        bgColor: { type: String, default: 'primary-bg' }
    },
    data() {
        return {
            user: null,
            loading: false,
            error: null
        };
    },

    methods: {
        changeLanguage(newLang) {
            this.$emit('change-language', newLang);
        },

        toggleMenu() {
            this.$emit('toggle-menu');
        },

        async handleLogout() {
            const server = "http://backend.test";

            try {
                await fetch(server + "/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                        "Accept": "application/json"
                    }
                });
            } catch (err) { }

            localStorage.removeItem("token");
            window.location.href = "login.html";
        },

        getUser() {
            this.loading = true;
            this.error = null;
            const server = 'http://backend.test';
            const token = localStorage.getItem('token');

            fetch(server + '/api/user', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('No autorizado');
                    return res.json();
                })
                .then(data => {
                    if (data.success) this.user = data.user;
                    else this.error = 'Usuario no logeado';
                    this.loading = false;
                })
                .catch(err => {
                    this.error = err.message;
                    this.loading = false;
                });
        }
    },

    created() {
        this.getUser();
    },

    template: /*html*/`
    <header :class="bgColor">
        <div class="logo white-color text-xl">
            <img src="assets/Logo.png" alt="Mushroom's Garden Logo">

            <div class="language-selector display-flex">
                <button @click="changeLanguage('en')" :class="{ 'active': lang === 'en' }">EN</button>
                <button @click="changeLanguage('es')" :class="{ 'active': lang === 'es' }">ES</button>
                <button @click="changeLanguage('jp')" :class="{ 'active': lang === 'jp' }">JP</button>
            </div>

            <p v-if="user" class="white-color">Hola, {{ user.name }}</p>
        </div>

        <nav class="text-l bold" v-if="ancho >= 780">
    <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>

    <!-- Mostrar solo si el usuario está logeado -->
    <a v-if="user" class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
    <a v-if="user" class="white-color secondary-hover" @click="handleLogout">Logout</a>

    <!-- Mostrar solo si el usuario NO está logeado -->
    <a v-if="!user" class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
    <a v-if="!user" class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>

    <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
</nav>


        <button v-if="ancho <= 779" @click="toggleMenu" class="menu-toggle">
            ☰
        </button>

        <div v-if="menu" class="hamMenu primary-bg">
            <button @click="toggleMenu" class="menu-toggle">☰</button>
            <nav class="text-l bold">
                <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>
                <a class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
                <a class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
                <a class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>
                <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
            </nav>
        </div>
    </header>
    `
});
