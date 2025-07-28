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