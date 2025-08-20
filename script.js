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

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.review-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Инициализация - показываем первую карточку
    function initCarousel() {
        cards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        createDots();
    }
    
    // Создаем точки навигации
    function createDots() {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Показываем конкретный слайд
    function showSlide(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        // Обновляем точки
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Инициализируем карусель
    initCarousel();
    
    // Кнопки навигации
    document.querySelector('.prev-btn')?.addEventListener('click', () => {
        const current = document.querySelector('.review-card.active');
        const prev = current.previousElementSibling || cards[cards.length - 1];
        showSlide([...cards].indexOf(prev));
    });
    
    document.querySelector('.next-btn')?.addEventListener('click', () => {
        const current = document.querySelector('.review-card.active');
        const next = current.nextElementSibling || cards[0];
        showSlide([...cards].indexOf(next));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Инициализация при загрузке
    if (window.scrollY > scrollThreshold) {
        header.classList.add('header-scrolled');
    }
});

// Функция для инициализации и загрузки 3D модели
function init3DModel() {
    const container = document.getElementById('deluxe-model-container');
    if (!container) return; // Если контейнера нет на странице, выходим

    // 1. Создаем сцену, камеру и рендерер
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9); // Фон сцены, можно изменить

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Для четкости на Retina дисплеях

    // Очищаем контейнер и добавляем рендерер
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Добавляем освещение (очень важно для GLTF моделей!)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 3. Настраиваем камеру
    camera.position.set(3, 2, 5);

    // 4. Добавляем OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Плавное управление
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // 5. Загружаем модель
    const loader = new THREE.GLTFLoader();
    
    // ЗАМЕНИТЕ 'models/your-model.gltf' НА ПУТЬ К ВАШЕМУ ФАЙЛУ
    loader.load(
        'models/deluxe-pantograph.gltf',
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // Масштабируем модель до нужного размера
            model.scale.set(0.01, 0.01, 0.01); // Начните с этого значения и регулируйте

            // Центрируем модель
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Настраиваем камеру на удобное расстояние
            camera.position.set(20, 20, 30); // Ближе, чем было
            controls.target.copy(center); // Цель управления - центр модели
            controls.update();
        },
        function (xhr) {
            // Прогресс загрузки (опционально)
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            // Обработка ошибок
            console.error('Error loading model:', error);
            container.innerHTML = '<div class="model-error">Не удалось загрузить модель.</div>';
        }
    );

    // 6. Функция анимации
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Только если требуется damping
        renderer.render(scene, camera);
    }
    animate();

    // 7. Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Запускаем инициализацию после полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...
    
    init3DModel(); // Инициализируем 3D модель
});