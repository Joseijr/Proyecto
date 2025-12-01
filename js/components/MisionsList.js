app.component('missions-list', {
    data() {
        return {
            missions: [],
            loading: false,
            error: null
        };
    },
    methods: {
        getMissions() {
            this.loading = true;
            this.error = null;
            const server = 'http://backend.test';
            fetch(server + '/api/v1/missions') // Endpoint de tus misiones
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.missions = data;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error.message;
                    this.loading = false;
                });
        }
    },
    created() {
        this.getMissions();
    },
    template: /*html*/`
    <div>
      <h2>Misiones</h2>
      <div v-if="loading">Cargando misiones...</div>
      <div v-if="error" style="color: red">{{ error }}</div>
      <ul v-if="missions.length">
        <li v-for="mission in missions" :key="mission.id">
          <p class="extra-color text-xxl">{{ mission.title }}</p>
          <span>{{ mission.description }}</span><br>
          <p>Recompensa: <span class="extra-color">{{ mission.reward }}</span> monedas</p>
          <button>Reclamar</button>
          <hr>
        </li>
      </ul>
      
      <div v-else-if="!loading">No hay misiones disponibles.</div>
    </div>
  `
});
