// Timeline Mode Implementation - Reordering Events

let currentTimeline = {
    events: [],
    shuffledEvents: [],
    selectedEventIndex: null,
    completed: false
};

function initTimelineMode() {
    // Select 8 random events from timeline
    const selectedEvents = getRandomItems(TIMELINE_EVENTS, 8);
    selectedEvents.sort((a, b) => a.year - b.year); // Sort by year for correct answer

    currentTimeline.events = selectedEvents;

    // Shuffle the events for display
    currentTimeline.shuffledEvents = shuffleArray([...selectedEvents]);
    currentTimeline.selectedEventIndex = null;
    currentTimeline.completed = false;

    renderTimeline();
}

function renderTimeline() {
    const container = document.getElementById('timeline-events');
    container.innerHTML = '';

    // Create the timeline with shuffled events already placed
    currentTimeline.shuffledEvents.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.dataset.index = index;

        const yearDiv = document.createElement('div');
        yearDiv.className = 'timeline-year';
        yearDiv.textContent = '?'; // Don't show the year

        const dotDiv = document.createElement('div');
        dotDiv.className = 'timeline-dot';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-content clickable-event';
        contentDiv.dataset.eventYear = event.year;
        contentDiv.dataset.eventText = event.event;
        contentDiv.textContent = event.event;

        // Add click handler for selection/swapping
        contentDiv.addEventListener('click', () => handleEventSelection(index));

        eventDiv.appendChild(yearDiv);
        eventDiv.appendChild(dotDiv);
        eventDiv.appendChild(contentDiv);
        container.appendChild(eventDiv);
    });

    // Hide draggable events container (not needed anymore)
    const draggableContainer = document.getElementById('draggable-events');
    if (draggableContainer) {
        draggableContainer.style.display = 'none';
    }
}

function handleEventSelection(index) {
    const eventElements = document.querySelectorAll('.timeline-content.clickable-event');

    // If no event is selected, select this one
    if (currentTimeline.selectedEventIndex === null) {
        currentTimeline.selectedEventIndex = index;
        eventElements[index].classList.add('selected');
        eventElements[index].style.background = '#FEF3C7';
        eventElements[index].style.borderColor = '#F59E0B';

        // Highlight other events as swappable
        eventElements.forEach((el, i) => {
            if (i !== index) {
                el.classList.add('swappable');
                el.style.opacity = '0.6';
            }
        });

        vibrate(30);
    }
    // If the same event is clicked, deselect it
    else if (currentTimeline.selectedEventIndex === index) {
        eventElements[index].classList.remove('selected');
        eventElements[index].style.background = '';
        eventElements[index].style.borderColor = '';

        // Remove swappable highlighting
        eventElements.forEach(el => {
            el.classList.remove('swappable');
            el.style.opacity = '';
        });

        currentTimeline.selectedEventIndex = null;
        vibrate(30);
    }
    // If a different event is clicked, swap them
    else {
        const firstIndex = currentTimeline.selectedEventIndex;
        const secondIndex = index;

        // Swap events in the array
        const temp = currentTimeline.shuffledEvents[firstIndex];
        currentTimeline.shuffledEvents[firstIndex] = currentTimeline.shuffledEvents[secondIndex];
        currentTimeline.shuffledEvents[secondIndex] = temp;

        // Clear selection
        currentTimeline.selectedEventIndex = null;

        vibrate(50);

        // Re-render timeline
        renderTimeline();

        // Enable check button (can check at any time)
        document.getElementById('check-timeline-btn').disabled = false;
        document.getElementById('check-timeline-btn').style.opacity = '1';
    }
}

async function checkTimelineAnswers() {
    const eventElements = document.querySelectorAll('.timeline-content.clickable-event');
    let correct = 0;
    let total = currentTimeline.shuffledEvents.length;

    // Check if events are in correct chronological order
    currentTimeline.shuffledEvents.forEach((event, index) => {
        const expectedEvent = currentTimeline.events[index];
        const isCorrect = event.year === expectedEvent.year;

        if (isCorrect) {
            correct++;
            eventElements[index].style.background = '#ECFDF5';
            eventElements[index].style.borderColor = '#10B981';

            // Now show the correct year
            const yearDiv = eventElements[index].closest('.timeline-event').querySelector('.timeline-year');
            yearDiv.textContent = event.year;
            yearDiv.style.color = '#10B981';
        } else {
            eventElements[index].style.background = '#FEF2F2';
            eventElements[index].style.borderColor = '#EF4444';

            // Show the actual year (which is wrong position)
            const yearDiv = eventElements[index].closest('.timeline-event').querySelector('.timeline-year');
            yearDiv.textContent = event.year;
            yearDiv.style.color = '#EF4444';
        }

        // Remove click handlers
        eventElements[index].classList.remove('clickable-event', 'selected', 'swappable');
        eventElements[index].style.cursor = 'default';
        eventElements[index].replaceWith(eventElements[index].cloneNode(true));
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
