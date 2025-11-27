document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const toggle = document.querySelector('.menu-toggle');
    const body = document.body;

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            
            
            if (mobileMenu.classList.contains('open')) {
                toggle.textContent = '✕';
                body.style.overflow = 'hidden'; 
            } else {
                toggle.textContent = '☰';
                body.style.overflow = '';
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                toggle.textContent = '☰';
                body.style.overflow = '';
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('open');
                toggle.textContent = '☰';
                body.style.overflow = '';
            }
        });
    }

    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const animatedElements = document.querySelectorAll('.bento-item, .feature-card, .section-header, .newsletter-body, .hero-content');

    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('hidden-element'); 
        observer.observe(el);
    });
});