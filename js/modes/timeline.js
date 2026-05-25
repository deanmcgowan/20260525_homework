// Timeline Mode Implementation

let currentTimeline = {
    events: [],
    userPlacements: [],
    completed: false
};

function initTimelineMode() {
    // Select 8 random events from timeline
    const selectedEvents = getRandomItems(TIMELINE_EVENTS, 8);
    selectedEvents.sort((a, b) => a.year - b.year); // Sort by year for correct answer

    currentTimeline.events = selectedEvents;
    currentTimeline.userPlacements = [];
    currentTimeline.completed = false;

    renderTimeline();
    renderDraggableEvents();
}

function renderTimeline() {
    const container = document.getElementById('timeline-events');
    container.innerHTML = '';

    // Create drop zones for each event
    currentTimeline.events.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.dataset.index = index;

        const yearDiv = document.createElement('div');
        yearDiv.className = 'timeline-year';
        yearDiv.textContent = event.year;

        const dotDiv = document.createElement('div');
        dotDiv.className = 'timeline-dot';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content drop-zone';
        contentDiv.dataset.year = event.year;
        contentDiv.textContent = '📍 Släpp här';

        // Add drag and drop handlers
        contentDiv.addEventListener('dragover', handleDragOver);
        contentDiv.addEventListener('drop', handleDrop);
        contentDiv.addEventListener('touchmove', handleTouchMove);
        contentDiv.addEventListener('touchend', handleTouchEnd);

        eventDiv.appendChild(yearDiv);
        eventDiv.appendChild(dotDiv);
        eventDiv.appendChild(contentDiv);
        container.appendChild(eventDiv);
    });
}

function renderDraggableEvents() {
    const container = document.getElementById('draggable-events');
    container.innerHTML = '';

    // Shuffle events
    const shuffled = shuffleArray([...currentTimeline.events]);

    shuffled.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'draggable-event';
        eventDiv.draggable = true;
        eventDiv.dataset.year = event.year;
        eventDiv.dataset.event = event.event;
        eventDiv.textContent = event.event;

        // Drag handlers
        eventDiv.addEventListener('dragstart', handleDragStart);
        eventDiv.addEventListener('touchstart', handleTouchStart);

        container.appendChild(eventDiv);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement) {
        const dropZone = e.target;
        dropZone.textContent = draggedElement.dataset.event;
        dropZone.dataset.placedYear = draggedElement.dataset.year;
        dropZone.style.background = '#EFF6FF';

        draggedElement.remove();
        draggedElement.classList.remove('dragging');
        draggedElement = null;

        // Check if all placed
        checkTimelineCompletion();
    }

    return false;
}

// Touch handlers for mobile
let touchedElement = null;
let touchStartPos = {};

function handleTouchStart(e) {
    touchedElement = e.target;
    const touch = e.touches[0];
    touchStartPos = { x: touch.clientX, y: touch.clientY };
    touchedElement.classList.add('dragging');
}

function handleTouchMove(e) {
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!touchedElement) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget && dropTarget.classList.contains('drop-zone')) {
        dropTarget.textContent = touchedElement.dataset.event;
        dropTarget.dataset.placedYear = touchedElement.dataset.year;
        dropTarget.style.background = '#EFF6FF';

        touchedElement.remove();
        checkTimelineCompletion();
    }

    touchedElement.classList.remove('dragging');
    touchedElement = null;
}

function checkTimelineCompletion() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const allPlaced = Array.from(dropZones).every(zone => zone.dataset.placedYear);

    if (allPlaced) {
        document.getElementById('check-timeline-btn').disabled = false;
        document.getElementById('check-timeline-btn').style.opacity = '1';
    }
}

async function checkTimelineAnswers() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    let total = dropZones.length;

    dropZones.forEach(zone => {
        const placedYear = parseInt(zone.dataset.placedYear);
        const correctYear = parseInt(zone.dataset.year);

        if (placedYear === correctYear) {
            correct++;
            zone.style.background = '#ECFDF5';
            zone.style.borderColor = '#10B981';
        } else {
            zone.style.background = '#FEF2F2';
            zone.style.borderColor = '#EF4444';
        }
    });

    // Add stars based on performance
    const stars = Math.ceil((correct / total) * 5);
    await addStars(stars);

    // Complete mode
    await completeMode('timeline');

    // Show result
    if (correct === total) {
        showConfetti();
        showToast('🎉 Perfekt! Alla rätt!', 'success');
    } else {
        showToast(`⭐ ${correct} av ${total} rätt! ${getEncouragingMessage(correct, total)}`, 'success');
    }

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    await checkAchievements(progress);

    // Change button
    const btn = document.getElementById('check-timeline-btn');
    btn.textContent = '← Tillbaka till Meny';
    btn.onclick = () => showScreen('home-screen');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const timelineModeBtn = document.querySelector('[data-mode="timeline"]');
    if (timelineModeBtn) {
        timelineModeBtn.addEventListener('click', () => {
            showScreen('timeline-screen');
            initTimelineMode();
        });
    }

    const checkBtn = document.getElementById('check-timeline-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkTimelineAnswers);
    }
});
