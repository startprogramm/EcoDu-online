const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {

    document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => 
menuOpenButton.click());

navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});

const swiper = new Swiper('.slider-wrapper', {
  loop: true,
    grabCursor: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: { 
        el: '.swiper-pagination',
        clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        768: {  
            slidesPerView: 2,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40
        }
    },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const scrollToTopButton = document.querySelector("#scroll-to-top-button");

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        scrollToTopButton.classList.add("show-scroll-to-top-button");
    } else {
        scrollToTopButton.classList.remove("show-scroll-to-top-button");
    }
});

scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

AOS.init({
    duration: 800,
    easing: 'slide',
    once: true
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Thank you for contacting us! We will get back to you shortly.");
        form.reset();
    });
});

// Initialize Swiper  for testimonials
const testimonialSwiper = new Swiper('.testimonial-slider', {
    
});