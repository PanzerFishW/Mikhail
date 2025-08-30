document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');
    const phoneInput = document.getElementById('phone');

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
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let messageEl = form.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            form.insertBefore(messageEl, form.firstChild);
        }
        
        const name = form.elements['name'].value.trim();
        const phone = form.elements['phone'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();
        const consent = form.elements['consent'].checked;
        const messenger = form.elements['messenger'].value;
        
        if (!consent) {
            showMessage('Для отправки формы необходимо согласие на обработку данных', 'error');
            return;
        }
        
        if (!name || !phone) {
            showMessage('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }
        
        const formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            messenger: messenger,
            date: new Date().toLocaleString('ru-RU'),
            page: window.location.href
        };
        
        sendToTelegram(formData);
    });
    
    function showMessage(text, type) {
        const messageEl = form.querySelector('.form-message');
        messageEl.textContent = text;
        messageEl.className = 'form-message ' + type;
        messageEl.style.display = 'block';
        
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function sendToTelegram(data) {
        const botToken = '8234810199:AAHkAoOPzKdRJXUOoZy5d7UW2eUbVCaywAU';
        const chatId = '743619189';
        
        let messageText = `📌 Новая заявка с сайта ma.furniture\n\n`;
        messageText += `👤 Имя: ${data.name}\n`;
        messageText += `📞 Телефон: ${data.phone}\n`;
        if (data.email) messageText += `📧 Email: ${data.email}\n`;
        messageText += `💬 Предпочитаемый мессенджер: ${data.messenger === 'telegram' ? 'Telegram' : 'WhatsApp'}\n`;
        if (data.message) messageText += `📝 Сообщение: ${data.message}\n\n`;
        messageText += `⏰ Дата: ${data.date}\n`;
        messageText += `🌐 Страница: ${data.page}`;
        
        const encodedText = encodeURIComponent(messageText);
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedText}`;
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Отправка...</span>';
        submitBtn.disabled = true;
        
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

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '').trim();
}

// Проверка email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}