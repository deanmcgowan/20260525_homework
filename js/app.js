// Main App Initialization and Navigation

// Initialize app on load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Stormaktstiden App Starting...');

    // Initialize database
    try {
        await initDB();
        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }

    // Load and display initial stats
    await updateStatsDisplay();

    // Setup navigation
    setupNavigation();

    // Setup quick start button
    setupQuickStart();

    // Show welcome message for first-time users
    await checkFirstTimeUser();

    // Register service worker
    registerServiceWorker();

    console.log('✅ App ready!');
});

// Setup navigation between screens
function setupNavigation() {
    // Back buttons
    document.querySelectorAll('.btn-back').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('home-screen');
            updateStatsDisplay();
        });
    });

    // Mode selection buttons
    document.querySelectorAll('.mode-card').forEach(button => {
        button.addEventListener('click', () => {
            vibrate(30);
        });
    });
}

// Setup quick start functionality
async function setupQuickStart() {
    const quickStartBtn = document.getElementById('quick-start-btn');

    if (quickStartBtn) {
        quickStartBtn.addEventListener('click', async () => {
            const suggestedMode = await getSuggestedMode();

            // Find and click the appropriate mode button
            const modeBtn = document.querySelector(`[data-mode="${suggestedMode}"]`);
            if (modeBtn) {
                modeBtn.click();
            }
        });

        // Update quick start recommendation
        updateQuickStartRecommendation();
    }
}

async function updateQuickStartRecommendation() {
    const quickStartBtn = document.getElementById('quick-start-btn');
    const suggestedMode = await getSuggestedMode();

    const modeNames = {
        quiz: '❓ Snabbquiz',
        cards: '👑 Kungens Kort',
        timeline: '📅 Tidslinjen',
        story: '📖 Berättelse',
        match: '⚡ Snabbmatchning'
    };

    if (quickStartBtn) {
        quickStartBtn.innerHTML = modeNames[suggestedMode] || '⚡ Snabbstart';
    }
}

// Check if first-time user
async function checkFirstTimeUser() {
    const progress = await getProgress();

    if (progress.totalQuestions === 0) {
        // First time user
        setTimeout(() => {
            showWelcomeMessage();
        }, 500);
    }
}

function showWelcomeMessage() {
    const welcome = document.createElement('div');
    welcome.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        max-width: 320px;
        text-align: center;
        z-index: 9999;
    `;

    welcome.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 15px;">⚔️</div>
        <h2 style="margin-bottom: 15px; color: #1F2937;">Välkommen!</h2>
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
            Lär dig om Sveriges stormaktstid på ett roligt och engagerande sätt!
            Välj ett inlärningsläge för att komma igång.
        </p>
        <button class="btn-primary" onclick="this.parentElement.remove()" style="width: 100%;">
            Låt oss börja! 🚀
        </button>
    `;

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
    `;
    backdrop.onclick = () => {
        backdrop.remove();
        welcome.remove();
    };

    document.body.appendChild(backdrop);
    document.body.appendChild(welcome);
}

// Service Worker registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
}

// Check for app updates
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker activated
        showToast('🔄 App uppdaterad! Ladda om för att se ändringar.', 'success');
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('🌐 Ansluten till internet', 'success');
});

window.addEventListener('offline', () => {
    showToast('📴 Offline-läge aktiverat', 'success');
});

// Prevent accidental navigation away
window.addEventListener('beforeunload', (e) => {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'home-screen') {
        // User is in the middle of an activity
        e.preventDefault();
        e.returnValue = '';
    }
});

// Handle visibility change (app backgrounded/foregrounded)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // App came back to foreground
        updateStatsDisplay();
    }
});

// Keyboard shortcuts (for development/accessibility)
document.addEventListener('keydown', (e) => {
    // ESC to go back
    if (e.key === 'Escape') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && activeScreen.id !== 'home-screen') {
            showScreen('home-screen');
        }
    }

    // H for home
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            showScreen('home-screen');
        }
    }

    // P for progress
    if (e.key === 'p' || e.key === 'P') {
        if (!e.target.matches('input, textarea')) {
            showProgressScreen();
        }
    }
});

// Add haptic feedback to all buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        vibrate(30);
    }
});

// Periodic stats update
setInterval(async () => {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id === 'home-screen') {
        await updateStatsDisplay();
        await updateQuickStartRecommendation();
    }
}, 30000); // Every 30 seconds

// Debug mode (console commands)
window.debugApp = {
    resetProgress: async () => {
        if (confirm('Vill du verkligen återställa all progress?')) {
            const db = await indexedDB.open('StormaktstidenDB', 1);
            db.onsuccess = (e) => {
                const database = e.target.result;
                const tx = database.transaction(['progress', 'answers', 'achievements', 'drawings'], 'readwrite');
                tx.objectStore('progress').clear();
                tx.objectStore('answers').clear();
                tx.objectStore('achievements').clear();
                tx.objectStore('drawings').clear();
                location.reload();
            };
        }
    },
    addStars: async (count) => {
        await addStars(count);
        await updateStatsDisplay();
        console.log(`Added ${count} stars`);
    },
    unlockAll: async () => {
        for (const achievement of ACHIEVEMENTS) {
            await dbPut('achievements', {
                id: achievement.id,
                unlockedAt: Date.now()
            });
        }
        showToast('🏆 Alla achievements upplåsta!', 'success');
    },
    getProgress: async () => {
        const progress = await getProgress();
        console.table(progress);
        return progress;
    }
};

console.log('💡 Debug commands available: window.debugApp');

// Export for other modules
window.appReady = true;
