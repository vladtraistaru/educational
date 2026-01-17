// ===== State =====
const state = {
    scale: 100,
    cursorPositions: [50], // Percentage positions (0-100)
    maxCursors: 5,
    minCursors: 1,
    draggingCursor: null,
    language: 'en'
};

// ===== DOM Elements =====
const elements = {
    scaleSelect: document.getElementById('scale-select'),
    scaleEnd: document.getElementById('scale-end'),
    numberLine: document.getElementById('number-line'),
    segments: document.getElementById('segments'),
    cursors: document.getElementById('cursors'),
    tickMarks: document.getElementById('tick-marks'),
    segmentsList: document.getElementById('segments-list'),
    totalEquation: document.getElementById('total-equation'),
    addCursorBtn: document.getElementById('add-cursor'),
    removeCursorBtn: document.getElementById('remove-cursor'),
    resetBtn: document.getElementById('reset'),
    languageSelect: document.getElementById('language-select')
};

// ===== Initialization =====
function init() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('numberScaleLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        state.language = savedLanguage;
        elements.languageSelect.value = savedLanguage;
    }
    
    // Set initial scale from select
    state.scale = parseInt(elements.scaleSelect.value);
    
    // Bind events
    elements.scaleSelect.addEventListener('change', handleScaleChange);
    elements.addCursorBtn.addEventListener('click', addCursor);
    elements.removeCursorBtn.addEventListener('click', removeCursor);
    elements.resetBtn.addEventListener('click', resetCursors);
    elements.languageSelect.addEventListener('change', handleLanguageChange);
    
    // Global drag events
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    
    // Apply initial language
    applyLanguage();
    
    // Render initial state
    render();
}

// ===== Language Handling =====
function handleLanguageChange(e) {
    state.language = e.target.value;
    localStorage.setItem('numberScaleLanguage', state.language);
    applyLanguage();
    updateBreakdown(); // Re-render breakdown with new language
}

function applyLanguage() {
    const lang = translations[state.language];
    if (!lang) return;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (lang[key]) {
            el.textContent = lang[key];
        }
    });
    
    // Update page title
    document.title = lang.title;
}

function t(key) {
    return translations[state.language]?.[key] || key;
}

// ===== Scale Change =====
function handleScaleChange(e) {
    state.scale = parseInt(e.target.value);
    elements.scaleEnd.textContent = state.scale;
    renderTickMarks();
    updateDisplay();
}

// ===== Cursor Management =====
function addCursor() {
    if (state.cursorPositions.length >= state.maxCursors) return;
    
    // Find the largest gap and place new cursor there
    const sorted = [...state.cursorPositions].sort((a, b) => a - b);
    let maxGap = sorted[0]; // Gap from 0 to first cursor
    let insertPosition = sorted[0] / 2;
    
    for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1] - sorted[i];
        if (gap > maxGap) {
            maxGap = gap;
            insertPosition = sorted[i] + gap / 2;
        }
    }
    
    // Check gap from last cursor to 100
    const lastGap = 100 - sorted[sorted.length - 1];
    if (lastGap > maxGap) {
        insertPosition = sorted[sorted.length - 1] + lastGap / 2;
    }
    
    state.cursorPositions.push(insertPosition);
    render();
}

function removeCursor() {
    if (state.cursorPositions.length <= state.minCursors) return;
    state.cursorPositions.pop();
    render();
}

function resetCursors() {
    // Reset to default: 1 marker at 50%, scale 100
    state.cursorPositions = [50];
    state.scale = 100;
    elements.scaleSelect.value = '100';
    elements.scaleEnd.textContent = '100';
    render();
}

// ===== Drag Handling =====
function handleDragStart(e, index) {
    e.preventDefault();
    state.draggingCursor = index;
    const cursorEl = elements.cursors.children[index];
    if (cursorEl) cursorEl.classList.add('dragging');
}

function handleDrag(e) {
    if (state.draggingCursor === null) return;
    
    e.preventDefault();
    
    const rect = elements.numberLine.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    // Calculate percentage position
    let percent = ((clientX - rect.left) / rect.width) * 100;
    
    // Clamp to valid range (0-100 to allow full range)
    percent = Math.max(0, Math.min(100, percent));
    
    // Snap to integer values on the scale
    const scaleValue = (percent / 100) * state.scale;
    const snappedValue = Math.round(scaleValue);
    percent = (snappedValue / state.scale) * 100;
    
    // Prevent cursors from crossing each other
    const sorted = state.cursorPositions
        .map((p, i) => ({ pos: p, index: i }))
        .sort((a, b) => a.pos - b.pos);
    
    const sortedIndex = sorted.findIndex(s => s.index === state.draggingCursor);
    
    if (sortedIndex > 0) {
        const prevPos = sorted[sortedIndex - 1].pos;
        const minGap = (1 / state.scale) * 100; // At least 1 unit gap
        percent = Math.max(prevPos + minGap, percent);
    }
    
    if (sortedIndex < sorted.length - 1) {
        const nextPos = sorted[sortedIndex + 1].pos;
        const minGap = (1 / state.scale) * 100;
        percent = Math.min(nextPos - minGap, percent);
    }
    
    state.cursorPositions[state.draggingCursor] = percent;
    updateDisplay();
}

function handleDragEnd() {
    if (state.draggingCursor !== null) {
        const cursorEl = elements.cursors.children[state.draggingCursor];
        if (cursorEl) cursorEl.classList.remove('dragging');
        state.draggingCursor = null;
    }
}

// ===== Rendering =====
function render() {
    renderTickMarks();
    renderCursors();
    updateDisplay();
    updateButtonStates();
}

function renderTickMarks() {
    elements.tickMarks.innerHTML = '';
    
    // Determine tick spacing based on scale
    let majorStep, minorStep;
    if (state.scale <= 20) {
        majorStep = 5;
        minorStep = 1;
    } else if (state.scale <= 100) {
        majorStep = 10;
        minorStep = 5;
    } else if (state.scale <= 500) {
        majorStep = 50;
        minorStep = 10;
    } else {
        majorStep = 100;
        minorStep = 50;
    }
    
    for (let i = 0; i <= state.scale; i += minorStep) {
        const percent = (i / state.scale) * 100;
        const tick = document.createElement('div');
        tick.className = i % majorStep === 0 ? 'tick major' : 'tick minor';
        tick.style.left = `${percent}%`;
        
        // Add labels for major ticks (but not 0 and max as they're shown separately)
        if (i % majorStep === 0 && i !== 0 && i !== state.scale) {
            const label = document.createElement('span');
            label.className = 'tick-label';
            label.textContent = i;
            tick.appendChild(label);
        }
        
        elements.tickMarks.appendChild(tick);
    }
    
    elements.scaleEnd.textContent = state.scale;
}

function renderCursors() {
    elements.cursors.innerHTML = '';
    
    state.cursorPositions.forEach((pos, index) => {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.style.left = `${pos}%`;
        
        const value = document.createElement('span');
        value.className = 'cursor-value';
        value.textContent = Math.round((pos / 100) * state.scale);
        cursor.appendChild(value);
        
        // Mouse events
        cursor.addEventListener('mousedown', (e) => handleDragStart(e, index));
        
        // Touch events
        cursor.addEventListener('touchstart', (e) => handleDragStart(e, index), { passive: false });
        
        elements.cursors.appendChild(cursor);
    });
}

function updateDisplay() {
    updateSegments();
    updateCursorPositions();
    updateBreakdown();
}

function updateSegments() {
    elements.segments.innerHTML = '';
    
    // Sort cursor positions to create segments
    const sorted = [...state.cursorPositions].sort((a, b) => a - b);
    
    // Create segments
    const segmentPositions = [0, ...sorted, 100];
    
    for (let i = 0; i < segmentPositions.length - 1; i++) {
        const start = segmentPositions[i];
        const end = segmentPositions[i + 1];
        const width = end - start;
        
        const segment = document.createElement('div');
        segment.className = 'segment show-value';
        segment.style.width = `${width}%`;
        
        elements.segments.appendChild(segment);
    }
}

function updateCursorPositions() {
    const cursorEls = elements.cursors.children;
    
    state.cursorPositions.forEach((pos, index) => {
        if (cursorEls[index]) {
            cursorEls[index].style.left = `${pos}%`;
            const valueEl = cursorEls[index].querySelector('.cursor-value');
            if (valueEl) {
                valueEl.textContent = Math.round((pos / 100) * state.scale);
            }
        }
    });
}

function updateBreakdown() {
    const sorted = [...state.cursorPositions].sort((a, b) => a - b);
    const segmentPositions = [0, ...sorted, 100];
    
    // Calculate segment values
    const values = [];
    for (let i = 0; i < segmentPositions.length - 1; i++) {
        const start = (segmentPositions[i] / 100) * state.scale;
        const end = (segmentPositions[i + 1] / 100) * state.scale;
        values.push(Math.round(end - start));
    }
    
    // Update segments list
    elements.segmentsList.innerHTML = '';
    values.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'segment-item';
        item.innerHTML = `
            <div class="segment-color"></div>
            <span class="segment-label">${t('part')} ${index + 1}:</span>
            <span class="segment-number">${value}</span>
        `;
        elements.segmentsList.appendChild(item);
    });
    
    // Update equation
    const equation = values.join(' + ') + ' = ' + state.scale;
    elements.totalEquation.textContent = equation;
}

function updateButtonStates() {
    elements.addCursorBtn.disabled = state.cursorPositions.length >= state.maxCursors;
    elements.removeCursorBtn.disabled = state.cursorPositions.length <= state.minCursors;
}

// ===== Start App =====
document.addEventListener('DOMContentLoaded', init);
