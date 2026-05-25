// Quiz Mode Implementation

let currentQuiz = {
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: null,
    timer: null
};

function initQuizMode() {
    // Generate quiz with 5 random questions
    currentQuiz.questions = getRandomItems(QUIZ_TEMPLATES, 5);
    currentQuiz.currentIndex = 0;
    currentQuiz.score = 0;
    currentQuiz.startTime = Date.now();

    // Start timer (5 minutes)
    startQuizTimer(300);

    // Show first question
    showQuizQuestion();
}

function startQuizTimer(seconds) {
    let remaining = seconds;
    const timerEl = document.getElementById('quiz-timer');

    function updateTimer() {
        timerEl.textContent = formatTime(remaining);
        remaining--;

        if (remaining < 0) {
            clearInterval(currentQuiz.timer);
            endQuiz();
        }
    }

    updateTimer();
    currentQuiz.timer = setInterval(updateTimer, 1000);
}

function showQuizQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentIndex];

    // Update progress
    document.getElementById('question-number').textContent =
        `Fråga ${currentQuiz.currentIndex + 1} av ${currentQuiz.questions.length}`;

    const progress = ((currentQuiz.currentIndex) / currentQuiz.questions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;

    // Show question
    document.getElementById('question-text').textContent = question.question;

    // Create answer options with randomized order
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    // Create array of options with their original indices
    const shuffledOptions = question.options.map((option, index) => ({
        text: option,
        originalIndex: index
    }));

    // Shuffle the options array
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = option.text;
        button.onclick = () => selectAnswer(option.originalIndex);
        optionsContainer.appendChild(button);
    });

    // Hide result
    document.getElementById('quiz-result').classList.add('hidden');
    document.querySelector('.quiz-content').style.display = 'block';
}

function selectAnswer(selectedIndex) {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const correct = selectedIndex === question.correct;

    // Visual feedback
    const options = document.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        option.disabled = true;
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !correct) {
            option.classList.add('incorrect');
            option.classList.add('shake');
        }
    });

    // Update score
    if (correct) {
        currentQuiz.score++;
        vibrate(50);
    } else {
        vibrate([50, 50, 50]);
    }

    // Record answer
    recordAnswer(currentQuiz.currentIndex, correct, question.kingId);

    // Show result
    setTimeout(() => {
        showQuizResult(correct);
    }, 1000);
}

function showQuizResult(correct) {
    document.querySelector('.quiz-content').style.display = 'none';
    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden');

    const iconEl = document.getElementById('result-icon');
    const titleEl = document.getElementById('result-title');
    const messageEl = document.getElementById('result-message');

    if (correct) {
        iconEl.textContent = '🎉';
        titleEl.textContent = 'Rätt svar!';
        messageEl.textContent = 'Bra jobbat! Du får en stjärna!';
        addStars(1).then(updateStatsDisplay);
    } else {
        iconEl.textContent = '💪';
        titleEl.textContent = 'Inte helt rätt';
        messageEl.textContent = 'Inget problem! Du lär dig mer för varje försök!';
    }

    // Update button
    const nextBtn = document.getElementById('next-question-btn');
    if (currentQuiz.currentIndex < currentQuiz.questions.length - 1) {
        nextBtn.textContent = 'Nästa Fråga →';
        nextBtn.onclick = nextQuestion;
    } else {
        nextBtn.textContent = 'Se Resultat 🎯';
        nextBtn.onclick = endQuiz;
    }
}

function nextQuestion() {
    currentQuiz.currentIndex++;
    showQuizQuestion();
}

async function endQuiz() {
    // Stop timer
    if (currentQuiz.timer) {
        clearInterval(currentQuiz.timer);
    }

    // Save completion
    await completeMode('quiz');

    // Update progress
    const progress = await getProgress();

    // Check for achievements
    const achievements = await checkAchievements(progress);
    if (achievements.length > 0) {
        showConfetti();
        achievements.forEach(achievement => {
            showToast(`🏆 ${achievement.name} upplåst!`, 'success');
        });
    }

    // Show final result
    document.querySelector('.quiz-content').style.display = 'none';
    const resultEl = document.getElementById('quiz-result');
    resultEl.classList.remove('hidden');

    const iconEl = document.getElementById('result-icon');
    const titleEl = document.getElementById('result-title');
    const messageEl = document.getElementById('result-message');

    iconEl.textContent = currentQuiz.score === currentQuiz.questions.length ? '🏆' : '⭐';
    titleEl.textContent = `${currentQuiz.score} av ${currentQuiz.questions.length} rätt!`;
    messageEl.textContent = getEncouragingMessage(currentQuiz.score, currentQuiz.questions.length);

    if (currentQuiz.score === currentQuiz.questions.length) {
        showConfetti();
    }

    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.textContent = '← Tillbaka till Meny';
    nextBtn.onclick = () => {
        showScreen('home-screen');
        updateStatsDisplay();
    };
}

// Event listener for quiz mode
document.addEventListener('DOMContentLoaded', () => {
    const quizModeBtn = document.querySelector('[data-mode="quiz"]');
    if (quizModeBtn) {
        quizModeBtn.addEventListener('click', () => {
            showScreen('quiz-screen');
            initQuizMode();
        });
    }
});
