// Header Component - logo, language selector, nav menu
app.component('app-header', {
    props: {
        t: { type: Object, required: true },
        lang: { type: String, required: true },
        ancho: { type: Number, required: true },
        menu: { type: Boolean, required: true }
    },
    
    methods: {
        changeLanguage(newLang) {
            this.$emit('change-language', newLang);
        },
        toggleMenu() {
            this.$emit('toggle-menu');
        }
    },
    template: /*html*/`
    <header class="primary-bg">
        <div class="logo white-color text-xl">
            <img src="assets/Logo.png" alt="Mushroom's Garden Logo">
            <div class="language-selector display-flex">
                <button @click="changeLanguage('en')" :class="{ 'active': lang === 'en' }">EN</button>
                <button @click="changeLanguage('es')" :class="{ 'active': lang === 'es' }">ES</button>
                <button @click="changeLanguage('jp')" :class="{ 'active': lang === 'jp' }">JP</button>
            </div>
        </div>

        <nav class="text-l bold" v-if="ancho >= 780">
            <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>
            <a class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
            <a class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
            <a class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>
            <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
        </nav>

        <button v-if="ancho <= 779" @click="toggleMenu" class="menu-toggle" id="menu-toggle">
            ☰
        </button>

        <div v-if="menu===true" class="hamMenu primary-bg">
            <button @click="toggleMenu" class="menu-toggle" id="menu-toggle">
                ☰
            </button>
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
