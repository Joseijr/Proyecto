// LoginForm Component - login form with username, password, and submit
app.component('login-form', {
    props: {
        t: { type: Object, required: true }
    },
    
    methods: {
        handleLogin() {
            this.$emit('login-submit');
        } //escucha el metodo main login btn
    },
    template: /*html*/`
    <main>
        <section class="input-display login-back">
            <h1 class="white-color text-king my-xl">{{ t.login?.title }}</h1>

            <input class="m-xxl text-xl secondary-border white-color user-icon" type="text"
                :placeholder="t.login?.username || 'UserName'">

            <input class="m-xxl text-xl secondary-border white-color email-icon" type="password"
                :placeholder="t.login?.password || 'Password'">

            <p class="white-color text-xl">
                {{ t.login?.no_account}} <span onclick="window.location.href='signin.html'"
                    class="extra-color underline link cursor">
                    {{t.login?.signin_link}}
                </span>
            </p>

            <div class="btn-account text-xl primary-bg white-color my-super" @click="handleLogin">
                {{ t.login?.button}}
            </div>
        </section>
    </main>
    `
});
