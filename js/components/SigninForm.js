app.component('signin-form', {
    props: {
        t: { type: Object, required: true }
    },

    data() {
        return {
            username: '',
            email: '',
            password: '',
            loading: false,
            error: null,
            result: null
        };
    },

    methods: {
        handleSignIn() {
            this.loading = true;
            this.error = null;
            this.result = null;

            const server = "http://backend.test";

            // Agregar @gmail.com automáticamente si no lo tiene
            if (!this.email.includes("@")) {
                this.email = this.email + "@gmail.com";
            }

            fetch(server + "/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        this.error = data.message;
                    } else {
                        this.result = data.message;
                        window.location.href = "login.html";
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
    <section class="input-display">
        <h1 class="white-color text-king my-xl">{{ t.signin?.title }}</h1>

        <!-- USERNAME -->
        <input
            v-model="username"
            class="m-xxl text-xl yellow-border white-color user-icon"
            type="text"
            :placeholder="t.signin?.username || 'Nombre'"
        >

        <!-- EMAIL -->
        <input
            v-model="email"
            class="m-xxl text-xl yellow-border white-color email-icon"
            type="text"
            :placeholder="t.signin?.email || 'Email'"
        >

        <!-- PASSWORD -->
        <input
            v-model="password"
            class="m-xxl text-xl yellow-border white-color password-icon"
            type="password"
            :placeholder="t.signin?.password || 'Password'"
        >

        <!-- ERROR MESSAGE -->
        <p class="white-color text-xl" v-if="error">{{ error }}</p>

        <!-- SUCCESS MESSAGE -->
        <p class="white-color text-xl" v-if="result">{{ result }}</p>

        <p class="white-color text-xl">
            {{ t.signin?.have_account }}
            <span onclick="window.location.href='login.html'" class="extra-color underline link cursor">
                {{ t.signin?.login_link }}
            </span>
        </p>

        <div class="btn-account text-xl yellow-bg white-color my-xxl"
            @click="handleSignIn">
            {{ loading ? '...' : t.signin?.button }}
        </div>
    </section>
    `
});