app.component('plant', {
    data() {
        return {
            plants: [],
            loading: false,
            error: null
        };
    },
    methods: {
        getPlants() {
            this.loading = true;
            this.error = null;
            const server = 'http://prueba.test';
            // Replace the URL below with your custom API link
            fetch(server + '/api/v1/garden/plants')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.plants = data;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error.message;
                    this.loading = false;
                });
        }
    },
    created() {
        this.getPlants();
    },
    template: /*html*/`

       <li v-for="p in plants" :key="p.id">
    <span style="color: red">{{ p.name }} </span><br>
     <br>
</li>

    `
});