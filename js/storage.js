// Storage management using IndexedDB for offline capability

const DB_NAME = 'StormaktstidenDB';
const DB_VERSION = 1;
let db = null;

// Initialize database
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create object stores
            if (!db.objectStoreNames.contains('progress')) {
                db.createObjectStore('progress', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('answers')) {
                db.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('drawings')) {
                db.createObjectStore('drawings', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('achievements')) {
                db.createObjectStore('achievements', { keyPath: 'id' });
            }
        };
    });
}

// Generic database operations
async function dbGet(storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function dbPut(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function dbGetAll(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Progress tracking
async function getProgress() {
    const progress = await dbGet('progress', 'main');
    return progress || {
        id: 'main',
        streak: 0,
        lastStudyDate: null,
        totalStars: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        kingsMastery: {
            'gustaf-ii-adolf': 0,
            'kristina': 0,
            'karl-x-gustav': 0,
            'karl-xi': 0,
            'karl-xii': 0
        },
        modesCompleted: {
            quiz: 0,
            timeline: 0,
            cards: 0,
            story: 0,
            match: 0,
            draw: 0,
            audio: 0,
            test: 0
        }
    };
}

async function updateProgress(updates) {
    const progress = await getProgress();
    const updatedProgress = { ...progress, ...updates };

    // Update streak
    const today = new Date().toDateString();
    if (progress.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (progress.lastStudyDate === yesterday.toDateString()) {
            updatedProgress.streak = progress.streak + 1;
        } else if (progress.lastStudyDate === today) {
            // Already studied today
        } else {
            updatedProgress.streak = 1;
        }
        updatedProgress.lastStudyDate = today;
    }

    await dbPut('progress', updatedProgress);
    return updatedProgress;
}

async function addStars(count) {
    const progress = await getProgress();
    return await updateProgress({
        totalStars: progress.totalStars + count
    });
}

async function recordAnswer(questionId, correct, kingId = null) {
    const progress = await getProgress();
    const updates = {
        totalQuestions: progress.totalQuestions + 1,
        correctAnswers: progress.correctAnswers + (correct ? 1 : 0)
    };

    // Update king mastery
    if (kingId && progress.kingsMastery[kingId] !== undefined) {
        const current = progress.kingsMastery[kingId];
        updates.kingsMastery = {
            ...progress.kingsMastery,
            [kingId]: Math.min(100, current + (correct ? 5 : -2))
        };
    }

    // Save answer
    await dbPut('answers', {
        questionId,
        correct,
        kingId,
        timestamp: Date.now()
    });

    return await updateProgress(updates);
}

async function completeMode(mode) {
    const progress = await getProgress();
    const updates = {
        modesCompleted: {
            ...progress.modesCompleted,
            [mode]: (progress.modesCompleted[mode] || 0) + 1
        }
    };
    return await updateProgress(updates);
}

// Achievement tracking
async function checkAchievements(progress) {
    const unlockedAchievements = [];

    for (const achievement of ACHIEVEMENTS) {
        const existing = await dbGet('achievements', achievement.id);
        if (existing) continue; // Already unlocked

        let unlocked = false;

        switch(achievement.id) {
            case 'first-quiz':
                unlocked = progress.modesCompleted.quiz >= 1;
                break;
            case 'perfect-quiz':
                // Check recent quiz results
                const answers = await dbGetAll('answers');
                const recentQuiz = answers.slice(-5);
                unlocked = recentQuiz.length === 5 && recentQuiz.every(a => a.correct);
                break;
            case 'seven-streak':
                unlocked = progress.streak >= 7;
                break;
            case 'all-kings':
                unlocked = Object.values(progress.kingsMastery).every(m => m >= 20);
                break;
            case 'timeline-master':
                unlocked = progress.modesCompleted.timeline >= 1;
                break;
            case 'hundred-stars':
                unlocked = progress.totalStars >= 100;
                break;
            case 'story-complete':
                unlocked = progress.modesCompleted.story >= 1;
                break;
            case 'quick-learner':
                unlocked = progress.totalQuestions >= 50;
                break;
            case 'artist':
                const drawings = await dbGetAll('drawings');
                unlocked = drawings.length >= 5;
                break;
        }

        if (unlocked) {
            await dbPut('achievements', {
                id: achievement.id,
                unlockedAt: Date.now()
            });
            unlockedAchievements.push(achievement);
        }
    }

    return unlockedAchievements;
}

async function getUnlockedAchievements() {
    return await dbGetAll('achievements');
}

// Drawing storage
async function saveDrawing(dataURL, prompt) {
    return await dbPut('drawings', {
        dataURL,
        prompt,
        timestamp: Date.now()
    });
}

async function getDrawings() {
    return await dbGetAll('drawings');
}

// Test answers storage
async function saveTestAnswer(questionId, answer) {
    const key = `test_answer_${questionId}`;
    localStorage.setItem(key, answer);
}

async function getTestAnswer(questionId) {
    const key = `test_answer_${questionId}`;
    return localStorage.getItem(key) || '';
}

async function clearTestAnswers() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('test_answer_')) {
            localStorage.removeItem(key);
        }
    });
}

// Initialize on load
initDB().catch(console.error);
