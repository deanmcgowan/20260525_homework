// Drawing Mode Implementation

let currentDrawing = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    currentColor: '#1F2937',
    currentPrompt: ''
};

function initDrawMode() {
    currentDrawing.canvas = document.getElementById('drawing-canvas');
    currentDrawing.ctx = currentDrawing.canvas.getContext('2d');
    currentDrawing.currentPrompt = getRandomItems(DRAWING_PROMPTS, 1)[0];

    // Set canvas size
    const container = currentDrawing.canvas.parentElement;
    currentDrawing.canvas.width = container.clientWidth - 40;
    currentDrawing.canvas.height = 400;

    // Set drawing properties
    currentDrawing.ctx.strokeStyle = currentDrawing.currentColor;
    currentDrawing.ctx.lineWidth = 3;
    currentDrawing.ctx.lineCap = 'round';
    currentDrawing.ctx.lineJoin = 'round';

    // Show prompt
    document.getElementById('draw-prompt').textContent = currentDrawing.currentPrompt;

    // Clear canvas
    clearCanvas();

    // Add event listeners
    setupDrawingListeners();
}

function setupDrawingListeners() {
    const canvas = currentDrawing.canvas;

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStartDraw);
    canvas.addEventListener('touchmove', handleTouchMoveDraw);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    currentDrawing.isDrawing = true;
    const rect = currentDrawing.canvas.getBoundingClientRect();
    currentDrawing.lastX = e.clientX - rect.left;
    currentDrawing.lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!currentDrawing.isDrawing) return;

    const rect = currentDrawing.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentDrawing.ctx.beginPath();
    currentDrawing.ctx.moveTo(currentDrawing.lastX, currentDrawing.lastY);
    currentDrawing.ctx.lineTo(x, y);
    currentDrawing.ctx.stroke();

    currentDrawing.lastX = x;
    currentDrawing.lastY = y;
}

function stopDrawing() {
    currentDrawing.isDrawing = false;
}

function handleTouchStartDraw(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = currentDrawing.canvas.getBoundingClientRect();
    currentDrawing.isDrawing = true;
    currentDrawing.lastX = touch.clientX - rect.left;
    currentDrawing.lastY = touch.clientY - rect.top;
}

function handleTouchMoveDraw(e) {
    e.preventDefault();
    if (!currentDrawing.isDrawing) return;

    const touch = e.touches[0];
    const rect = currentDrawing.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    currentDrawing.ctx.beginPath();
    currentDrawing.ctx.moveTo(currentDrawing.lastX, currentDrawing.lastY);
    currentDrawing.ctx.lineTo(x, y);
    currentDrawing.ctx.stroke();

    currentDrawing.lastX = x;
    currentDrawing.lastY = y;
}

function clearCanvas() {
    currentDrawing.ctx.fillStyle = '#FFFFFF';
    currentDrawing.ctx.fillRect(0, 0, currentDrawing.canvas.width, currentDrawing.canvas.height);
}

function changeColor(color) {
    currentDrawing.currentColor = color;
    currentDrawing.ctx.strokeStyle = color;

    // Update active button
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

async function handleSaveDrawing() {
    try {
        // Convert canvas to data URL
        const dataURL = currentDrawing.canvas.toDataURL('image/png');

        // Save to storage using the storage.js function
        await saveDrawing(dataURL, currentDrawing.currentPrompt);

        // Complete mode
        await completeMode('draw');

        // Award stars
        await addStars(2);

        // Update stats
        await updateStatsDisplay();

        // Check achievements
        const progress = await getProgress();
        const achievements = await checkAchievements(progress);

        if (achievements.length > 0) {
            showConfetti();
        }

        // Show success message
        showToast('🎨 Anteckning sparad! +2 stjärnor', 'success');
        vibrate(50);

        // Option to continue or go back
        setTimeout(() => {
            if (confirm('Vill du rita en till?')) {
                initDrawMode();
            } else {
                showScreen('home-screen');
            }
        }, 1500);
    } catch (error) {
        console.error('Error saving drawing:', error);
        showToast('⚠️ Kunde inte spara anteckning', 'error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const drawModeBtn = document.querySelector('[data-mode="draw"]');
    if (drawModeBtn) {
        drawModeBtn.addEventListener('click', () => {
            showScreen('draw-screen');
            setTimeout(initDrawMode, 100); // Small delay to ensure screen is rendered
        });
    }

    const clearBtn = document.getElementById('clear-canvas-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Är du säker på att du vill rensa?')) {
                clearCanvas();
            }
        });
    }

    const saveBtn = document.getElementById('save-drawing-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveDrawing);
    }

    // Color tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            if (color) {
                changeColor(color);
            }
        });
    });
});
