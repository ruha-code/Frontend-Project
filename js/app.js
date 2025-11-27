
function getProfileData() {
    const defaultData = { name: 'NexusCoder', email: 'ruslan@gmail.com' };
    let data = localStorage.getItem('userProfile');
    if (!data) {
        localStorage.setItem('userProfile', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

function saveProfileData(data) {
    localStorage.setItem('userProfile', JSON.stringify(data));
}

function renderMobileMenu(isLoggedIn) {
    let menuHTML = `
        <li><a href="index.html">Home</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
    `;

    if (isLoggedIn) {
        menuHTML += `
            <li class="mobile-divider"></li>
            <li><a href="profile.html">Profile</a></li>
            <li><a href="#" id="mobile-sign-out" class="btn-secondary">Sign Out</a></li>
        `;
    } else {
        menuHTML += `
            <li class="mobile-divider"></li>
            <li><a href="auth.html">Sign In</a></li>
        `;
    }
    
    menuHTML += `
        <li class="mobile-cta"><a href="#newsletter" class="btn-subscribe">Subscribe Now</a></li>
    `;
    return menuHTML;
}



document.addEventListener('DOMContentLoaded', () => {
    
    
    const navActions = document.querySelector('.nav-actions');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    
 
    if (navActions && mobileMenu) {
        navActions.addEventListener('click', (e) => {
            
            if (e.target.classList.contains('menu-toggle')) {
                mobileMenu.classList.toggle('open');
                
                if (mobileMenu.classList.contains('open')) {
                    e.target.textContent = '✕';
                    body.style.overflow = 'hidden'; 
                } else {
                    e.target.textContent = '☰';
                    body.style.overflow = '';
                }
            }
        });
        
        
        mobileMenu.addEventListener('click', (e) => {
            
            if (e.target.tagName === 'A' && !e.target.classList.contains('btn-subscribe')) {
                mobileMenu.classList.remove('open');
                document.querySelector('.menu-toggle').textContent = '☰';
                body.style.overflow = '';

                
                if (e.target.id === 'mobile-sign-out') {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userProfile');
                    window.location.reload();
                }
            }
        });
    }

   
    function updateNavState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        
        if (navActions && isLoggedIn) {
            navActions.innerHTML = `
                <a href="profile.html" class="btn-signin">Profile</a>
                <a href="#newsletter" class="btn-subscribe">Subscribe</a>
                <a href="#" id="sign-out-btn" class="btn-signin" style="margin-left: 0.75rem;">Sign Out</a>
                <div class="menu-toggle">☰</div>
            `;
            
            document.getElementById('sign-out-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn'); 
                localStorage.removeItem('userProfile');
                window.location.reload(); 
            });
        }

        if (mobileMenu) {
            mobileMenu.innerHTML = renderMobileMenu(isLoggedIn);
        }
    }
    updateNavState();


    if (document.body.classList.contains('bg-offset') && document.querySelector('.profile-layout')) {
        
        const profileData = getProfileData();
        
        const profileNavLinks = document.querySelectorAll('.profile-nav ul li a');
        const contentSections = document.querySelectorAll('.profile-content-section');
        const signOutBtn = document.getElementById('profile-sign-out');
        const updateProfileBtn = document.querySelector('.overview-grid + .btn-primary');
        const overviewGreeting = document.querySelector('#overview h2');
        const profileNameInput = document.getElementById('profileName');
        const profileEmailInput = document.getElementById('profileEmail');
        const profileInfoForm = document.querySelector('#profile-info .profile-form');
        
    
        if (overviewGreeting) {
            overviewGreeting.textContent = `Welcome Back, ${profileData.name}!`;
        }
        if (profileNameInput) {
            profileNameInput.value = profileData.name;
        }
        if (profileEmailInput) {
            profileEmailInput.value = profileData.email;
        }

        function showSection(sectionId) {
            contentSections.forEach(sec => { sec.classList.remove('active'); });
            profileNavLinks.forEach(link => { link.classList.remove('active'); });

            document.getElementById(sectionId)?.classList.add('active');

            profileNavLinks.forEach(link => {
                if (link.dataset.section === sectionId) { link.classList.add('active'); }
            });
        }

        const initialSectionId = profileNavLinks[0]?.dataset.section || 'overview';
        showSection(initialSectionId); 

        profileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(e.currentTarget.dataset.section);
            });
        });

        if (updateProfileBtn) {
            updateProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(e.currentTarget.dataset.sectionTarget);
            });
        }
        
        if (profileInfoForm) {
            profileInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const newName = profileNameInput.value.trim();
                const newProfileData = { name: newName, email: profileData.email }; 
                
                if (!newName) {
                    alert("Error: Username cannot be empty.");
                    return;
                }
                
                saveProfileData(newProfileData);
                overviewGreeting.textContent = `Welcome Back, ${newName}!`;

                alert("Profile updated successfully!");
            });
        }
        
        if (signOutBtn) {
            signOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userProfile');
                window.location.href = 'index.html';
            });
        }
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