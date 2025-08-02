document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');
    const phoneInput = document.getElementById('phone');
    
    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '+7 (';
            
            if (value.length > 1) {
                formattedValue += value.substring(1, Math.min(4, value.length));
            }
            
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(4, Math.min(7, value.length));
            }
            
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, Math.min(9, value.length));
            }
            
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, Math.min(11, value.length));
            }
        }
        
        e.target.value = formattedValue;
    });
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Создаем сообщение, если его еще нет
        let messageEl = form.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            form.insertBefore(messageEl, form.firstChild);
        }
        
        // Валидация
        const name = form.elements['name'].value.trim();
        const phone = form.elements['phone'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();
        const consent = form.elements['consent'].checked;
        
        if (!consent) {
            showMessage('Для отправки формы необходимо согласие на обработку данных', 'error');
            return;
        }
        
        if (!name || !phone) {
            showMessage('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            date: new Date().toLocaleString('ru-RU'),
            page: window.location.href
        };
        
        // Отправляем данные в Telegram бота
        sendToTelegram(formData);
    });
    
    function showMessage(text, type) {
        const messageEl = form.querySelector('.form-message');
        messageEl.textContent = text;
        messageEl.className = 'form-message ' + type;
        messageEl.style.display = 'block';
        
        // Прокрутка к сообщению
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function sendToTelegram(data) {
        // Здесь нужно указать токен вашего бота и ID чата
        const botToken = '8338005607:AAEuq0pATs-bk0I4qsLptVyN-VBKBm8zIBo';
        const chatId = '743619189';
        
        // Формируем текст сообщения
        let messageText = `📌 Новая заявка с сайта EXXXAMPLE\n\n`;
        messageText += `👤 Имя: ${data.name}\n`;
        messageText += `📞 Телефон: ${data.phone}\n`;
        if (data.email) messageText += `📧 Email: ${data.email}\n`;
        if (data.message) messageText += `📝 Сообщение: ${data.message}\n\n`;
        messageText += `⏰ Дата: ${data.date}\n`;
        messageText += `🌐 Страница: ${data.page}`;
        
        // Кодируем текст для URL
        const encodedText = encodeURIComponent(messageText);
        
        // Формируем URL для запроса
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedText}`;
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Отправка...</span>';
        submitBtn.disabled = true;
        
        // Отправляем запрос
        fetch(url)
            .then(response => response.json())
            .then(response => {
                if (response.ok) {
                    showMessage('Ваша заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.', 'success');
                    form.reset();
                } else {
                    showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.', 'error');
                    console.error('Telegram API error:', response);
                }
            })
            .catch(error => {
                showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.', 'error');
                console.error('Fetch error:', error);
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }
});