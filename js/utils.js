// Utility functions for the app

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get random items from array
function getRandomItems(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Show/hide screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: calc(20px + env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Play celebration animation
function playCelebration(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 500);
}

// Update stats display
async function updateStatsDisplay() {
    const progress = await getProgress();

    document.getElementById('streak-count').textContent = progress.streak || 0;
    document.getElementById('star-count').textContent = progress.totalStars || 0;

    const accuracy = progress.totalQuestions > 0
        ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
        : 0;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
}

// Confetti animation
function showConfetti() {
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);

            const duration = 2000 + Math.random() * 1000;
            const fallDistance = window.innerHeight + 20;

            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${fallDistance}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            setTimeout(() => confetti.remove(), duration);
        }, i * 30);
    }
}

// Vibration feedback (if supported)
function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Text-to-speech (if supported)
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

function speak(text) {
    if (!speechSynthesis) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'sv-SE';
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;

    speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

// Get encouraging message based on performance
function getEncouragingMessage(correct, total) {
    const percentage = (correct / total) * 100;

    if (percentage === 100) {
        return '🎉 Perfekt! Du är en stjärna!';
    } else if (percentage >= 80) {
        return '⭐ Fantastiskt! Nästan perfekt!';
    } else if (percentage >= 60) {
        return '👍 Bra jobbat! Du lär dig mer och mer!';
    } else if (percentage >= 40) {
        return '💪 Bra försök! Fortsätt öva!';
    } else {
        return '🌟 Varje försök gör dig bättre!';
    }
}

// Get suggested next mode based on progress
async function getSuggestedMode() {
    const progress = await getProgress();
    const modes = ['quiz', 'cards', 'timeline', 'story', 'match'];

    // Find mode with lowest completion count
    let minMode = modes[0];
    let minCount = progress.modesCompleted[minMode] || 0;

    for (const mode of modes) {
        const count = progress.modesCompleted[mode] || 0;
        if (count < minCount) {
            minMode = mode;
            minCount = count;
        }
    }

    return minMode;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detect if device is iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Prevent bounce/overscroll on iOS
function preventOverscroll() {
    let startY;
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const y = e.touches[0].pageY;
        const el = e.target;

        // Check if element is scrollable
        const scrollable = el.scrollHeight > el.clientHeight;

        if (!scrollable) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Initialize iOS-specific features
if (isIOS()) {
    preventOverscroll();
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button if desired
    // For now, we'll just store it
});

// Check if already installed
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Color code by king
function getKingColor(kingId) {
    const king = KINGS.find(k => k.id === kingId);
    return king ? king.color : '#2563EB';
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Calculate mastery level
function getMasteryLevel(percentage) {
    if (percentage >= 90) return { level: 'Expert', emoji: '🏆' };
    if (percentage >= 70) return { level: 'Avancerad', emoji: '⭐' };
    if (percentage >= 50) return { level: 'Mellanivå', emoji: '📚' };
    if (percentage >= 25) return { level: 'Nybörjare', emoji: '🌱' };
    return { level: 'Börjar lära', emoji: '👶' };
}
