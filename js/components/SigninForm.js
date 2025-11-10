// SigninForm Component - registration form with username, email, password
app.component('signin-form', {
    props: {
        t: { type: Object, required: true }
    },

    methods: {
        handleSignin() {
            this.$emit('signin-submit');
        }
    },
    template: /*html*/`
    <section class="input-display">
        <h1 class="white-color text-king my-xl">{{ t.signin?.title}}</h1>
        
        <input class="m-xxl text-xl yellow-border white-color user-icon" type="text"
            :placeholder="t.signin?.username || 'UserName'">
        
        <input class="m-xxl text-xl yellow-border white-color email-icon" type="text"
            :placeholder="t.signin?.email || 'Email'">
        
        <input class="m-xxl text-xl yellow-border white-color password-icon" type="password"
            :placeholder="t.signin?.password || 'Password'">

        <p class="white-color text-xl">
            {{ t.signin?.have_account}} <span onclick="window.location.href='login.html'"
                class="yellow-color underline link cursor">{{ t.signin?.login_link}}</span>
        </p>

        <div class="btn-account text-xl yellow-bg white-color my-xxl" @click="handleSignin">
            {{ t.signin?.button}}
        </div>
    </section>
    `
});
