// Story Mode Implementation

let currentStory = {
    currentChapterId: 1,
    choicesMade: [],
    startTime: null
};

function initStoryMode() {
    currentStory.currentChapterId = 1;
    currentStory.choicesMade = [];
    currentStory.startTime = Date.now();

    showChapter(1);
}

function showChapter(chapterId) {
    const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) {
        finishStory();
        return;
    }

    currentStory.currentChapterId = chapterId;

    // Update progress indicator
    const progress = (chapterId / STORY_CHAPTERS.length) * 100;
    document.getElementById('story-progress').textContent = `${chapterId}/${STORY_CHAPTERS.length}`;
    document.getElementById('story-progress').style.width = `${progress}%`;

    // Show story text with typing effect
    const textEl = document.getElementById('story-text');
    textEl.innerHTML = `<h2>${chapter.title}</h2><p>${chapter.text}</p>`;

    // Show choices
    const choicesEl = document.getElementById('story-choices');
    choicesEl.innerHTML = '';

    if (chapter.choices && chapter.choices.length > 0) {
        chapter.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'story-choice';
            button.textContent = choice.text;
            button.onclick = () => makeChoice(choice, index);
            choicesEl.appendChild(button);
        });
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function makeChoice(choice, index) {
    currentStory.choicesMade.push({
        chapterId: currentStory.currentChapterId,
        choiceIndex: index
    });

    // Add small delay for better UX
    vibrate(30);

    setTimeout(() => {
        if (choice.next) {
            showChapter(choice.next);
        } else {
            finishStory();
        }
    }, 300);
}

async function finishStory() {
    // Complete mode
    await completeMode('story');

    // Award stars based on completion
    await addStars(10);

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    const achievements = await checkAchievements(progress);

    if (achievements.length > 0) {
        showConfetti();
        achievements.forEach(achievement => {
            showToast(`🏆 ${achievement.name} upplåst!`, 'success');
        });
    }

    // Show completion message
    showToast('📖 Berättelsen slutförd! +10 stjärnor!', 'success');
    showConfetti();

    // Go back to home after a delay
    setTimeout(() => {
        showScreen('home-screen');
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const storyModeBtn = document.querySelector('[data-mode="story"]');
    if (storyModeBtn) {
        storyModeBtn.addEventListener('click', () => {
            showScreen('story-screen');
            initStoryMode();
        });
    }
});
