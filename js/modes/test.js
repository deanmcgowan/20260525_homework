// Test Mode Implementation

let currentTest = {
    questions: [],
    currentIndex: 0,
    answers: {},
    startTime: null
};

function initTestMode() {
    // Use all questions (21 study + 8 extra = 29 total)
    currentTest.questions = [...ALL_QUESTIONS];
    currentTest.currentIndex = 0;
    currentTest.answers = {};
    currentTest.startTime = Date.now();

    // Load any existing answers
    loadTestAnswers();

    // Show first question
    showTestQuestion();
}

async function loadTestAnswers() {
    for (const question of currentTest.questions) {
        const answer = await getTestAnswer(question.id);
        if (answer) {
            currentTest.answers[question.id] = answer;
        }
    }
}

function showTestQuestion() {
    const question = currentTest.questions[currentTest.currentIndex];

    // Update progress
    document.getElementById('test-progress').textContent =
        `${currentTest.currentIndex + 1}/${currentTest.questions.length}`;

    // Show question
    document.getElementById('test-question').textContent =
        `${currentTest.currentIndex + 1}. ${question.question}`;

    // Show existing answer if any
    const answerField = document.getElementById('test-answer');
    answerField.value = currentTest.answers[question.id] || '';

    // Auto-focus for better UX
    answerField.focus();

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-test-btn');
    const nextBtn = document.getElementById('next-test-btn');
    const finishBtn = document.getElementById('finish-test-btn');

    prevBtn.disabled = currentTest.currentIndex === 0;
    prevBtn.style.opacity = currentTest.currentIndex === 0 ? '0.5' : '1';

    if (currentTest.currentIndex === currentTest.questions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    }
}

function saveCurrentAnswer() {
    const question = currentTest.questions[currentTest.currentIndex];
    const answer = document.getElementById('test-answer').value;

    currentTest.answers[question.id] = answer;
    saveTestAnswer(question.id, answer);
}

function prevTestQuestion() {
    if (currentTest.currentIndex > 0) {
        saveCurrentAnswer();
        currentTest.currentIndex--;
        showTestQuestion();
    }
}

function nextTestQuestion() {
    if (currentTest.currentIndex < currentTest.questions.length - 1) {
        saveCurrentAnswer();
        currentTest.currentIndex++;
        showTestQuestion();
    }
}

async function finishTest() {
    // Save current answer
    saveCurrentAnswer();

    // Count answered questions
    const answeredCount = Object.values(currentTest.answers).filter(a => a.trim()).length;

    if (answeredCount < currentTest.questions.length) {
        const proceed = confirm(
            `Du har besvarat ${answeredCount} av ${currentTest.questions.length} frågor. ` +
            `Vill du verkligen avsluta nu?`
        );

        if (!proceed) {
            return;
        }
    }

    // Complete mode
    await completeMode('test');

    // Award stars based on completion
    const completionRate = answeredCount / currentTest.questions.length;
    const stars = Math.ceil(completionRate * 10);
    await addStars(stars);

    // Update stats
    await updateStatsDisplay();

    // Check achievements
    const progress = await getProgress();
    await checkAchievements(progress);

    // Show result
    showToast(
        `✅ Test slutfört! ${answeredCount}/${currentTest.questions.length} frågor besvarade. +${stars} stjärnor`,
        'success'
    );

    if (answeredCount === currentTest.questions.length) {
        showConfetti();
    }

    // Optionally, show a review screen
    setTimeout(() => {
        if (confirm('Vill du se dina svar?')) {
            showTestReview();
        } else {
            clearTestAnswers();
            showScreen('home-screen');
        }
    }, 1500);
}

function showTestReview() {
    const testContent = document.querySelector('#test-screen .test-content');
    testContent.innerHTML = '<h2>Dina Svar</h2>';

    const reviewDiv = document.createElement('div');
    reviewDiv.style.cssText = 'padding: 20px; background: white; border-radius: 12px;';

    currentTest.questions.forEach((question, index) => {
        const answer = currentTest.answers[question.id] || '(Ej besvarat)';

        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = 'margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #E5E7EB;';

        questionDiv.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 8px;">${index + 1}. ${question.question}</p>
            <p style="color: #6B7280; margin-bottom: 8px;">Ditt svar: ${answer}</p>
            <p style="color: #10B981; font-size: 14px;">Facit: ${question.answer}</p>
        `;

        reviewDiv.appendChild(questionDiv);
    });

    testContent.appendChild(reviewDiv);

    const doneBtn = document.createElement('button');
    doneBtn.className = 'btn-primary btn-large';
    doneBtn.textContent = 'Klar ← Tillbaka till Meny';
    doneBtn.style.marginTop = '20px';
    doneBtn.onclick = () => {
        clearTestAnswers();
        showScreen('home-screen');
    };

    testContent.appendChild(doneBtn);

    // Hide other elements
    document.getElementById('test-progress').style.display = 'none';
    document.getElementById('prev-test-btn').style.display = 'none';
    document.getElementById('next-test-btn').style.display = 'none';
    document.getElementById('finish-test-btn').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const testModeBtn = document.querySelector('[data-mode="test"]');
    if (testModeBtn) {
        testModeBtn.addEventListener('click', () => {
            showScreen('test-screen');
            initTestMode();
        });
    }

    const prevBtn = document.getElementById('prev-test-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestQuestion);
    }

    const nextBtn = document.getElementById('next-test-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestQuestion);
    }

    const finishBtn = document.getElementById('finish-test-btn');
    if (finishBtn) {
        finishBtn.addEventListener('click', finishTest);
    }

    // Auto-save on typing
    const answerField = document.getElementById('test-answer');
    if (answerField) {
        answerField.addEventListener('input', debounce(saveCurrentAnswer, 500));
    }
});
