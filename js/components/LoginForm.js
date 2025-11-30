// LoginForm Component - login form with email, password, and submit
app.component('login-form', {
    props: {
        t: { type: Object, required: true }
    },

    data() {
        return {
            email: "",
            password: "",
            loading: false,
            error: null,
            result: null

        };
    },

    methods: {
        handleLogin() {
            this.loading = true;
            this.error = null;
            this.result = null;

            const server = "http://prueba.test";

            // Auto agregar @gmail.com
            if (!this.email.includes("@")) {
                this.email = this.email + "@gmail.com";
            }

            fetch(server + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        this.error = data.message; // mensaje del backend
                    } else {
                        this.result = data.message;
                        this.$emit('login-submit', data); // notificar a main si ocupas
                    }
                    this.loading = false;
                })
                .catch(err => {
                    this.error = err.message;
                    this.loading = false;
                });
        }
    },

    template: /*html*/`
    <main>
        <section class="input-display login-back">
            <h1 class="white-color text-king my-xl">{{ t.login?.title }}</h1>

            <!-- EMAIL -->
            <input 
                v-model="email"
                class="m-xxl text-xl secondary-border white-color email-icon"
                type="text"
                :placeholder="t.login?.username || 'Email'"
            >

            <!-- PASSWORD -->
            <input 
                v-model="password"
                class="m-xxl text-xl secondary-border white-color password-icon"
                type="password"
                :placeholder="t.login?.password || 'Password'"
            >

            <!-- ERROR MESSAGE -->
            <p class="white-color text-xl" v-if="error">{{ error }}</p>

            <!-- SUCCESS -->
            <p class="white-color text-xl" v-if="result"> {{ result }}</p>

            <p class="white-color text-xl">
                {{ t.login?.no_account }} 
                <span onclick="window.location.href='signin.html'"
                    class="extra-color underline link cursor">
                    {{ t.login?.signin_link }}
                </span>
            </p>

            <div class="btn-account text-xl primary-bg white-color my-super"
                @click="handleLogin"
            >
                {{ loading ? '...' : t.login?.button }}
            </div>
        </section>
    </main>
    `
});
