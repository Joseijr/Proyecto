// LoginHeader Component - simplified header without logo for login page
app.component('login-header', {
    props: {
        t: { type: Object, required: true },
        ancho: { type: Number, required: true },
        menu: { type: Boolean, required: true }
    },
    emits: ['toggle-menu'],
    methods: {
        toggleMenu() {
            this.$emit('toggle-menu');
        }
    },
    template: /*html*/`
    <header class="primary-bg">
        <nav class="text-l bold" v-if="ancho >= 780">
            <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>
            <a class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
            <a class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
            <a class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>
            <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
        </nav>
        <button v-if="ancho <= 779" @click="toggleMenu" class="menu-toggle">☰</button>
        <div v-if="menu" class="hamMenu primary-bg">
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
