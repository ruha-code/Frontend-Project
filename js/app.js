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
    
    // ИСПРАВЛЕНО: ССЫЛКА ДОЛЖНА ВЕСТИ НА ГЛАВНУЮ СТРАНИЦУ + ЯКОРЬ
    menuHTML += `
        <li class="mobile-cta"><a href="index.html#newsletter" class="btn-subscribe">Subscribe Now</a></li>
    `;
    return menuHTML;
}


document.addEventListener('DOMContentLoaded', () => {
    
    const navActions = document.querySelector('.nav-actions');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    const header = document.querySelector('header');
    
    // --- 1. ЛОГИКА БУРГЕРА (Делегирование и фикс высоты хедера) ---
    if (navActions && mobileMenu && header) {
        const menuToggle = document.querySelector('.menu-toggle');
        
        navActions.addEventListener('click', (e) => {
            
            if (e.target.classList.contains('menu-toggle')) {
                mobileMenu.classList.toggle('open');
                
                if (mobileMenu.classList.contains('open')) {
                    e.target.textContent = '✕';
                    body.style.overflow = 'hidden'; 
                    // НОВАЯ ЛОГИКА: Снимаем ограничение высоты, чтобы меню уместилось
                    header.style.minHeight = 'auto'; 
                } else {
                    e.target.textContent = '☰';
                    body.style.overflow = '';
                    // НОВАЯ ЛОГИКА: Возвращаем стандартную высоту хедера
                    header.style.minHeight = 'var(--header-height)'; 
                }
            }
        });
        
        
        mobileMenu.addEventListener('click', (e) => {
            
            if (e.target.tagName === 'A' && !e.target.classList.contains('btn-subscribe')) {
                mobileMenu.classList.remove('open');
                // Проверяем, существует ли menuToggle, прежде чем менять текст
                if (menuToggle) {
                    menuToggle.textContent = '☰';
                }
                body.style.overflow = '';
                header.style.minHeight = 'var(--header-height)'; // Возвращаем высоту
                
                if (e.target.id === 'mobile-sign-out') {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userProfile');
                    window.location.reload();
                }
            }
        });
    }

    
    // --- 2. ОБНОВЛЕНИЕ NAV BAR (Десктоп) ---
    function updateNavState() {
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
                localStorage.removeItem('userProfile');
                window.location.reload(); 
            });
        }

        if (mobileMenu) {
            mobileMenu.innerHTML = renderMobileMenu(isLoggedIn);
        }
    }
    updateNavState();


    // --- 3. PROFILE PAGE LOGIC ---
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

    
    // --- 4. BLOG PAGE LOGIC ---
    if (document.querySelector('.main-blog-content')) {
        
        const categoryLinks = document.querySelectorAll('.category-list a');
        const articles = document.querySelectorAll('.article-post-card');
        const showAllButton = document.getElementById('show-all-articles');

        // Функция для фильтрации
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

        // Обработчики кликов по категориям
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
        
        // Инициализация фильтра при загрузке
        if (showAllButton) {
            filterArticles('ALL');
            showAllButton.classList.add('active-filter');
        }
    }


    // --- 5. SCROLL & ANIMATIONS ---
    
    // (Логика анимации теперь объединена)
    const animatedElements = document.querySelectorAll('.bento-item, .feature-card, .section-header, .newsletter-body, .hero-content, .article-post-card, .sidebar, .page-header');

    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Используем класс 'in-view' из старого кода или 'visible-element' из нового
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

    // Логика для хедера при прокрутке (уже была в коде)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
});