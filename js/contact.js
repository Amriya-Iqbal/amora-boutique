/* =========================================================
   AMORA BOUTIQUE - CONTACT & CONCIERGE CONTROLLER
========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const contactForm = document.getElementById("contact-form");
        const successMessage = document.getElementById("contact-success");

        if (contactForm) {
            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();

                const nameInput = document.getElementById("contact-name");
                const emailInput = document.getElementById("contact-email");
                const subjectInput = document.getElementById("contact-subject");
                const messageInput = document.getElementById("contact-message");

                const name = nameInput ? nameInput.value.trim() : "";
                const email = emailInput ? emailInput.value.trim() : "";
                const subject = subjectInput ? subjectInput.value.trim() : "";
                const message = messageInput ? messageInput.value.trim() : "";

                if (!name) {
                    if (window.AmoraToast) window.AmoraToast.show({ title: "Name Required", message: "Please enter your name.", type: "info" });
                    if (nameInput) nameInput.focus();
                    return;
                }

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    if (window.AmoraToast) window.AmoraToast.show({ title: "Valid Email Required", message: "Please enter a valid email address.", type: "info" });
                    if (emailInput) emailInput.focus();
                    return;
                }

                if (!message || message.length < 10) {
                    if (window.AmoraToast) window.AmoraToast.show({ title: "Message Too Short", message: "Please tell us how we can assist you (minimum 10 characters).", type: "info" });
                    if (messageInput) messageInput.focus();
                    return;
                }

                if (window.AmoraToast) {
                    window.AmoraToast.show({
                        title: "Message Received ",
                        message: `Thank you, ${name}. Our concierge team will respond within 24 hours.`
                    });
                }

                if (successMessage) {
                    successMessage.style.display = "block";
                    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    setTimeout(() => {
                        successMessage.style.display = "none";
                    }, 6000);
                }

                contactForm.reset();
            });
        }

        // FAQ accordions
        document.querySelectorAll(".faq-trigger").forEach(trigger => {
            trigger.addEventListener("click", function () {
                const item = this.closest(".accordion-item");
                if (item) {
                    item.classList.toggle("is-open");
                }
            });
        });
    });

})();