app.component('app-footer', {
    props: {
        bgColor: {
            type: String,
            default: '#4e4976ff'
        }
    },

    data() {
        return {
            user: null,
            loading: false,
            error: null
        };
    },

    methods: {
        getUser() {
            this.loading = true;
            this.error = null;
            const server = 'http://prueba.test';
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
        <footer class="app-footer" :class="bgColor">
            <div class="footer-grid">

                <!-- Redes sociales -->
                <div class="footer-section">
                    <h4>Follow Us</h4>
                    <div class="social-list">
                        <div class="social-item">
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png">
                            <a href="https://www.instagram.com/gigivjs?igsh=MWk2eHpjZWtkN2syYQ==">gigisartplace0707@gmail.com</a>
                        </div>
                        <div class="social-item">
                            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png">
                            <a href="https://www.instagram.com/jose_ijr?igsh=MWp0ZmQxamI5MTFlYw==">jjimenezrubi6@gmail.com</a>
                        </div>
                        <div class="social-item">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub">
                            <a href="https://github.com/JjimenaVS">JjimenaVS</a>
                        </div>
                        <div class="social-item">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub">
                            <a href="https://github.com/Joseijr">Joseijr</a>
                        </div>
                    </div>
                </div>

                <!-- Contacto -->
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: support@mushroomsgarden.com</p>
                </div>

                <!-- Extras -->
                <div class="footer-section">
                    <h4>Extras</h4>
                    <div class="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>

                <!-- Links con lógica de login -->
                <div class="footer-section">
                    <h4>Links</h4>
                    <div class="footer-links">
                        <a href="index.html">Home</a>
                        <a href="contact.html">Contact</a>
                        <a v-if="user" href="game.html">Game</a>
                        <a v-if="!user" href="login.html">Login</a>
                        <a v-if="!user" href="signin.html">Sign In</a>
                    </div>
                </div>

            </div>


        </footer>
         <div class="footer-bottom">
    © Mushroom's Garden - All rights reserved
</div>
        
       
    `
});
