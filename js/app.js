function getProfileData() {
    let data = localStorage.getItem('userProfile');
    if (!data) {
        return null;
    }
    return JSON.parse(data);
}

function saveProfileData(data) {
    localStorage.setItem('userProfile', JSON.stringify(data));
}

function validatePassword(password) {
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
       return "Password must contain at least one special character (e.g., !, @, #).";
    }
    return null;
}

function renderMobileMenu(isLoggedIn) {
    let menuHTML = `
        <li><a href="index.html">Home</a></li> 
        <li><a href="blog.html">Blog</a></li>
        <li><a href="сontact.html">About</a></li> 
        <li><a href="сontact.html#for-contact">Contact</a></li> 
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
        <li class="mobile-cta"><a href="index.html#newsletter" class="btn-subscribe">Subscribe Now</a></li>
    `;
    return menuHTML;
}

function updateNavState() {
    const navActions = document.querySelector('.nav-actions');
    const mobileMenu = document.querySelector('.mobile-menu');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (navActions && isLoggedIn) {
        navActions.innerHTML = `
            <a href="profile.html" class="btn-signin">Profile</a>
            <a href="index.html#newsletter" class="btn-subscribe">Subscribe</a> 
            <a href="#" id="sign-out-btn" class="btn-signin" style="margin-left: 0.75rem;">Sign Out</a>
            <div class="menu-toggle">☰</div>
        `;
        
        document.getElementById('sign-out-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn'); 
            window.location.href = 'index.html';
        });
    }

    if (mobileMenu) {
        mobileMenu.innerHTML = renderMobileMenu(isLoggedIn);
    }
}

function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPath = link.pathname.split('/').pop() || 'index.html';
        const linkHash = link.hash;
        
        let shouldBeActive = false;

        if (linkPath === currentPath) {
            if (currentHash) {
                if (linkHash === currentHash) {
                    shouldBeActive = true;
                }
            } else {
                if (!linkHash) {
                    shouldBeActive = true;
                }
            }
        }
        
        if (shouldBeActive) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    const navActions = document.querySelector('.nav-actions');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const header = document.querySelector('header');
    
    if (navActions && mobileMenu && header) {
        const menuToggle = document.querySelector('.menu-toggle');
        
        navActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-toggle')) {
                mobileMenu.classList.toggle('open');
                
                if (mobileMenu.classList.contains('open')) {
                    e.target.textContent = '✕';
                    header.style.minHeight = 'auto'; 
                } else {
                    e.target.textContent = '☰';
                    header.style.minHeight = 'var(--header-height)'; 
                }
            }
        });
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && !e.target.classList.contains('btn-subscribe')) {
                mobileMenu.classList.remove('open');
                if (menuToggle) {
                    menuToggle.textContent = '☰';
                }
                header.style.minHeight = 'var(--header-height)'; 
                
                if (e.target.id === 'mobile-sign-out') {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = 'index.html';
                }
            }
        });
    }

    updateNavState();
    setActiveNav(); 

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
        
        if (overviewGreeting && profileData) {
            overviewGreeting.textContent = `Welcome Back, ${profileData.name}!`;
        }
        if (profileNameInput && profileData) {
            profileNameInput.value = profileData.name;
        }
        if (profileEmailInput && profileData) {
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
                const newProfileData = { 
                    name: newName, 
                    email: profileData.email,
                    password: profileData.password 
                }; 
                
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
                window.location.href = 'index.html';
            });
        }
    }

    if (document.querySelector('.main-blog-content')) {
        
        const categoryLinks = document.querySelectorAll('.category-list a');
        const articles = document.querySelectorAll('.article-post-card');
        const showAllButton = document.getElementById('show-all-articles');

        function filterArticles(category) {
            const displayStyle = window.innerWidth <= 1024 ? 'flex' : 'flex'; 

            articles.forEach(article => {
                const articleCategoryElement = article.querySelector('.post-category');
                
                if (articleCategoryElement) {
                    const articleCategory = articleCategoryElement.textContent.trim().toUpperCase();
                    
                    if (category === 'ALL' || articleCategory === category) {
                        article.style.display = displayStyle; 
                    } else {
                        article.style.display = 'none'; 
                    }
                } else if (category === 'ALL') {
                    article.style.display = displayStyle;
                } else {
                    article.style.display = 'none';
                }
            });
        }

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 

                categoryLinks.forEach(l => l.classList.remove('active-filter'));
                link.classList.add('active-filter');

                const category = link.getAttribute('data-category');
                
                if (category) {
                    filterArticles(category.toUpperCase());
                } else if (link.id === 'show-all-articles') {
                    filterArticles('ALL');
                }
            });
        });
        
        if (showAllButton) {
            filterArticles('ALL');
            showAllButton.classList.add('active-filter');
        }
    }

    const registrationForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('register-name');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            registerMessage.style.display = 'none';
            registerMessage.classList.remove('success-message-box');
            registerMessage.classList.add('error-message-box');
            
            if (!name || !email || !password || !confirmPassword) {
                registerMessage.textContent = "Error: All fields are required.";
                registerMessage.style.display = 'block';
                return;
            }
            
            const passwordError = validatePassword(password);
            if (passwordError) {
                registerMessage.textContent = `Error: ${passwordError}`;
                registerMessage.style.display = 'block';
                return;
            }

            if (password !== confirmPassword) {
                registerMessage.textContent = "Error: Passwords do not match.";
                registerMessage.style.display = 'block';
                return;
            }
            
            const newUser = { name: name, email: email, password: password };
            
            saveProfileData(newUser); 
            localStorage.setItem('isLoggedIn', 'true');
            
            registerMessage.textContent = "Registration successful! Redirecting to profile...";
            registerMessage.classList.remove('error-message-box');
            registerMessage.classList.add('success-message-box'); 
            registerMessage.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'profile.html'; 
            }, 1500);
        });
    }

    const loginForm = document.getElementById('login-form');
    const loginErrorBox = document.getElementById('loginErrorBox'); 

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('loginEmail').value.trim();
            const passwordInput = document.getElementById('loginPassword').value;
            
            loginErrorBox.style.display = 'none';
            loginErrorBox.textContent = '';
            
            const storedUser = getProfileData();

            if (storedUser && emailInput === storedUser.email && passwordInput === storedUser.password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html'; 
            } else {
                loginErrorBox.textContent = "Error: Invalid email or password.";
                loginErrorBox.style.display = 'block';
            }
        });
    }
    
    const showPasswordCheckbox = document.getElementById('show-password-checkbox');
    
    const registerPasswordInputs = [
        document.getElementById('register-password'),
        document.getElementById('confirm-password')
    ];

    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', () => {
            const newType = showPasswordCheckbox.checked ? 'text' : 'password';
            
            registerPasswordInputs.forEach(input => {
                if (input) {
                    input.type = newType;
                }
            });
        });
    }

    const animatedElements = document.querySelectorAll('.bento-item, .feature-card, .section-header, .newsletter-body, .hero-content, .article-post-card, .sidebar, .page-header, .topic-card, .team-member, .contact-map, .about-hero-content, .map-container');

    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); 
                entry.target.classList.add('visible-element'); 
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('hidden-element'); 
        observer.observe(el);       
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
});