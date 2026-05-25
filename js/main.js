// ========== 婚禮日期設定 ==========
const WEDDING_DATE = new Date('2025-12-20T14:00:00');

// ========== 倒數計時 ==========
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<p style="font-size: 2rem; color: var(--color-gold);">🎊 今天是我們的大日子！</p>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// 每秒更新倒數計時
setInterval(updateCountdown, 1000);
updateCountdown();

// ========== 滾動動畫 ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 添加動畫進入樣式
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    initScrollAnimations();
});

// ========== Lightbox 相簿功能 ==========
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ESC 鍵關閉 Lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ========== RSVP 表單 ==========
document.getElementById('attendance').addEventListener('change', function() {
    const guestsGroup = document.getElementById('guests-group');
    const vegetarianGroup = document.getElementById('vegetarian-group');
    
    if (this.value === 'yes') {
        guestsGroup.style.display = 'block';
        vegetarianGroup.style.display = 'block';
    } else {
        guestsGroup.style.display = 'none';
        vegetarianGroup.style.display = 'none';
    }
});

document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        attendance: document.getElementById('attendance').value,
        guests: document.getElementById('attendance').value === 'yes' ? document.getElementById('guests').value : 0,
        vegetarian: document.getElementById('attendance').value === 'yes' ? document.getElementById('vegetarian').value : 0,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // 儲存到 localStorage
    let rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    rsvpList.push(formData);
    localStorage.setItem('rsvpList', JSON.stringify(rsvpList));
    
    // 顯示成功訊息
    alert('感謝您的回覆！我們期待在婚禮上見到您 🎊');
    this.reset();
    document.getElementById('guests-group').style.display = 'none';
    document.getElementById('vegetarian-group').style.display = 'none';
});

// ========== 祝福留言板 ==========
function loadWishes() {
    const wishList = JSON.parse(localStorage.getItem('wishList') || '[]');
    const container = document.getElementById('wishes-list');
    
    if (wishList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-gray);">還沒有祝福留言，成為第一個送上祝福的人吧！</p>';
        return;
    }
    
    container.innerHTML = wishList.slice().reverse().map(wish => `
        <div class="wish-item">
            <div class="wish-author">💌 ${wish.name}</div>
            <div class="wish-text">${wish.message}</div>
            <div class="wish-time">${new Date(wish.timestamp).toLocaleString('zh-TW')}</div>
        </div>
    `).join('');
}

document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const wishData = {
        id: Date.now(),
        name: document.getElementById('wish-name').value,
        message: document.getElementById('wish-message').value,
        timestamp: new Date().toISOString()
    };
    
    let wishList = JSON.parse(localStorage.getItem('wishList') || '[]');
    wishList.push(wishData);
    localStorage.setItem('wishList', JSON.stringify(wishList));
    
    loadWishes();
    this.reset();
    alert('感謝您的祝福！❤️');
});

// 頁面載入時讀取祝福
document.addEventListener('DOMContentLoaded', loadWishes);
