// Section2 Component - second content section with CTA button
app.component('section-two', {
    props: {
        t: { type: Object, required: true }
    },
    template: /*html*/`
    <section class="secondary-bg">
        <div class="display-flex reverse ml-l">
            <div class="card img display-flex">
                <img src="assets/fondoPreview.png" alt="">
            </div>
            <div class="text-right mx-giant textCard">
                <h2 class="blue-color text-giant">{{t.section2?.title}}</h2>
                <p class="white-color text-l regular">{{t.section2?.text}}</p>
                <div onclick="window.location.href='login.html'" class="btn-play-container">
                    <div class="btn-play blue-bg white-color text-xl black-hover">{{t.section2?.button}}</div>
                </div>
            </div>
        </div>
    </section>
    `
});
