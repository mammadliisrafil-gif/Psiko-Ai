// ===== Psiko AI - Psikolog AI Web Sitesi JavaScript =====

// ===== Navigation =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Hero Chat Scroll =====
function scrollToChat() {
    document.getElementById('sohbet').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 800);
}

// ===== AI Chat System =====
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

// AI Response Database
const aiResponses = {
    'merhaba': [
        'Merhaba! Ben Psiko AI. Bugün size nasıl yardımcı olabilirim? 🌟',
        'Merhaba! Sizi dinliyorum. Bugün nasıl hissediyorsunuz?',
        'Merhaba! Psiko AI'ye hoş geldiniz. Konuşmaya başlayalım mı?'
    ],
    'kaygili': [
        'Kaygı yaşadığınızı duyduğuma üzüldüm. Birlikte bu duyguyu yönetmek için çalışabiliriz. Şu an ne sizi kaygılandırıyor?',
        'Kaygı zorlayıcı bir duygu olabilir. Size yardımcı olmak için buradayım. 4-7-8 nefes tekniğini denemek ister misiniz?',
        'Kaygınızı anlıyorum. Birlikte bu duyguyu keşfedelim. Şu an vücudunuzda neler hissediyorsunuz?'
    ],
    'stres': [
        'Stres yönetimi önemli bir beceri. Size bazı gevşeme tekniklerini gösterebilirim. Şu an stres seviyenizi 1-10 arası nasıl değerlendirirsiniz?',
        'Stresli zamanlar zordur. Kendinize biraz zaman ayırın. Kısa bir nefes egzersizi yapalım mı?',
        'Stresinizi azaltmak için size yardımcı olabilirim. Şu an en çok ne stres yapıyor?'
    ],
    'uzgun': [
        'Üzgün olduğunuzu duyduğuma üzüldüm. Duygularınız geçerli ve önemli. Konuşmak isterseniz buradayım.',
        'Üzüntü doğal bir duygudur. Kendinize karşı nazik olun. Bugün sizi ne üzdü?',
        'Üzüntü hissetmek tamam. Bu duyguyu birlikte keşfedelim. Size nasıl destek olabilirim?'
    ],
    'depresyon': [
        'Depresif hissetmek çok zorlayıcı olabilir. Lütfen unutmayın: yalnız değilsiniz ve yardım almayı hak ediyorsunuz.',
        'Depresif duygular yaşadığınızı duyuyorum. Bu zor bir durum. Profesyonel destek almayı düşündünüz mü?',
        'Depresyon ciddi bir durumdur ve yardım almayı hak edersiniz. Size acil destek hatlarını gösterebilirim.'
    ],
    'intihar': [
        'CRISIS',
        'Kendinize zarar verme düşünceleriniz olduğunu duyduğum çok üzücü. Lütfen hemen yardım alın. Siz değerlisiniz.'
    ],
    'uyku': [
        'Uyku sorunları yaşamak zordur. Uyku hijyenine dair bazı ipuçları verebilirim. Akşam rutininiz nasıl?',
        'Kaliteli uyku önemli. Size uyku meditasyonu önerebilirim. Gece yatmadan önce telefon kullanıyor musunuz?',
        'Uyku sorunlarınızı anlıyorum. Birlikte uyku kalitenizi artırmak için çalışabiliriz.'
    ],
    'yalniz': [
        'Yalnızlık hissetmek zordur. Ama unutmayın, buradayım ve sizi dinliyorum.',
        'Yalnız hissettiğinizi duyuyorum. Bu duygu geçici. Kendinize iyi bakın ve sosyal bağlarınızı güçlendirin.',
        'Yalnızlık zorlayıcı bir duygu olabilir. Size nasıl eşlik edebilirim?'
    ],
    'default': [
        'Anlıyorum. Size nasıl yardımcı olabilirim? Daha fazla detay paylaşabilir misiniz?',
        'Duygularınızı ifade etmeniz çok değerli. Bu konuda daha fazla konuşmak ister misiniz?',
        'Size destek olmak için buradayım. Başka neler hissediyorsunuz?',
        'Anladım. Bu duyguyu daha iyi anlamak için bana biraz daha bahsedebilir misiniz?',
        'Dinliyorum. Size nasıl destek olabilirim?'
    ]
};

// Crisis keywords
const crisisKeywords = ['intihar', 'kendimi öldür', 'ölüm', 'zarar ver', 'hayatımı sonlandır', 'yaşamak istemiyorum'];

function checkCrisis(message) {
    const lowerMsg = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMsg.includes(keyword));
}

function getAIResponse(message) {
    const lowerMsg = message.toLowerCase();

    // Check crisis first
    if (checkCrisis(message)) {
        showCrisisModal();
        return aiResponses['intihar'][1];
    }

    // Find matching response
    for (const [key, responses] of Object.entries(aiResponses)) {
        if (key !== 'default' && key !== 'intihar' && lowerMsg.includes(key)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Default response
    const defaults = aiResponses['default'];
    return defaults[Math.floor(Math.random() * defaults.length)];
}

function addMessage(text, isUser = false) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`;

    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'bubble-content';

    const paragraphs = text.split('\n').filter(p => p.trim());
    paragraphs.forEach(para => {
        const p = document.createElement('p');
        p.textContent = para;
        content.appendChild(p);
    });

    const time = document.createElement('span');
    time.className = 'bubble-time';
    time.textContent = 'Şimdi';
    content.appendChild(time);

    bubble.appendChild(avatar);
    bubble.appendChild(content);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble ai-bubble typing-indicator';
    bubble.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'bubble-content';
    content.innerHTML = '<p><i class="fas fa-circle" style="font-size:6px; animation: pulse 1s infinite;"></i> <i class="fas fa-circle" style="font-size:6px; animation: pulse 1s infinite 0.2s;"></i> <i class="fas fa-circle" style="font-size:6px; animation: pulse 1s infinite 0.4s;"></i></p>';

    bubble.appendChild(avatar);
    bubble.appendChild(content);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(message);
        addMessage(response);
    }, 1500 + Math.random() * 1000);
}

function sendQuickMessage(message) {
    chatInput.value = message;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ===== Crisis Modal =====
function showCrisisModal() {
    document.getElementById('crisisModal').classList.add('active');
}

function closeCrisisModal() {
    document.getElementById('crisisModal').classList.remove('active');
}

// Close modal on backdrop click
document.getElementById('crisisModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCrisisModal();
    }
});

// ===== Mood Tracker =====
let selectedMood = null;

function selectMood(mood) {
    selectedMood = mood;

    // Remove previous selections
    document.querySelectorAll('.mood-emoji').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selection to clicked button
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
}

function saveMood() {
    if (!selectedMood) {
        alert('Lütfen bir ruh hali seçin');
        return;
    }

    const note = document.getElementById('moodNote').value;

    // Simulate saving
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Kaydedildi!';
    btn.style.background = 'var(--success)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';

        // Reset form
        selectedMood = null;
        document.querySelectorAll('.mood-emoji').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('moodNote').value = '';

        // Update chart (simulation)
        updateChart();
    }, 1500);
}

function updateChart() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 60) + 30;
        bar.style.height = randomHeight + '%';
        bar.querySelector('.bar-value').textContent = Math.floor(randomHeight / 20) + 1;
    });
}

// ===== Exercise Filter =====
function filterExercises(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.exercise-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.feature-card, .exercise-card, .program-card, .stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== Mobile Menu =====
const hamburger = document.querySelector('.hamburger');
let mobileMenuOpen = false;

hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;

    if (mobileMenuOpen) {
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <ul>
                <li><a href="#anasayfa">Ana Sayfa</a></li>
                <li><a href="#sohbet">Sohbet</a></li>
                <li><a href="#ruh-hali">Ruh Hali</a></li>
                <li><a href="#egzersizler">Egzersizler</a></li>
                <li><a href="#hakkimizda">Hakkımızda</a></li>
            </ul>
            <div class="mobile-buttons">
                <button class="btn btn-outline">Giriş Yap</button>
                <button class="btn btn-primary">Ücretsiz Başla</button>
            </div>
        `;

        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu {
                position: fixed;
                top: 72px;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                padding: 24px;
                box-shadow: var(--shadow-lg);
                z-index: 999;
                animation: slideDown 0.3s ease;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .mobile-menu ul { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
            .mobile-menu a { font-size: 16px; font-weight: 500; }
            .mobile-buttons { display: flex; flex-direction: column; gap: 12px; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(mobileMenu);
    } else {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) mobileMenu.remove();
    }
});

// ===== Breathing Exercise Animation (for future use) =====
function startBreathingExercise() {
    // This would be expanded with actual breathing animation
    console.log('Nefes egzersizi başlatıldı');
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add pulse animation for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    console.log('Psiko AI yüklendi! 🧠');
});
