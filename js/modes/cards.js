// Flashcards Mode Implementation

let currentCards = {
    cards: [],
    currentIndex: 0,
    knownCards: [],
    reviewCards: []
};

function initCardsMode() {
    currentCards.cards = shuffleArray([...KINGS]);
    currentCards.currentIndex = 0;
    currentCards.knownCards = [];
    currentCards.reviewCards = [];

    showCard();
}

function showCard() {
    if (currentCards.currentIndex >= currentCards.cards.length) {
        finishCardsMode();
        return;
    }

    const king = currentCards.cards[currentCards.currentIndex];
    const flashcard = document.getElementById('flashcard');

    // Remove flipped state
    flashcard.classList.remove('flipped');

    // Update content
    document.getElementById('card-title').textContent = king.name;
    document.getElementById('card-years').textContent = king.years;

    const contentHtml = `
        <h3>${king.nickname}</h3>
        <p style="margin: 15px 0;">${king.summary}</p>
        <ul>
            ${king.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
    `;
    document.getElementById('card-content').innerHTML = contentHtml;

    // Update progress
    document.getElementById('cards-progress').textContent =
        `${currentCards.currentIndex + 1}/${currentCards.cards.length}`;

    // Add flip handler
    flashcard.onclick = () => {
        flashcard.classList.toggle('flipped');
        vibrate(30);
    };
}

async function markCardKnown() {
    const king = currentCards.cards[currentCards.currentIndex];
    currentCards.knownCards.push(king);

    // Update mastery
    const progress = await getProgress();
    const currentMastery = progress.kingsMastery[king.id] || 0;
    progress.kingsMastery[king.id] = Math.min(100, currentMastery + 10);
    await updateProgress({ kingsMastery: progress.kingsMastery });

    // Add star
    await addStars(1);

    vibrate(50);
    nextCard();
}

async function markCardReview() {
    const king = currentCards.cards[currentCards.currentIndex];
    currentCards.reviewCards.push(king);

    // Small mastery increase
    const progress = await getProgress();
    const currentMastery = progress.kingsMastery[king.id] || 0;
    progress.kingsMastery[king.id] = Math.min(100, currentMastery + 3);
    await updateProgress({ kingsMastery: progress.kingsMastery });

    nextCard();
}

function nextCard() {
    currentCards.currentIndex++;

    // Animate transition
    const flashcard = document.getElementById('flashcard');
    flashcard.style.animation = 'slideOut 0.3s ease';

    setTimeout(() => {
        flashcard.style.animation = '';
        showCard();
    }, 300);
}

async function finishCardsMode() {
    // Complete mode
    await completeMode('cards');

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    const achievements = await checkAchievements(progress);

    if (achievements.length > 0) {
        showConfetti();
    }

    // Show summary
    const known = currentCards.knownCards.length;
    const review = currentCards.reviewCards.length;

    if (known === currentCards.cards.length) {
        showToast('🏆 Perfekt! Du kan alla kungarna!', 'success');
        showConfetti();
    } else {
        showToast(`⭐ ${known} behärskade, ${review} att repetera!`, 'success');
    }

    // Go back to home
    setTimeout(() => {
        showScreen('home-screen');
    }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const cardsModeBtn = document.querySelector('[data-mode="cards"]');
    if (cardsModeBtn) {
        cardsModeBtn.addEventListener('click', () => {
            showScreen('cards-screen');
            initCardsMode();
        });
    }

    const knowBtn = document.getElementById('know-it-btn');
    if (knowBtn) {
        knowBtn.addEventListener('click', markCardKnown);
    }

    const reviewBtn = document.getElementById('review-again-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', markCardReview);
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
