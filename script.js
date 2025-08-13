// Анимация элементов при скролле
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
    
    // Анимация кнопки
    const btn = document.querySelector('.btn');
    btn.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    btn.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Параллакс эффект для декоративных элементов
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const ornaments = document.querySelectorAll('.ornament');
        
        ornaments.forEach((ornament, index) => {
            const speed = 0.05 + (index * 0.02);
            ornament.style.transform = `rotate(${index % 2 === 0 ? scrollY * speed : -scrollY * speed}deg)`;
        });
    });
});

// Аккордеон FAQ
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все открытые элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
});

// Анимация элементов при скролле (оставить без изменений)
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
    
    // Анимация кнопки (оставить без изменений)
    const btn = document.querySelector('.btn');
    btn.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    btn.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Параллакс эффект для декоративных элементов (оставить без изменений)
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const ornaments = document.querySelectorAll('.ornament');
        
        ornaments.forEach((ornament, index) => {
            const speed = 0.05 + (index * 0.02);
            ornament.style.transform = `rotate(${index % 2 === 0 ? scrollY * speed : -scrollY * speed}deg)`;
        });
    });
});

// Выпадающее меню заказа
document.addEventListener('DOMContentLoaded', function() {
    const orderMenu = document.querySelector('.order-menu');
    const orderToggle = document.querySelector('.order-toggle');
    
    orderToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        orderMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!orderMenu.contains(e.target)) {
            orderMenu.classList.remove('active');
        }
    });
    
    // Предотвращение закрытия при клике внутри меню
    document.querySelector('.order-dropdown').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Карусель отзывов
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
    let visibleCards = calculateVisibleCards();
    let isAnimating = false;
    const animationDuration = 600; // Совпадает с CSS transition
    
    function calculateVisibleCards() {
        return window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(cards.length / visibleCards);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => !isAnimating && goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function goToSlide(index) {
        if (isAnimating) return;
        
        const maxIndex = Math.max(0, Math.ceil(cards.length / visibleCards) - 1);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        isAnimating = true;
        updateCarousel();
        
        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);
    }
    
    function updateCarousel() {
        const maxOffset = Math.max(0, (cards.length - visibleCards) * cardWidth);
        let offset = -currentIndex * cardWidth * visibleCards;
        offset = Math.max(-maxOffset, Math.min(offset, 0));
        
        track.style.transform = `translateX(${offset}px)`;
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = currentIndex >= Math.ceil(cards.length / visibleCards) - 1 ? 'hidden' : 'visible';
    }
    
    prevBtn.addEventListener('click', () => {
        if (!isAnimating && currentIndex > 0) {
            currentIndex--;
            goToSlide(currentIndex);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.ceil(cards.length / visibleCards) - 1;
        if (!isAnimating && currentIndex < maxIndex) {
            currentIndex++;
            goToSlide(currentIndex);
        }
    });
    
    function handleResize() {
        const newVisibleCards = calculateVisibleCards();
        if (newVisibleCards !== visibleCards) {
            cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
            visibleCards = newVisibleCards;
            createDots();
            currentIndex = 0;
            updateCarousel();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Инициализация
    createDots();
    updateCarousel();
    
    // Добавляем обработчик для кнопки "Все отзывы"
    document.querySelector('.btn-all-reviews')?.addEventListener('click', () => {
        // Здесь можно добавить переход на страницу со всеми отзывами
        console.log('Переход на страницу всех отзывов');
        // window.location.href = '/reviews.html';
    });
});

// Обработчик для кнопки каталога
document.querySelector('.btn-luxury-catalog')?.addEventListener('click', function() {
    // Здесь можно реализовать:
    // 1. Открытие модального окна с каталогом
    // 2. Переход на страницу каталога
    // 3. Плавный скролл к разделу с товарами
    
    console.log('Открытие каталога товаров');
    // window.location.href = '/catalog.html';
});