// Audio Mode Implementation

let currentAudio = {
    stories: [],
    currentIndex: 0,
    isPlaying: false,
    audioElement: null
};

function initAudioMode() {
    currentAudio.stories = [...AUDIO_STORIES];
    currentAudio.currentIndex = 0;
    currentAudio.isPlaying = false;

    // Create audio element if it doesn't exist
    if (!currentAudio.audioElement) {
        currentAudio.audioElement = new Audio();

        // Event handlers for the audio element
        currentAudio.audioElement.addEventListener('ended', () => {
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
        });

        currentAudio.audioElement.addEventListener('error', (e) => {
            showToast('⚠️ Ett fel uppstod vid uppspelning', 'error');
            currentAudio.isPlaying = false;
            document.getElementById('play-audio-btn').style.display = 'inline-block';
            document.getElementById('pause-audio-btn').style.display = 'none';
        });
    }

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

function playAudio() {
    const story = currentAudio.stories[currentAudio.currentIndex];

    // Map king IDs to audio file names
    const audioFiles = {
        'gustaf-ii-adolf': 'gustaf_ii_adolf.mp3',
        'kristina': 'kristina.mp3',
        'karl-x-gustav': 'karl_x_gustav.mp3',
        'karl-xi': 'karl_xi.mp3',
        'karl-xii': 'karl_xii.mp3'
    };

    const audioFile = audioFiles[story.kingId];

    if (!audioFile) {
        showToast('⚠️ Ljudfil hittades inte', 'error');
        return;
    }

    // Set the audio source
    currentAudio.audioElement.src = `assets/audio/${audioFile}`;

    // Play the audio
    currentAudio.audioElement.play()
        .then(() => {
            currentAudio.isPlaying = true;

            // Update UI
            document.getElementById('play-audio-btn').style.display = 'none';
            document.getElementById('pause-audio-btn').style.display = 'inline-block';
        })
        .catch(error => {
            showToast('⚠️ Ett fel uppstod vid uppspelning', 'error');
            console.error('Audio playback error:', error);
        });
}

function pauseAudio() {
    if (currentAudio.audioElement && currentAudio.isPlaying) {
        currentAudio.audioElement.pause();
        currentAudio.isPlaying = false;

        // Update UI
        document.getElementById('play-audio-btn').style.display = 'inline-block';
        document.getElementById('pause-audio-btn').style.display = 'none';
    }
}

function stopAudio() {
    if (currentAudio.audioElement) {
        currentAudio.audioElement.pause();
        currentAudio.audioElement.currentTime = 0;
    }
    currentAudio.isPlaying = false;
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
