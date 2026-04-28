const STORAGE_KEYS = {
    highScores: "rtgHighScores",
    currentGame: "rtgCurrentGame",
    achievements: "rtgAchievements",
    achievementHistory: "rtgAchievementHistory",
    settings: "rtgSettings"
};

const COMMON_TEXTS = [
    "Golden trumpets announced dawn as soldiers assembled in neat rows. The cool air moved gently across the field while everyone prepared for the day ahead. Careful practice and steady focus helped each person stay calm and ready for the challenge.",
    "Practice every day and your speed will improve over time. Small improvements may seem slow at first, but they become powerful when repeated often. Accuracy, patience, and confidence work together to create strong typing habits.",
    "Typing backwards is strange at first but quickly becomes fun. The brain starts to notice patterns, and the hands begin to react more naturally. With enough repetition, even difficult words can feel familiar and manageable.",
    "Focus on accuracy before trying to move faster. A careful player usually performs better than someone who rushes without control. Clean input, good rhythm, and fewer mistakes will always lead to stronger final results."
];

const QUOTE_TEXTS = [
    "Success usually comes to those who are too busy to be looking for it. The future depends on what you do today, and even small actions can create meaningful change. Well begun is half done, so begin with purpose and continue with discipline.",
    "Great things are done by a series of small things brought together. Simplicity is the ultimate sophistication, and learning never exhausts the mind. Fortune often favors the brave, especially when courage is matched with preparation."
];

const CODE_TEXTS = [
    "const score = player.points + bonus; function startGame() { return true; } if (answer === expected) { score++; } let timer = 60; document.querySelector('#app');",
    "for (let i = 0; i < items.length; i++) { total += items[i]; } function updateDisplay(value) { console.log(value); } const isFinished = input === target;"
];

const NUMBER_TEXTS = [
    "2481 5309 7742 1906 4421 13579 24680 11223 44556 9090 8080 7070 6060 5050 12345 67890 24680 13579",
    "31415 92653 58979 32384 62643 38327 95028 84197 16939 93751 05820 97494 45923 07816"
];

const DEFAULT_GAME = {
    duration: 60,
    mode: "common",
    typingMode: "reverse",

    score: 0,
    errors: 0,
    totalTyped: 0,
    totalCorrect: 0,
    streak: 0,
    bestStreak: 0,
    testsCompleted: 0,
    achievementsCount: 0,

    timeLeft: 60,
    started: false,
    paused: false,
    finished: false,

    currentText: "",
    currentTarget: "",
    inputValue: "",
    roundStartTime: 0,

    computerEnabled: false,
    computerName: "Computer",
    computerScore: 0,
    computerWpm: 18,
    computerProgress: 0
};

const ui = {
    reverseModeBtn: document.getElementById("reverseModeBtn"),
    normalModeBtn: document.getElementById("normalModeBtn"),
    timeButtons: document.querySelectorAll(".time-btn"),
    extraModeButtons: document.querySelectorAll("[data-extra-mode]"),
    startBtn: document.getElementById("startBtn"),

    scoreValue: document.getElementById("scoreValue"),
    accuracyValue: document.getElementById("accuracyValue"),
    timerValue: document.getElementById("timerValue"),
    levelValue: document.getElementById("levelValue"),
    errorsValue: document.getElementById("errorsValue"),

    playerScoreValue: document.getElementById("playerScoreValue"),
    computerScoreValue: document.getElementById("computerScoreValue"),
    winnerValue: document.getElementById("winnerValue"),

    modeLabel: document.getElementById("modeLabel"),
    statusText: document.getElementById("statusText"),
    inputLabel: document.getElementById("inputLabel"),

    promptWrap: document.getElementById("promptWrap"),
    promptWord: document.getElementById("promptWord"),
    answerInput: document.getElementById("answerInput"),

    submitBtn: document.getElementById("submitBtn"),
    pauseBtn: document.getElementById("pauseBtn"),
    resumeBtn: document.getElementById("resumeBtn"),
    restartBtn: document.getElementById("restartBtn"),

    feedbackBox: document.getElementById("feedbackBox"),
    saveStatus: document.getElementById("saveStatus"),

    resultModal: document.getElementById("resultModal"),
    resultTitle: document.getElementById("resultTitle"),
    resultMessage: document.getElementById("resultMessage"),
    finalScoreValue: document.getElementById("finalScoreValue"),
    finalLevelValue: document.getElementById("finalLevelValue"),
    finalAccuracyValue: document.getElementById("finalAccuracyValue"),
    finalStreakValue: document.getElementById("finalStreakValue"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    playAgainBtn: document.getElementById("playAgainBtn"),

    streakSummary: document.getElementById("streakSummary"),
    testsSummary: document.getElementById("testsSummary"),
    achievementsSummary: document.getElementById("achievementsSummary"),

    keyboardKeys: document.querySelectorAll(".key[data-key]")
};

let state = {...DEFAULT_GAME };
let timerId = null;

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function getHighScores() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.highScores), []);
}

function saveHighScores(scores) {
    localStorage.setItem(STORAGE_KEYS.highScores, JSON.stringify(scores));
}

function getSavedGame() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.currentGame), null);
}

function saveCurrentGame() {
    const payload = {
        ...state,
        roundStartTime: state.roundStartTime || Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.currentGame, JSON.stringify(payload));
    setSaveStatus("Progress saved", false);
}

function clearCurrentGame() {
    localStorage.removeItem(STORAGE_KEYS.currentGame);
    setSaveStatus("No saved progress yet", true);
}

function getAchievementsCount() {
    const achievements = safeParse(localStorage.getItem(STORAGE_KEYS.achievements), []);
    return Array.isArray(achievements) ? achievements.length : 0;
}

function applySavedTheme() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    document.body.classList.remove("theme-blue", "theme-green", "high-contrast");

    if (settings.theme === "blue") document.body.classList.add("theme-blue");
    if (settings.theme === "green") document.body.classList.add("theme-green");
    if (settings.highContrast) document.body.classList.add("high-contrast");

    if (settings.fontSize) {
        document.documentElement.style.fontSize = `${Number(settings.fontSize)}px`;
    }
}

function applyHomeSelections() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    const selectedTime = Number(settings.homeSelectedTime);
    const selectedMode = settings.homeSelectedMode;
    const selectedPlayerMode = settings.homeSelectedPlayerMode;

    if (!Number.isNaN(selectedTime) && selectedTime > 0) {
        state.duration = selectedTime;
        state.timeLeft = selectedTime;
    }

    if (selectedMode === "normal") {
        state.mode = "quotes";
        state.typingMode = "normal";
    } else {
        state.mode = "common";
        state.typingMode = "reverse";
    }

    state.computerEnabled = selectedPlayerMode === "computer";
}

function getTextPool(mode) {
    switch (mode) {
        case "quotes":
            return QUOTE_TEXTS;
        case "code":
            return CODE_TEXTS;
        case "numbers":
            return NUMBER_TEXTS;
        case "custom":
            return COMMON_TEXTS;
        case "common":
        default:
            return COMMON_TEXTS;
    }
}

function pickRandomText(mode) {
    const pool = getTextPool(mode);
    return pool[Math.floor(Math.random() * pool.length)];
}

function reverseText(text) {
    return text.split("").reverse().join("");
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getTargetText(sourceText) {
    return state.typingMode === "reverse" ? reverseText(sourceText) : sourceText;
}

function formatSeconds(value) {
    const total = Math.max(0, Math.floor(value));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function getAccuracy() {
    if (state.totalTyped <= 0) return 100;
    return Math.max(0, Math.round((state.totalCorrect / state.totalTyped) * 100));
}

function getWpm() {
    const elapsedSeconds = Math.max(1, state.duration - state.timeLeft);
    const minutes = elapsedSeconds / 60;
    const correctChars = state.totalCorrect;
    return Math.max(0, Math.round(correctChars / 5 / minutes));
}

function getKps() {
    const elapsedSeconds = Math.max(1, state.duration - state.timeLeft);
    return Math.max(0, Math.round((state.totalTyped / elapsedSeconds) * 10) / 10);
}

function getComputerKps() {
    return (state.computerWpm / 60) * 5;
}

function updateComputerProgress() {
    if (!state.started || state.paused || state.finished || !state.computerEnabled) return;

    state.computerProgress += getComputerKps();

    while (state.computerProgress >= 1) {
        state.computerProgress -= 1;
        state.computerScore += 1;
    }
}

function getWinnerText() {
    if (!state.computerEnabled) return "Solo";

    if (state.score > state.computerScore) return "You win";
    if (state.score < state.computerScore) return `${state.computerName} wins`;
    return "Draw";
}

function updateSummary() {
    if (ui.streakSummary) ui.streakSummary.textContent = String(state.bestStreak);
    if (ui.testsSummary) ui.testsSummary.textContent = String(state.testsCompleted);
    if (ui.achievementsSummary) ui.achievementsSummary.textContent = String(state.achievementsCount);
}

function setFeedback(type, title, text) {
    if (!ui.feedbackBox) return;

    ui.feedbackBox.className = "feedback-box";
    if (type) ui.feedbackBox.classList.add(type);

    ui.feedbackBox.innerHTML = `
        <div class="feedback-title">${escapeHtml(title)}</div>
        <div class="feedback-text">${escapeHtml(text)}</div>
    `;
}

function setSaveStatus(text, warning = false) {
    if (!ui.saveStatus) return;
    ui.saveStatus.textContent = text;
    ui.saveStatus.className = "save-status";
    ui.saveStatus.style.opacity = warning ? "0.92" : "1";
}

function updateModeButtons() {
    if (ui.reverseModeBtn) {
        ui.reverseModeBtn.classList.toggle("active", state.mode === "common" && state.typingMode === "reverse");
    }

    if (ui.normalModeBtn) {
        ui.normalModeBtn.classList.toggle("active", state.mode === "quotes" && state.typingMode === "normal");
    }

    ui.extraModeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.extraMode === state.mode);
    });
}

function updateTimeButtons() {
    ui.timeButtons.forEach((button) => {
        const value = Number(button.dataset.time);
        button.classList.toggle("active", value === state.duration);
    });
}

function renderPrompt() {
    if (!ui.promptWord) return;

    const source = state.currentText || "";
    const target = state.currentTarget || "";
    const typed = state.inputValue || "";

    if (!state.started && !typed && !source) {
        ui.promptWord.innerHTML = `<span class="remaining">press start to begin</span>`;
        return;
    }

    if (!target) {
        ui.promptWord.innerHTML = `<span class="remaining">${escapeHtml(source || "press start to begin")}</span>`;
        return;
    }

    let firstErrorIndex = -1;

    for (let i = 0; i < typed.length; i += 1) {
        if (typed[i] !== target[i]) {
            firstErrorIndex = i;
            break;
        }
    }

    if (firstErrorIndex === -1) {
        const typedPart = target.slice(0, typed.length);
        const currentPart = target.slice(typed.length, typed.length + 1);
        const remainingPart = target.slice(typed.length + 1);

        ui.promptWord.innerHTML = `
            <span class="typed">${escapeHtml(typedPart)}</span><span class="current">${escapeHtml(currentPart)}</span><span class="remaining">${escapeHtml(remainingPart)}</span>
        `;
    } else {
        const correctPart = target.slice(0, firstErrorIndex);
        const wrongPart = target.slice(firstErrorIndex, typed.length);
        const remainingPart = target.slice(typed.length);

        ui.promptWord.innerHTML = `
            <span class="typed">${escapeHtml(correctPart)}</span><span class="error">${escapeHtml(wrongPart)}</span><span class="remaining">${escapeHtml(remainingPart)}</span>
        `;
    }
}

function updateStats() {
    if (ui.scoreValue) ui.scoreValue.textContent = String(getWpm());
    if (ui.accuracyValue) ui.accuracyValue.textContent = `${getAccuracy()}%`;
    if (ui.timerValue) ui.timerValue.textContent = formatSeconds(state.timeLeft);
    if (ui.levelValue) ui.levelValue.textContent = String(getKps());
    if (ui.errorsValue) ui.errorsValue.textContent = String(state.errors);

    if (ui.playerScoreValue) ui.playerScoreValue.textContent = String(state.score);

    if (ui.computerScoreValue) {
        ui.computerScoreValue.textContent = state.computerEnabled ? String(state.computerScore) : "-";
    }

    if (ui.winnerValue) {
        ui.winnerValue.textContent = getWinnerText();
    }

    if (ui.modeLabel) {
        ui.modeLabel.textContent = state.typingMode === "reverse" ? "REVERSE" : "NORMAL";
    }

    if (ui.statusText) {
        if (!state.started) {
            ui.statusText.textContent = "PRESS START TO BEGIN";
        } else if (state.paused) {
            ui.statusText.textContent = "PAUSED";
        } else if (state.finished) {
            ui.statusText.textContent = "FINISHED";
        } else {
            ui.statusText.textContent = "KEEP TYPING";
        }
    }

    if (ui.inputLabel) {
        ui.inputLabel.textContent = state.typingMode === "reverse" ? "TYPE BACKWARD" : "TYPE FORWARD";
    }

    if (ui.answerInput) {
        ui.answerInput.disabled = !state.started || state.paused || state.finished;
    }

    if (ui.submitBtn) {
        ui.submitBtn.disabled = !state.started || state.paused || state.finished;
    }

    if (ui.pauseBtn) {
        ui.pauseBtn.disabled = !state.started || state.paused || state.finished;
    }

    if (ui.resumeBtn) {
        ui.resumeBtn.disabled = !state.started || !state.paused || state.finished;
    }

    renderPrompt();
    updateSummary();
}

function loadNextParagraph() {
    const source = pickRandomText(state.mode);
    state.currentText = source;
    state.currentTarget = getTargetText(source);
    state.inputValue = "";

    if (ui.answerInput) {
        ui.answerInput.value = "";
        ui.answerInput.focus();
    }

    renderPrompt();
}

function updateProgressMetrics() {
    if (!ui.answerInput) return;

    const input = ui.answerInput.value;
    const target = state.currentTarget;
    const previousInput = state.inputValue;

    if (input.length > previousInput.length) {
        for (let i = previousInput.length; i < input.length; i += 1) {
            const typedChar = input[i];
            const targetChar = target[i];

            state.totalTyped += 1;

            if (typedChar === targetChar) {
                state.totalCorrect += 1;
                state.score += 1;
            } else {
                state.errors += 1;
            }
        }
    }

    state.inputValue = input;

    renderPrompt();
    updateStats();

    if (input === target && target.length > 0) {
        state.streak += 1;
        state.bestStreak = Math.max(state.bestStreak, state.streak);

        setFeedback("success", "Paragraph complete", "New paragraph loaded. Keep typing.");
        loadNextParagraph();
    }

    saveCurrentGame();
}

function buildScoreEntry() {
    return {
        score: state.score,
        computerScore: state.computerEnabled ? state.computerScore : 0,
        wpm: getWpm(),
        accuracy: getAccuracy(),
        bestStreak: state.bestStreak,
        mode: state.mode,
        typingMode: state.typingMode,
        errors: state.errors,
        winner: getWinnerText(),
        playedAt: new Date().toISOString()
    };
}

function saveResult() {
    const scores = getHighScores();
    scores.push(buildScoreEntry());

    scores.sort((a, b) => {
        if ((b.wpm || 0) !== (a.wpm || 0)) {
            return (b.wpm || 0) - (a.wpm || 0);
        }
        return (b.score || 0) - (a.score || 0);
    });

    saveHighScores(scores.slice(0, 25));
}

function openModal() {
    if (!ui.resultModal) return;

    if (ui.finalScoreValue) ui.finalScoreValue.textContent = String(state.score);
    if (ui.finalLevelValue) ui.finalLevelValue.textContent = state.computerEnabled ? String(state.computerScore) : "-";
    if (ui.finalAccuracyValue) ui.finalAccuracyValue.textContent = `${getAccuracy()}%`;
    if (ui.finalStreakValue) ui.finalStreakValue.textContent = getWinnerText();

    if (ui.resultTitle) ui.resultTitle.textContent = "Time Up";
    if (ui.resultMessage) {
        ui.resultMessage.textContent = "Your selected time has ended. Here is your final result.";
    }

    ui.resultModal.classList.add("show");
    ui.resultModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    if (!ui.resultModal) return;
    ui.resultModal.classList.remove("show");
    ui.resultModal.setAttribute("aria-hidden", "true");
}

function clearTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function finishGame() {
    if (state.finished) return;

    state.finished = true;
    state.started = false;
    state.paused = false;
    clearTimer();

    state.testsCompleted += 1;
    state.achievementsCount = getAchievementsCount();

    setFeedback("success", "Run complete", "Time is up. Review your results and start another test.");
    saveResult();
    clearCurrentGame();
    clearKeyboardHighlights();
    updateStats();
    openModal();
}

function startTimer() {
    clearTimer();

    timerId = setInterval(() => {
        if (!state.started || state.paused || state.finished) return;

        updateComputerProgress();
        state.timeLeft -= 1;

        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            updateStats();
            finishGame();
            return;
        }

        updateStats();
        saveCurrentGame();
    }, 1000);
}

function startGame() {
    closeModal();
    clearTimer();

    state.started = true;
    state.paused = false;
    state.finished = false;
    state.timeLeft = state.duration;
    state.score = 0;
    state.errors = 0;
    state.totalTyped = 0;
    state.totalCorrect = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.roundStartTime = Date.now();
    state.achievementsCount = getAchievementsCount();

    state.computerScore = 0;
    state.computerProgress = 0;
    state.computerWpm = 18 + Math.floor(Math.random() * 8);

    loadNextParagraph();

    if (ui.answerInput) {
        ui.answerInput.disabled = false;
        ui.answerInput.focus();
    }

    if (state.computerEnabled) {
        setFeedback("warning", "Started", "Type the paragraph until the timer ends. Beat the computer score.");
    } else {
        setFeedback("warning", "Started", "Type the paragraph until the timer ends.");
    }

    updateStats();
    saveCurrentGame();
    startTimer();
}

function restartGame() {
    clearTimer();
    clearKeyboardHighlights();

    const keepDuration = state.duration;
    const keepMode = state.mode;
    const keepTypingMode = state.typingMode;
    const keepTestsCompleted = state.testsCompleted;
    const keepComputerEnabled = state.computerEnabled;

    state = {
        ...DEFAULT_GAME,
        duration: keepDuration,
        timeLeft: keepDuration,
        mode: keepMode,
        typingMode: keepTypingMode,
        testsCompleted: keepTestsCompleted,
        achievementsCount: getAchievementsCount(),
        computerEnabled: keepComputerEnabled
    };

    if (ui.answerInput) ui.answerInput.value = "";

    closeModal();
    setFeedback("warning", "Ready", "Choose your options and press start.");
    clearCurrentGame();
    updateModeButtons();
    updateTimeButtons();
    updateStats();
}

function pauseGame() {
    if (!state.started || state.paused || state.finished) return;

    state.paused = true;
    clearKeyboardHighlights();
    setFeedback("warning", "Paused", "Press resume when you are ready to continue.");
    updateStats();
    saveCurrentGame();
}

function resumeGame() {
    if (!state.started || !state.paused || state.finished) return;

    state.paused = false;
    setFeedback("success", "Resumed", "Keep going.");
    updateStats();

    if (ui.answerInput) ui.answerInput.focus();
    saveCurrentGame();
}

function submitGame() {
    if (!state.started || state.paused || state.finished) return;
    setFeedback("warning", "Timed mode", "Keep typing until the selected time ends.");
}

function normalizeKeyValue(key) {
    if (!key) return "";

    const map = {
        " ": "space",
        Spacebar: "space",
        Space: "space",
        Enter: "enter",
        Backspace: "backspace",
        Tab: "tab",
        Shift: "shift",
        ShiftLeft: "shift",
        ShiftRight: "shift",
        Control: "ctrl",
        ControlLeft: "ctrl",
        ControlRight: "ctrl",
        Alt: "alt",
        AltLeft: "alt",
        AltRight: "alt",
        CapsLock: "capslock",
        Escape: "esc",
        ArrowUp: "arrowup",
        ArrowDown: "arrowdown",
        ArrowLeft: "arrowleft",
        ArrowRight: "arrowright"
    };

    if (map[key]) return map[key];
    return key.toLowerCase();
}

function clearKeyboardHighlights() {
    ui.keyboardKeys.forEach((key) => key.classList.remove("active"));
}

function setKeyboardKeyActive(keyValue, active = true) {
    const normalized = normalizeKeyValue(keyValue);
    if (!normalized) return;

    ui.keyboardKeys.forEach((key) => {
        const keyName = normalizeKeyValue(key.dataset.key);
        if (keyName === normalized) {
            key.classList.toggle("active", active);
        }
    });
}

function pulseTypedCharacter(char) {
    if (!char) return;

    const normalized = normalizeKeyValue(char);
    let matched = false;

    ui.keyboardKeys.forEach((key) => {
        const keyName = normalizeKeyValue(key.dataset.key);
        if (keyName === normalized) {
            matched = true;
            key.classList.add("active");
            window.setTimeout(() => key.classList.remove("active"), 160);
        }
    });

    if (!matched && char === " ") {
        setKeyboardKeyActive("space", true);
        window.setTimeout(() => setKeyboardKeyActive("space", false), 160);
    }
}

function restoreSavedGame() {
    const saved = getSavedGame();

    if (!saved) {
        state.achievementsCount = getAchievementsCount();
        updateSummary();
        updateModeButtons();
        updateTimeButtons();
        updateStats();
        return;
    }

    state = {
        ...DEFAULT_GAME,
        ...saved
    };

    state.achievementsCount = getAchievementsCount();

    if (ui.answerInput) {
        ui.answerInput.value = saved.inputValue || "";
    }

    if (state.started && !state.paused && !state.finished) {
        setFeedback("warning", "Progress restored", "Your previous session was loaded.");
        startTimer();
    } else if (state.paused) {
        setFeedback("warning", "Paused progress restored", "Resume when you are ready.");
    } else {
        setFeedback("warning", "Progress restored", "You can continue your last session.");
    }

    setSaveStatus("Saved progress loaded", false);
    updateModeButtons();
    updateTimeButtons();
    updateStats();
}

function bindEvents() {
    if (ui.startBtn) ui.startBtn.addEventListener("click", startGame);
    if (ui.pauseBtn) ui.pauseBtn.addEventListener("click", pauseGame);
    if (ui.resumeBtn) ui.resumeBtn.addEventListener("click", resumeGame);
    if (ui.restartBtn) ui.restartBtn.addEventListener("click", restartGame);
    if (ui.submitBtn) ui.submitBtn.addEventListener("click", submitGame);

    if (ui.promptWrap && ui.answerInput) {
        ui.promptWrap.addEventListener("click", () => {
            if (!ui.answerInput.disabled) {
                ui.answerInput.focus();
            }
        });
    }

    if (ui.answerInput) {
        ui.answerInput.addEventListener("input", () => {
            if (!state.started || state.paused || state.finished) return;

            updateProgressMetrics();

            const value = ui.answerInput.value;
            const lastChar = value[value.length - 1];
            pulseTypedCharacter(lastChar);
        });

        ui.answerInput.addEventListener("keydown", (event) => {
            if (!state.started || state.paused || state.finished) return;

            setKeyboardKeyActive(event.key, true);

            if (event.key === "Enter" && event.ctrlKey) {
                event.preventDefault();
                submitGame();
            }
        });

        ui.answerInput.addEventListener("keyup", (event) => {
            setKeyboardKeyActive(event.key, false);
        });

        ui.answerInput.addEventListener("blur", clearKeyboardHighlights);
    }

    document.addEventListener("keydown", (event) => {
        if (!state.started || state.paused || state.finished) return;
        setKeyboardKeyActive(event.key, true);
    });

    document.addEventListener("keyup", (event) => {
        setKeyboardKeyActive(event.key, false);
    });

    ui.timeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            state.duration = Number(button.dataset.time);
            state.timeLeft = state.duration;
            updateTimeButtons();
            updateStats();
        });
    });

    if (ui.reverseModeBtn) {
        ui.reverseModeBtn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            state.mode = "common";
            state.typingMode = "reverse";
            updateModeButtons();
            updateStats();
            setFeedback("warning", "Mode selected", "Common reverse typing is selected.");
        });
    }

    if (ui.normalModeBtn) {
        ui.normalModeBtn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            state.mode = "quotes";
            state.typingMode = "normal";
            updateModeButtons();
            updateStats();
            setFeedback("warning", "Mode selected", "Quotes normal typing is selected.");
        });
    }

    ui.extraModeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            state.mode = button.dataset.extraMode;
            state.typingMode = button.dataset.extraMode === "numbers" ? "normal" : "reverse";
            updateModeButtons();
            updateStats();
            setFeedback("warning", "Mode selected", `${button.textContent.trim()} mode is selected.`);
        });
    });

    if (ui.closeModalBtn) {
        ui.closeModalBtn.addEventListener("click", closeModal);
    }

    if (ui.playAgainBtn) {
        ui.playAgainBtn.addEventListener("click", () => {
            restartGame();
            startGame();
        });
    }

    if (ui.resultModal) {
        ui.resultModal.addEventListener("click", (event) => {
            if (event.target === ui.resultModal) {
                closeModal();
            }
        });
    }

    window.addEventListener("beforeunload", () => {
        if (state.started && !state.finished) {
            saveCurrentGame();
        }
    });
}

function init() {
    applySavedTheme();
    state = {...DEFAULT_GAME };
    applyHomeSelections();

    bindEvents();
    updateModeButtons();
    updateTimeButtons();
    updateStats();
    setFeedback("warning", "Ready", "Choose your options and press start.");
    restoreSavedGame();
}

document.addEventListener("DOMContentLoaded", init);