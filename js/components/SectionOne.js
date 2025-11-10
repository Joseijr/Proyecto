// Section1 Component - first content section
app.component('section-one', {
    props: {
        t: { type: Object, required: true }
    },
    template: /*html*/`
    <section class="light-bg">
        <div class="display-flex">
            <div class="mx-giant text-left textCard">
                <h2 class="text-giant extra-color">{{t.section1?.title}}</h2>
                <p class="text-l regular">
                    {{t.section1?.in}} <span class="extra-color">{{t.banner?.title}}</span>{{t.section1?.text}}
                </p>
            </div>
            <div class="card img display-flex">
                <img src="assets/fondoPreview.png" alt="">
            </div>
        </div>
    </section>
    `
});
