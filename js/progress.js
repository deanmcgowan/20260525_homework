// Progress Screen Implementation

async function showProgressScreen() {
    showScreen('progress-screen');

    const progress = await getProgress();
    const achievements = await getUnlockedAchievements();

    // Show achievements
    renderAchievements(achievements);

    // Show king mastery
    renderKingMastery(progress.kingsMastery);

    // Show detailed stats
    renderDetailedStats(progress);
}

function renderAchievements(unlockedAchievements) {
    const container = document.getElementById('achievement-grid');
    container.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);

        const card = document.createElement('div');
        card.className = `achievement-card ${!isUnlocked ? 'locked' : ''}`;

        card.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;

        if (isUnlocked) {
            card.onclick = () => {
                showToast(`${achievement.icon} ${achievement.description}`, 'success');
            };
        }

        container.appendChild(card);
    });
}

function renderKingMastery(kingsMastery) {
    const container = document.getElementById('king-mastery-list');
    container.innerHTML = '';

    KINGS.forEach(king => {
        const mastery = kingsMastery[king.id] || 0;
        const masteryInfo = getMasteryLevel(mastery);

        const item = document.createElement('div');
        item.className = 'king-item';

        item.innerHTML = `
            <div class="king-name">${king.image} ${king.name}</div>
            <div class="mastery-bar">
                <div class="mastery-fill" style="width: ${mastery}%; background: ${king.color};"></div>
            </div>
            <div class="mastery-percent">${mastery}%</div>
        `;

        container.appendChild(item);
    });
}

function renderDetailedStats(progress) {
    const container = document.getElementById('detailed-stats');
    container.innerHTML = '';

    const stats = [
        {
            icon: '🔥',
            label: 'Nuvarande streak',
            value: `${progress.streak} dagar`
        },
        {
            icon: '⭐',
            label: 'Totalt antal stjärnor',
            value: progress.totalStars
        },
        {
            icon: '📝',
            label: 'Frågor besvarade',
            value: progress.totalQuestions
        },
        {
            icon: '✅',
            label: 'Korrekta svar',
            value: progress.correctAnswers
        },
        {
            icon: '📊',
            label: 'Träffsäkerhet',
            value: progress.totalQuestions > 0
                ? `${Math.round((progress.correctAnswers / progress.totalQuestions) * 100)}%`
                : '0%'
        },
        {
            icon: '🎯',
            label: 'Quiz genomförda',
            value: progress.modesCompleted.quiz || 0
        },
        {
            icon: '👑',
            label: 'Kort repeterade',
            value: progress.modesCompleted.cards || 0
        },
        {
            icon: '📅',
            label: 'Tidslinjer slutförda',
            value: progress.modesCompleted.timeline || 0
        },
        {
            icon: '📖',
            label: 'Berättelser lästa',
            value: progress.modesCompleted.story || 0
        },
        {
            icon: '⚡',
            label: 'Matchningar gjorda',
            value: progress.modesCompleted.match || 0
        },
        {
            icon: '✏️',
            label: 'Teckningar skapade',
            value: progress.modesCompleted.draw || 0
        },
        {
            icon: '🎧',
            label: 'Ljudberättelser',
            value: progress.modesCompleted.audio || 0
        },
        {
            icon: '📝',
            label: 'Provtest gjorda',
            value: progress.modesCompleted.test || 0
        }
    ];

    stats.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #E5E7EB;
        `;

        statDiv.innerHTML = `
            <div>
                <span style="font-size: 20px; margin-right: 8px;">${stat.icon}</span>
                <span style="font-weight: 500;">${stat.label}</span>
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #2563EB;">${stat.value}</div>
        `;

        container.appendChild(statDiv);
    });

    // Add last study date if available
    if (progress.lastStudyDate) {
        const dateDiv = document.createElement('div');
        dateDiv.style.cssText = 'margin-top: 20px; text-align: center; color: #6B7280; font-size: 14px;';
        dateDiv.textContent = `Senast studerat: ${progress.lastStudyDate}`;
        container.appendChild(dateDiv);
    }
}

// Event listener
document.addEventListener('DOMContentLoaded', () => {
    const progressBtn = document.getElementById('progress-btn');
    if (progressBtn) {
        progressBtn.addEventListener('click', showProgressScreen);
    }
});
