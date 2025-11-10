// Banner Component - title and subtitle
app.component('app-banner', {
    props: {
        t: { type: Object, required: true }
    },
    template: /*html*/`
    <div class="banner blue-bg">
        <h1 class="white-color text-king bold">{{t.banner?.title}}</h1>
        <p class="white-color text-l">{{t.banner?.subtitle}}</p>
    </div>
    `
});
