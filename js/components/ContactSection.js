// ContactSection Component - contact information display with emails
app.component('contact-section', {
    props: {
        t: { type: Object, required: true }
    },
    template: /*html*/`
    <section class="input-display contact-back">
        <h1 class="white-color text-king p-giant">{{ t.contact?.title}}</h1>

        <h2 class="white-color text-xxl p-giant">{{ t.contact?.secondTittle}}</h2>

        <div class="mails-contact">
            <img src="assets/mail.svg" alt="">
            <p class="white-color text-xl">{{ t.contact?.email1}}</p>
        </div>
        <div class="mails-contact p-giant">
            <img src="assets/mail.svg" alt="">
            <p class="white-color text-xl">{{ t.contact?.email2}}</p>
        </div>

        <h2 class="white-color text-xxl my-xl">{{ t.contact?.thirdTittle}}</h2>

        <div class="mails-contact p-giant">
            <img src="assets/mail.svg" alt="">
            <p class="white-color text-xl">{{ t.contact?.email3}}</p>
        </div>
    </section>
    `
});
