// LoginHeader Component - simplified header without logo for login page
app.component('login-header', {
  props: ['t','ancho','menu','lang'],
  
  template: /*html*/`
    <header class="primary-bg">
      <div class="display-flex language-selector">
        <button @click="$emit('change-language','en')" :class="{active: lang==='en'}">EN</button>
        <button @click="$emit('change-language','es')" :class="{active: lang==='es'}">ES</button>
        <button @click="$emit('change-language','jp')" :class="{active: lang==='jp'}">JP</button>
      </div>

      <nav class="text-l bold" v-if="ancho >= 780">
        <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>
        <a class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
        <a class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
        <a class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>
        <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
      </nav>

      <button v-if="ancho <= 779" @click="$emit('toggle-menu')" class="menu-toggle">☰</button>

      <div v-if="menu" class="hamMenu primary-bg">
        <button @click="$emit('toggle-menu')" class="menu-toggle">✕</button>
        <nav class="text-l bold">
          <a class="white-color secondary-hover" href="index.html">{{t.nav?.home}}</a>
          <a class="white-color secondary-hover" href="game.html">{{t.nav?.game}}</a>
          <a class="white-color secondary-hover" href="login.html">{{t.nav?.login}}</a>
          <a class="white-color secondary-hover" href="signin.html">{{t.nav?.signin}}</a>
          <a class="white-color secondary-hover" href="contact.html">{{t.nav?.contact}}</a>
        </nav>
        <div class="display-flex language-selector my-m">
          <button @click="$emit('change-language','en')" :class="{active: lang==='en'}">EN</button>
          <button @click="$emit('change-language','es')" :class="{active: lang==='es'}">ES</button>
          <button @click="$emit('change-language','jp')" :class="{active: lang==='jp'}">JP</button>
        </div>
      </div>
    </header>
  `
});
