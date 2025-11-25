document.addEventListener('DOMContentLoaded', () => {
    // 1. Функциональность Мобильного Меню (Меню-Бургер)
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Переключает класс 'open' на мобильном меню
            mobileMenu.classList.toggle('open');
            // Опционально: можно изменить иконку бургера
            if (mobileMenu.classList.contains('open')) {
                menuToggle.innerHTML = '✕'; // Иконка "Закрыть"
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                menuToggle.innerHTML = '☰'; // Иконка "Меню"
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Функциональность Поисковой Системы
    const searchToggle = document.querySelector('.search-toggle');
    const nav = document.querySelector('nav');
    
    // Создаем элемент для поисковой строки
    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.innerHTML = `
        <input type="text" placeholder="Искать статьи, обзоры, тренды..." aria-label="Поиск по сайту">
        <button class="close-search-btn">✕</button>
    `;

    if (searchToggle && nav) {
        // Добавляем панель поиска в навигацию
        nav.appendChild(searchBar);

        searchToggle.addEventListener('click', () => {
            // Переключаем класс 'search-active' на элементе 'nav'
            nav.classList.toggle('search-active');

            // Если поиск активен, фокусируемся на поле ввода
            if (nav.classList.contains('search-active')) {
                // Прячем основные навигационные элементы при активации поиска
                document.querySelector('.nav-links').style.display = 'none';
                document.querySelector('.btn-subscribe').style.display = 'none';
                // Фокусируемся на поле ввода
                setTimeout(() => {
                    searchBar.querySelector('input').focus();
                }, 50); 
            } else {
                // Возвращаем элементы на место
                document.querySelector('.nav-links').style.display = 'flex';
                document.querySelector('.btn-subscribe').style.display = 'block';
            }
        });
        
        // Добавляем обработчик для кнопки закрытия
        const closeSearchBtn = searchBar.querySelector('.close-search-btn');
        closeSearchBtn.addEventListener('click', () => {
             nav.classList.remove('search-active');
             // Возвращаем элементы на место
             document.querySelector('.nav-links').style.display = 'flex';
             document.querySelector('.btn-subscribe').style.display = 'block';
        });
    }
});