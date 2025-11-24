const mobileMenu = document.querySelector('.mobile-menu');
const toggle = document.querySelector('.menu-toggle');

toggle.onclick = () => {
    mobileMenu.classList.toggle('open');
};

mobileMenu.addEventListener('mouseleave', () => {
    mobileMenu.classList.remove('open');
});

window.onresize = () => {
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('open');
    }
};


