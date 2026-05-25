// Audio Mode Implementation

let currentAudio = {
    stories: [],
    currentIndex: 0,
    isPlaying: false,
    utterance: null
};

function initAudioMode() {
    currentAudio.stories = [...AUDIO_STORIES];
    currentAudio.currentIndex = 0;
    currentAudio.isPlaying = false;

    showAudioStory();
}

function showAudioStory() {
    if (currentAudio.currentIndex >= currentAudio.stories.length) {
        finishAudioMode();
        return;
    }

    const story = currentAudio.stories[currentAudio.currentIndex];
    const king = KINGS.find(k => k.id === story.kingId);

    // Update display
    document.getElementById('audio-image').textContent = king.image;
    document.getElementById('audio-title').textContent = story.title;
    document.getElementById('audio-text').textContent = story.text;

    // Reset audio controls
    document.getElementById('play-audio-btn').style.display = 'inline-block';
    document.getElementById('pause-audio-btn').style.display = 'none';

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-audio-btn');
    const nextBtn = document.getElementById('next-audio-btn');

    prevBtn.disabled = currentAudio.currentIndex === 0;
    prevBtn.style.opacity = currentAudio.currentIndex === 0 ? '0.5' : '1';

    nextBtn.disabled = currentAudio.currentIndex === currentAudio.stories.length - 1;
    nextBtn.style.opacity = currentAudio.currentIndex === currentAudio.stories.length - 1 ? '0.5' : '1';

    // Stop any currently playing audio
    stopAudio();
}

let audioPlayer = null;

function playAudio() {
    const story = currentAudio.stories[currentAudio.currentIndex];

    // Skapa eller återanvänd audio-element
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.onended = () => {
            currentAudio.isPlaying = false;
            document.getElementById('play-audio-btn').style.display = 'inline-block';
            document.getElementById('pause-audio-btn').style.display = 'none';

            // Auto-advance to next story
            if (currentAudio.currentIndex < currentAudio.stories.length - 1) {
                setTimeout(() => {
                    currentAudio.currentIndex++;
                    showAudioStory();
                }, 1500);
            }
        };

        audioPlayer.onerror = () => {
            showToast('⚠️ Ett fel uppstod vid uppspelning', 'error');
            currentAudio.isPlaying = false;
            document.getElementById('play-audio-btn').style.display = 'inline-block';
            document.getElementById('pause-audio-btn').style.display = 'none';
        };
    }

    // Sätt rätt ljudfil baserat på kingId
    const audioFiles = {
        'gustaf-ii-adolf': 'assets/audio/gustaf_ii_adolf.mp3',
        'kristina': 'assets/audio/kristina.mp3',
        'karl-x-gustav': 'assets/audio/karl_x_gustav.mp3',
        'karl-xi': 'assets/audio/karl_xi.mp3',
        'karl-xii': 'assets/audio/karl_xii.mp3'
    };

    audioPlayer.src = audioFiles[story.kingId];
    audioPlayer.play();
    currentAudio.isPlaying = true;

    // Update UI
    document.getElementById('play-audio-btn').style.display = 'none';
    document.getElementById('pause-audio-btn').style.display = 'inline-block';
}

function pauseAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
    }
    currentAudio.isPlaying = false;

    // Update UI
    document.getElementById('play-audio-btn').style.display = 'inline-block';
    document.getElementById('pause-audio-btn').style.display = 'none';
}

function stopAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    currentAudio.isPlaying = false;
}

function highlightText() {
    const textEl = document.getElementById('audio-text');
    const text = textEl.textContent;

    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentSentence = 0;

    const interval = setInterval(() => {
        if (!currentAudio.isPlaying || currentSentence >= sentences.length) {
            clearInterval(interval);
            textEl.innerHTML = text; // Reset
            return;
        }

        // Highlight current sentence
        let html = '';
        sentences.forEach((sentence, index) => {
            if (index === currentSentence) {
                html += `<span style="background: #FEF3C7; padding: 2px 4px; border-radius: 3px;">${sentence}</span>`;
            } else {
                html += sentence;
            }
        });
        textEl.innerHTML = html;

        currentSentence++;
    }, 3000); // Approximate time per sentence
}

function prevStory() {
    if (currentAudio.currentIndex > 0) {
        currentAudio.currentIndex--;
        showAudioStory();
    }
}

function nextStory() {
    if (currentAudio.currentIndex < currentAudio.stories.length - 1) {
        currentAudio.currentIndex++;
        showAudioStory();
    }
}

async function finishAudioMode() {
    // Complete mode
    await completeMode('audio');

    // Award stars
    await addStars(5);

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    await checkAchievements(progress);

    // Show completion
    showToast('🎧 Alla berättelser avlyssnade! +5 stjärnor', 'success');

    // Go back to home
    setTimeout(() => {
        showScreen('home-screen');
    }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const audioModeBtn = document.querySelector('[data-mode="audio"]');
    if (audioModeBtn) {
        audioModeBtn.addEventListener('click', () => {
            showScreen('audio-screen');
            initAudioMode();
        });
    }

    const playBtn = document.getElementById('play-audio-btn');
    if (playBtn) {
        playBtn.addEventListener('click', playAudio);
    }

    const pauseBtn = document.getElementById('pause-audio-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseAudio);
    }

    const prevBtn = document.getElementById('prev-audio-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', prevStory);
    }

    const nextBtn = document.getElementById('next-audio-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStory);
    }
});

// Clean up on screen change
document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', stopAudio);
});
