// Match Mode Implementation

let currentMatch = {
    pairs: [],
    leftSelected: null,
    rightSelected: null,
    matches: 0,
    startTime: null,
    timer: null
};

function initMatchMode() {
    // Select 10 random pairs
    const selectedPairs = getRandomItems(MATCH_PAIRS, 10);
    currentMatch.pairs = selectedPairs;
    currentMatch.leftSelected = null;
    currentMatch.rightSelected = null;
    currentMatch.matches = 0;
    currentMatch.startTime = Date.now();

    renderMatchCards();
    startMatchTimer();
}

function renderMatchCards() {
    const leftColumn = document.getElementById('match-left');
    const rightColumn = document.getElementById('match-right');

    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';

    // Shuffle left and right items
    const leftItems = shuffleArray(currentMatch.pairs.map(p => p.left));
    const rightItems = shuffleArray(currentMatch.pairs.map(p => p.right));

    leftItems.forEach((item, index) => {
        const card = document.createElement('button');
        card.className = 'match-item';
        card.textContent = item;
        card.dataset.value = item;
        card.dataset.side = 'left';
        card.onclick = () => selectMatchCard(card, 'left', item);
        leftColumn.appendChild(card);
    });

    rightItems.forEach((item, index) => {
        const card = document.createElement('button');
        card.className = 'match-item';
        card.textContent = item;
        card.dataset.value = item;
        card.dataset.side = 'right';
        card.onclick = () => selectMatchCard(card, 'right', item);
        rightColumn.appendChild(card);
    });
}

function startMatchTimer() {
    let elapsed = 0;
    const timerEl = document.getElementById('match-timer');

    currentMatch.timer = setInterval(() => {
        elapsed++;
        timerEl.textContent = formatTime(elapsed);
    }, 1000);
}

function selectMatchCard(card, side, value) {
    // Ignore if already matched
    if (card.classList.contains('matched')) return;

    // Deselect previous selection on same side
    if (side === 'left' && currentMatch.leftSelected) {
        currentMatch.leftSelected.classList.remove('selected');
    }
    if (side === 'right' && currentMatch.rightSelected) {
        currentMatch.rightSelected.classList.remove('selected');
    }

    // Select new card
    card.classList.add('selected');

    if (side === 'left') {
        currentMatch.leftSelected = card;
    } else {
        currentMatch.rightSelected = card;
    }

    vibrate(30);

    // Check if we have both selections
    if (currentMatch.leftSelected && currentMatch.rightSelected) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const leftValue = currentMatch.leftSelected.dataset.value;
    const rightValue = currentMatch.rightSelected.dataset.value;

    // Find if this is a valid pair
    const isMatch = currentMatch.pairs.some(pair =>
        (pair.left === leftValue && pair.right === rightValue)
    );

    if (isMatch) {
        // Correct match!
        currentMatch.leftSelected.classList.add('matched');
        currentMatch.rightSelected.classList.add('matched');
        currentMatch.leftSelected.classList.remove('selected');
        currentMatch.rightSelected.classList.remove('selected');
        currentMatch.leftSelected.disabled = true;
        currentMatch.rightSelected.disabled = true;

        currentMatch.matches++;
        vibrate(50);

        // Update score
        document.getElementById('match-score').textContent =
            `${currentMatch.matches}/${currentMatch.pairs.length}`;

        // Check if all matched
        if (currentMatch.matches === currentMatch.pairs.length) {
            finishMatchMode();
        }

        currentMatch.leftSelected = null;
        currentMatch.rightSelected = null;
    } else {
        // Wrong match - add shake animation and incorrect color
        currentMatch.leftSelected.classList.add('shake', 'incorrect');
        currentMatch.rightSelected.classList.add('shake', 'incorrect');
        vibrate([50, 50, 50]);

        // Store references before clearing
        const leftCard = currentMatch.leftSelected;
        const rightCard = currentMatch.rightSelected;

        // Clear selections immediately
        currentMatch.leftSelected = null;
        currentMatch.rightSelected = null;

        // Remove shake and incorrect styling after animation, reset to unselected state
        setTimeout(() => {
            leftCard.classList.remove('selected', 'shake', 'incorrect');
            rightCard.classList.remove('selected', 'shake', 'incorrect');
        }, 600);
    }
}

async function finishMatchMode() {
    // Stop timer
    clearInterval(currentMatch.timer);

    const elapsed = Math.floor((Date.now() - currentMatch.startTime) / 1000);

    // Complete mode
    await completeMode('match');

    // Award stars based on time
    let stars = 5;
    if (elapsed > 120) stars = 3;
    else if (elapsed > 60) stars = 4;

    await addStars(stars);

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    await checkAchievements(progress);

    // Show completion
    showToast(`🎯 Klart på ${formatTime(elapsed)}! +${stars} stjärnor!`, 'success');
    showConfetti();

    // Go back to home
    setTimeout(() => {
        showScreen('home-screen');
    }, 2500);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const matchModeBtn = document.querySelector('[data-mode="match"]');
    if (matchModeBtn) {
        matchModeBtn.addEventListener('click', () => {
            showScreen('match-screen');
            initMatchMode();
        });
    }
});
