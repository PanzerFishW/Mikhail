let scrollTimeout;
let resizeTimeout;

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
    
    const btn = document.querySelector('.btn');
    if (btn) {
        btn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
    
    const orderMenu = document.querySelector('.order-menu');
    const orderToggle = document.querySelector('.order-toggle');
    
    if (orderToggle) {
        orderToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            orderMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!orderMenu.contains(e.target)) {
                orderMenu.classList.remove('active');
            }
        });
        
        document.querySelector('.order-dropdown')?.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    const header = document.getElementById('main-header');
    const scrollThreshold = 100;
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('header-scrolled');
                // Скрыть статичный логотип при скролле
                document.querySelector('.static-logo').style.opacity = '0';
            } else {
                header.classList.remove('header-scrolled');
                // Показать статичный логотип
                document.querySelector('.static-logo').style.opacity = '1';
            }
        });
        
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
            document.querySelector('.static-logo').style.opacity = '0';
        }
    }
    
    init3DModel();
});

function init3DModel() {
    const container = document.getElementById('deluxe-model-container');
    if (!container) return;

    // Создаем элемент подсказки
    const hintElement = document.createElement('div');
    hintElement.className = 'model-hint';
    hintElement.innerHTML = '<span>▲</span><p>Вращайте, чтобы осмотреть</p>';
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    container.appendChild(hintElement); // Добавляем подсказку в контейнер

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    camera.position.set(3, 2, 5);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    const loader = new THREE.GLTFLoader();
    
    // Функция для скрытия подсказки
    function hideHint() {
        hintElement.style.opacity = '0';
        hintElement.style.visibility = 'hidden';
        
        // Убираем обработчики после первого взаимодействия
        controls.removeEventListener('start', hideHint);
        container.removeEventListener('click', hideHint);
        container.removeEventListener('touchstart', hideHint);
        window.removeEventListener('keydown', hideHintOnKeyPress);
    }
    
    // Дополнительная функция для скрытия при нажатии клавиш
    function hideHintOnKeyPress(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
            hideHint();
        }
    }

    // Добавляем обработчики событий
    controls.addEventListener('start', hideHint);
    container.addEventListener('click', hideHint);
    container.addEventListener('touchstart', hideHint);
    window.addEventListener('keydown', hideHintOnKeyPress);

    loader.load(
        'models/deluxe-pantograph.gltf',
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);
            model.scale.set(0.01, 0.01, 0.01);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            camera.position.set(20, 20, 30);
            controls.target.copy(center);
            controls.update();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
            container.innerHTML = '<div class="model-error">Не удалось загрузить модель.</div>';
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }, 250);
    });
}

// Добавьте эту функцию после init3DModel()
function initBasicModel() {
    const container = document.getElementById('basic-model-container');
    if (!container) return;

    // Создаем элемент подсказки
    const hintElement = container.querySelector('.model-hint');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Очищаем контейнер и добавляем рендерер
    const loadingElement = container.querySelector('.model-loading');
    if (loadingElement) loadingElement.remove();
    
    container.appendChild(renderer.domElement);

    // Основное освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Основной directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Дополнительное освещение с разных сторон
    const fillLight1 = new THREE.DirectionalLight(0x777777, 0.5);
    fillLight1.position.set(-5, 5, 5);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0x555555, 0.5);
    fillLight2.position.set(0, -5, 0);
    scene.add(fillLight2);

    camera.position.set(3, 2, 5);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    const loader = new THREE.GLTFLoader();
    
    // Функция для скрытия подсказки
    function hideHint() {
        hintElement.style.opacity = '0';
        hintElement.style.visibility = 'hidden';
        
        // Убираем обработчики после первого взаимодействия
        controls.removeEventListener('start', hideHint);
        container.removeEventListener('click', hideHint);
        container.removeEventListener('touchstart', hideHint);
        window.removeEventListener('keydown', hideHintOnKeyPress);
    }
    
    // Дополнительная функция для скрытия при нажатии клавиш
    function hideHintOnKeyPress(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
            hideHint();
        }
    }

    // Добавляем обработчики событий
    controls.addEventListener('start', hideHint);
    container.addEventListener('click', hideHint);
    container.addEventListener('touchstart', hideHint);
    window.addEventListener('keydown', hideHintOnKeyPress);

    loader.setResourcePath('models/');
    
    loader.load(
        'models/lift_darkgrey.gltf',
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);
            
            // Масштабирование модели
            model.scale.set(0.01, 0.01, 0.01);
            
            // Центрирование модели
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Включение тени для лучшего отображения
            model.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Принудительное обновление материалов
                    if (node.material) {
                        node.material.needsUpdate = true;
                    }
                }
            });

            camera.position.set(20, 20, 30);
            controls.target.copy(center);
            controls.update();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
            container.innerHTML = '<div class="model-error">Не удалось загрузить модель. Проверьте консоль для деталей.</div>';
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }, 250);
    });
}

function initReviews() {
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    const currentReviewEl = document.querySelector('.current-review');
    const totalReviewsEl = document.querySelector('.total-reviews');
    
    if (!reviewsTrack || reviewCards.length === 0) return;
    
    let currentIndex = 0;
    const totalReviews = reviewCards.length;
    
    // Установка общего количества отзывов
    totalReviewsEl.textContent = totalReviews;
    
    // Функция обновления отображения отзывов
    function updateReviewDisplay() {
        reviewCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
        
        // Обновление индикаторов
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentIndex) {
                indicator.classList.add('active');
            }
        });
        
        // Обновление нумерации
        currentReviewEl.textContent = currentIndex + 1;
    }
    
    // Переход к следующему отзыву
    function nextReview() {
        currentIndex = (currentIndex + 1) % totalReviews;
        updateReviewDisplay();
    }
    
    // Переход к предыдущему отзыву
    function prevReview() {
        currentIndex = (currentIndex - 1 + totalReviews) % totalReviews;
        updateReviewDisplay();
    }
    
    // Обработчики событий для кнопок навигации
    if (nextBtn) nextBtn.addEventListener('click', nextReview);
    if (prevBtn) prevBtn.addEventListener('click', prevReview);
    
    // Обработчики для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateReviewDisplay();
        });
    });
    
    // Автопрокрутка отзывов (опционально)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextReview, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Запуск автопрокрутки
    startAutoPlay();
    
    // Остановка автопрокрутки при наведении на отзывы
    reviewsTrack.addEventListener('mouseenter', stopAutoPlay);
    reviewsTrack.addEventListener('mouseleave', startAutoPlay);
    
    // Инициализация
    updateReviewDisplay();
}

// Вызов функции инициализации при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initReviews();
    initBasicModel();
});