const STORAGE_KEYS = {
    highScores: "keyboardJumpHighScores",
    settings: "rtgSettings"
};

const WORD_BANK = {
    easyWords: {
        1: [
            "cat", "dog", "sun", "hat", "jam", "red", "cup", "duck", "map", "pen",
            "box", "bed", "leg", "run", "top", "sit", "bat", "bus", "pig", "fox",
            "ant", "bee", "car", "day", "ear", "fan", "gas", "hen", "ice", "jet",
            "key", "lip", "man", "net", "owl", "pan", "rat", "sea", "toy", "van"
        ],
        2: [
            "lamp", "fish", "cake", "frog", "milk", "ring", "book", "hand", "tree", "flag",
            "desk", "shoe", "farm", "star", "moon", "boat", "rain", "hill", "road", "wind",
            "seed", "leaf", "bird", "nest", "snow", "park", "train", "bread", "chair", "apple",
            "river", "stone", "smile", "green", "cloud", "plant", "brush", "clock", "grape", "house"
        ],
        3: [
            "apple", "yellow", "school", "planet", "garden", "rabbit", "window", "basket", "rocket", "purple",
            "animal", "friend", "morning", "sister", "brother", "teacher", "holiday", "village", "kitchen", "blanket",
            "sunrise", "picture", "library", "monster", "feather", "diamond", "journey", "button", "capture", "traffic"
        ],
        default: [
            "cat", "dog", "sun", "hat", "jam", "red", "cup", "duck", "map", "pen",
            "box", "bed", "leg", "run", "top", "sit", "bat", "bus", "pig", "fox"
        ]
    },

    hardWords: {
        1: [
            "planet", "silver", "rocket", "winter", "basket", "button", "magnet", "soccer", "parade", "rabbit",
            "teacher", "retreat", "capture", "diamond", "feather", "journey", "library", "monster", "picture", "traffic",
            "victory", "weather", "academy", "balance", "careful", "dancing", "emerald", "farmyard", "gentle", "harvest"
        ],
        2: [
            "parade", "nickel", "teacher", "retreat", "phoenix", "brutal", "french", "virus", "source", "flower",
            "pressure", "deserve", "supreme", "maintain", "attempt", "airfare", "kuwait", "capture", "fortune", "glacier",
            "observe", "journey", "victory", "diamond", "kingdom", "library", "monster", "natural", "orchard", "passenger"
        ],
        3: [
            "pressure", "deserve", "supreme", "maintain", "attempt", "airfare", "kuwait", "source", "capture", "fortune",
            "festival", "triangle", "syndrome", "chamber", "genuine", "normal", "diamond", "observe", "journey", "victory"
        ],
        default: [
            "teacher", "retreat", "attempt", "pressure", "normal", "source", "virus", "french", "capture", "fortune",
            "festival", "triangle", "syndrome", "chamber", "genuine", "diamond", "observe", "journey", "victory", "kingdom"
        ]
    },

    homeRow: {
        default: [
            "sad", "dad", "fall", "ask", "flash", "alfalfa", "salad", "all", "lad", "flask",
            "dash", "glass", "half", "shall", "fad", "lass", "adds", "falls", "asks", "salsa"
        ]
    },

    topRow: {
        default: [
            "type", "quiet", "power", "tower", "writer", "pretty", "riot", "pie", "wept", "port",
            "tree", "tire", "were", "peer", "rope", "route", "outer", "trio", "query", "twit"
        ]
    },

    bottomRow: {
        default: [
            "zoo", "zoom", "xray", "vivid", "banana", "magic", "civic", "maze", "cabin", "vase",
            "crazy", "mix", "buzz", "vacuum", "zinc", "cacao", "maxim", "amaze", "zebra", "comma"
        ]
    }
};

const DEFAULT_STATE = {
    grade: 1,
    difficulty: "easy",
    lesson: "easyWords",
    typingMode: "normal",

    score: 0,
    lives: 8,
    maxLives: 8,

    started: false,
    paused: false,
    finished: false,

    duration: 60,
    timeLeft: 60,
    elapsedSeconds: 0,

    sfxEnabled: true,
    musicEnabled: true,

    currentPlatformIndex: 0,
    completedWords: 0,
    totalWordsThisRun: 0,

    queue: [],
    usedWords: [],
    platforms: [],

    currentJumpAnimationId: 0
};

const ui = {
    menuScreen: document.getElementById("menuScreen"),
    gameScreen: document.getElementById("gameScreen"),
    resultScreen: document.getElementById("resultScreen"),

    leftGameHud: document.getElementById("leftGameHud"),
    rightGameHud: document.getElementById("rightGameHud"),

    platformLayer: document.getElementById("platformLayer"),
    playerCharacter: document.getElementById("playerCharacter"),
    typingInput: document.getElementById("typingInput"),
    feedbackMessage: document.getElementById("feedbackMessage"),

    scoreValue: document.getElementById("scoreValue"),
    livesRow: document.getElementById("livesRow"),
    progressFill: document.getElementById("progressFill"),

    finalScore: document.getElementById("finalScore"),
    finalTimePlayed: document.getElementById("finalTimePlayed"),

    startGameBtn: document.getElementById("startGameBtn"),
    submitWordBtn: document.getElementById("submitWordBtn"),
    pauseGameBtn: document.getElementById("pauseGameBtn"),
    backToMenuBtn: document.getElementById("backToMenuBtn"),
    playAgainBtn: document.getElementById("playAgainBtn"),
    resultMenuBtn: document.getElementById("resultMenuBtn"),

    gradeButtons: document.querySelectorAll(".grade-btn"),
    difficultyButtons: document.querySelectorAll(".option-btn"),
    lessonButtons: document.querySelectorAll(".lesson-btn"),
    typingModeButtons: document.querySelectorAll(".typing-mode-btn"),

    sfxToggleBtn: document.getElementById("sfxToggleBtn"),
    musicToggleBtn: document.getElementById("musicToggleBtn"),

    bgMusic: document.getElementById("bgMusic"),
    jumpSound: document.getElementById("jumpSound"),
    wrongSound: document.getElementById("wrongSound"),
    winSound: document.getElementById("winSound")
};

let state = {...DEFAULT_STATE };
let gameTimerId = null;

/* ----------------------------- helpers ----------------------------- */

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function reverseWord(word) {
    return String(word).split("").reverse().join("");
}

function getDisplayedWord(word) {
    return state.typingMode === "reverse" ? reverseWord(word) : word;
}

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setFeedback(message) {
    if (ui.feedbackMessage) {
        ui.feedbackMessage.textContent = message;
    }
}

function setText(element, value) {
    if (element) {
        element.textContent = String(value);
    }
}

function getStageRect() {
    if (!ui.platformLayer) {
        return { width: 1100, height: 680 };
    }

    const rect = ui.platformLayer.getBoundingClientRect();
    return {
        width: rect.width || 1100,
        height: rect.height || 680
    };
}

/* ----------------------------- settings / audio ----------------------------- */

function applySavedTheme() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    document.body.classList.remove("theme-blue", "theme-green", "high-contrast");

    if (settings.theme === "blue") document.body.classList.add("theme-blue");
    if (settings.theme === "green") document.body.classList.add("theme-green");
    if (settings.highContrast) document.body.classList.add("high-contrast");

    if (settings.fontSize) {
        const size = Number(settings.fontSize);
        if (!Number.isNaN(size) && size > 0) {
            document.documentElement.style.fontSize = `${size}px`;
        }
    }
}

function loadAudioSettings() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    if (typeof settings.jumpSfxEnabled === "boolean") state.sfxEnabled = settings.jumpSfxEnabled;
    if (typeof settings.jumpMusicEnabled === "boolean") state.musicEnabled = settings.jumpMusicEnabled;
}

function saveAudioSettings() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    settings.jumpSfxEnabled = state.sfxEnabled;
    settings.jumpMusicEnabled = state.musicEnabled;
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function playSound(audioEl) {
    if (!state.sfxEnabled || !audioEl) return;

    try {
        audioEl.pause();
        audioEl.currentTime = 0;
        const promise = audioEl.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {});
        }
    } catch {}
}

function updateMusicPlayback() {
    if (!ui.bgMusic) return;

    if (state.musicEnabled && state.started && !state.finished && !state.paused) {
        try {
            ui.bgMusic.volume = 0.35;
            ui.bgMusic.loop = true;
            const promise = ui.bgMusic.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(() => {
                    setFeedback("Music is blocked until you interact with the page.");
                });
            }
        } catch {
            setFeedback("Background music could not be started.");
        }
    } else {
        ui.bgMusic.pause();
    }
}

function updateSoundButtons() {
    if (ui.sfxToggleBtn) {
        ui.sfxToggleBtn.setAttribute("aria-pressed", String(state.sfxEnabled));
        ui.sfxToggleBtn.style.opacity = state.sfxEnabled ? "1" : "0.6";
    }

    if (ui.musicToggleBtn) {
        ui.musicToggleBtn.setAttribute("aria-pressed", String(state.musicEnabled));
        ui.musicToggleBtn.style.opacity = state.musicEnabled ? "1" : "0.6";
    }
}

/* ----------------------------- high scores ----------------------------- */

function getHighScores() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.highScores), []);
}

function saveHighScores(scores) {
    localStorage.setItem(STORAGE_KEYS.highScores, JSON.stringify(scores));
}

function saveResult() {
    const scores = getHighScores();

    scores.push({
        score: state.score,
        grade: state.grade,
        difficulty: state.difficulty,
        lesson: state.lesson,
        typingMode: state.typingMode,
        timePlayed: state.elapsedSeconds,
        playedAt: new Date().toISOString()
    });

    scores.sort((a, b) => (b.score || 0) - (a.score || 0));
    saveHighScores(scores.slice(0, 20));
}

/* ----------------------------- game data ----------------------------- */

function getDifficultySettings(difficulty) {
    switch (difficulty) {
        case "medium":
            return { duration: 70, lives: 8, wordCount: 8 };
        case "hard":
            return { duration: 80, lives: 8, wordCount: 10 };
        case "easy":
        default:
            return { duration: 60, lives: 8, wordCount: 6 };
    }
}

function getWordPool() {
    const lesson = WORD_BANK[state.lesson] || WORD_BANK.easyWords;
    return lesson[state.grade] || lesson.default || [];
}

function refillQueue() {
    const pool = getWordPool();

    const freshWords = pool.filter((word) => !state.usedWords.includes(word.toLowerCase()));

    if (freshWords.length > 0) {
        state.queue = shuffleArray(freshWords);
        return;
    }

    state.usedWords = [];
    state.queue = shuffleArray(pool);
}

function getNextWord() {
    if (state.queue.length === 0) {
        refillQueue();
    }

    if (state.queue.length === 0) {
        return null;
    }

    const word = state.queue.shift();
    state.usedWords.push(word.toLowerCase());
    return word;
}

/* ----------------------------- screens / hud ----------------------------- */

function updateGameHudVisibility() {
    const show = state.started && !state.finished;

    if (ui.leftGameHud) ui.leftGameHud.classList.toggle("hidden", !show);
    if (ui.rightGameHud) ui.rightGameHud.classList.toggle("hidden", !show);
}

function showScreen(screen) {
    if (ui.menuScreen) ui.menuScreen.classList.add("hidden");
    if (ui.gameScreen) ui.gameScreen.classList.add("hidden");
    if (ui.resultScreen) ui.resultScreen.classList.add("hidden");
    if (screen) screen.classList.remove("hidden");

    updateGameHudVisibility();
}

function updateScore() {
    setText(ui.scoreValue, state.score.toLocaleString());
}

function updateLives() {
    if (!ui.livesRow) return;

    const hearts = ui.livesRow.querySelectorAll(".heart");
    hearts.forEach((heart, index) => {
        heart.classList.toggle("active", index < state.lives);
    });
}

function updateProgress() {
    if (!ui.progressFill) return;

    const total = Math.max(1, state.totalWordsThisRun);
    const percent = clamp((state.completedWords / total) * 100, 0, 100);
    ui.progressFill.style.height = `${percent}%`;
}

function updatePauseButton() {
    if (!ui.pauseGameBtn) return;
    ui.pauseGameBtn.textContent = state.paused ? "Resume" : "Pause";
}

function updateHud() {
    updateScore();
    updateLives();
    updateProgress();
    updatePauseButton();
}

/* ----------------------------- platforms ----------------------------- */

function createPlatformLayout(wordCount) {
    const { width, height } = getStageRect();

    const isPhone = width <= 430;
    const isSmall = width <= 760;

    let layout;

    if (isPhone) {
        layout = {
            6: [
                { left: 0.22, top: 0.76, width: 0.22 },
                { left: 0.48, top: 0.62, width: 0.22 },
                { left: 0.72, top: 0.48, width: 0.22 },
                { left: 0.34, top: 0.42, width: 0.22 },
                { left: 0.63, top: 0.30, width: 0.22 },
                { left: 0.42, top: 0.20, width: 0.22 }
            ],
            8: [
                { left: 0.18, top: 0.78, width: 0.20 },
                { left: 0.45, top: 0.66, width: 0.20 },
                { left: 0.72, top: 0.54, width: 0.20 },
                { left: 0.30, top: 0.45, width: 0.20 },
                { left: 0.60, top: 0.36, width: 0.20 },
                { left: 0.82, top: 0.27, width: 0.18 },
                { left: 0.38, top: 0.23, width: 0.20 },
                { left: 0.66, top: 0.16, width: 0.20 }
            ],
            10: [
                { left: 0.18, top: 0.80, width: 0.19 },
                { left: 0.42, top: 0.70, width: 0.19 },
                { left: 0.68, top: 0.60, width: 0.19 },
                { left: 0.28, top: 0.51, width: 0.19 },
                { left: 0.56, top: 0.43, width: 0.19 },
                { left: 0.80, top: 0.35, width: 0.17 },
                { left: 0.36, top: 0.30, width: 0.19 },
                { left: 0.62, top: 0.24, width: 0.19 },
                { left: 0.24, top: 0.18, width: 0.19 },
                { left: 0.52, top: 0.13, width: 0.19 }
            ]
        };
    } else if (isSmall) {
        layout = {
            6: [
                { left: 0.12, top: 0.76, width: 0.18 },
                { left: 0.30, top: 0.60, width: 0.18 },
                { left: 0.52, top: 0.70, width: 0.18 },
                { left: 0.67, top: 0.50, width: 0.18 },
                { left: 0.74, top: 0.34, width: 0.18 },
                { left: 0.42, top: 0.24, width: 0.18 }
            ],
            8: [
                { left: 0.10, top: 0.78, width: 0.17 },
                { left: 0.25, top: 0.66, width: 0.17 },
                { left: 0.42, top: 0.54, width: 0.17 },
                { left: 0.60, top: 0.42, width: 0.17 },
                { left: 0.76, top: 0.30, width: 0.17 },
                { left: 0.50, top: 0.72, width: 0.17 },
                { left: 0.70, top: 0.56, width: 0.17 },
                { left: 0.34, top: 0.30, width: 0.17 }
            ],
            10: [
                { left: 0.08, top: 0.80, width: 0.16 },
                { left: 0.21, top: 0.70, width: 0.16 },
                { left: 0.36, top: 0.58, width: 0.16 },
                { left: 0.52, top: 0.46, width: 0.16 },
                { left: 0.68, top: 0.34, width: 0.16 },
                { left: 0.78, top: 0.54, width: 0.16 },
                { left: 0.56, top: 0.70, width: 0.16 },
                { left: 0.32, top: 0.38, width: 0.16 },
                { left: 0.48, top: 0.25, width: 0.16 },
                { left: 0.66, top: 0.16, width: 0.16 }
            ]
        };
    } else {
        layout = {
            6: [
                { left: 0.08, top: 0.78, width: 0.17 },
                { left: 0.24, top: 0.60, width: 0.16 },
                { left: 0.42, top: 0.73, width: 0.17 },
                { left: 0.60, top: 0.50, width: 0.16 },
                { left: 0.76, top: 0.34, width: 0.16 },
                { left: 0.84, top: 0.60, width: 0.14 }
            ],
            8: [
                { left: 0.04, top: 0.80, width: 0.15 },
                { left: 0.16, top: 0.66, width: 0.15 },
                { left: 0.30, top: 0.50, width: 0.16 },
                { left: 0.45, top: 0.33, width: 0.16 },
                { left: 0.56, top: 0.66, width: 0.16 },
                { left: 0.70, top: 0.48, width: 0.15 },
                { left: 0.81, top: 0.30, width: 0.15 },
                { left: 0.88, top: 0.58, width: 0.11 }
            ],
            10: [
                { left: 0.03, top: 0.82, width: 0.14 },
                { left: 0.13, top: 0.70, width: 0.14 },
                { left: 0.24, top: 0.56, width: 0.14 },
                { left: 0.35, top: 0.40, width: 0.15 },
                { left: 0.47, top: 0.72, width: 0.15 },
                { left: 0.58, top: 0.54, width: 0.14 },
                { left: 0.69, top: 0.34, width: 0.14 },
                { left: 0.79, top: 0.66, width: 0.13 },
                { left: 0.88, top: 0.46, width: 0.11 },
                { left: 0.74, top: 0.18, width: 0.14 }
            ]
        };
    }

    const selectedLayout = layout[wordCount] || layout[6];

    return selectedLayout.map((item, index) => {
        let platformWidth = Math.round(width * item.width);

        if (isPhone) {
            platformWidth = clamp(platformWidth, 70, 92);
        } else if (isSmall) {
            platformWidth = clamp(platformWidth, 90, 130);
        } else {
            platformWidth = clamp(platformWidth, 130, 220);
        }

        const safeLeft = isPhone ? 42 : isSmall ? 55 : 30;
        const safeRight = isPhone ? 42 : isSmall ? 55 : 30;

        let x = Math.round(width * item.left);
        let y = Math.round(height * item.top);

        x = clamp(x, safeLeft, width - platformWidth - safeRight);

        if (isPhone) {
            y = clamp(y, 95, height - 190);
        } else if (isSmall) {
            y = clamp(y, 100, height - 200);
        } else {
            y = clamp(y, 90, height - 150);
        }

        return {
            index,
            x,
            y,
            width: platformWidth
        };
    });
}

function clearPlatforms() {
    if (ui.platformLayer) {
        ui.platformLayer.innerHTML = "";
    }
    state.platforms = [];
}

function renderPlatforms() {
    if (!ui.platformLayer) return;

    ui.platformLayer.innerHTML = "";

    state.platforms.forEach((platform) => {
        const platformEl = document.createElement("div");
        platformEl.className = "platform";
        platformEl.style.left = `${platform.x}px`;
        platformEl.style.top = `${platform.y}px`;
        platformEl.style.width = `${platform.width}px`;

        const wordEl = document.createElement("div");
        wordEl.className = "platform-word";
        wordEl.textContent = platform.displayWord;

        /*
            This keeps the word inside the play area.
            It fixes the problem where the word is cut on the right side.
        */
        const stageSize = getStageRect();
        const isPhone = stageSize.width <= 430;

        const wordSafeSpace = isPhone ? 58 : 80;

        const wordLeft = clamp(
            platform.x + platform.width / 2,
            wordSafeSpace,
            stageSize.width - wordSafeSpace
        );

        wordEl.style.left = `${wordLeft}px`;
        wordEl.style.top = `${platform.y - 36}px`;
        wordEl.dataset.platformId = String(platform.id);

        platform.el = platformEl;
        platform.wordEl = wordEl;

        if (platform.cleared) {
            wordEl.style.opacity = "0.2";
            wordEl.style.textDecoration = "line-through";
        }

        ui.platformLayer.appendChild(platformEl);
        ui.platformLayer.appendChild(wordEl);
    });
}

function buildRunPlatforms() {
    const settings = getDifficultySettings(state.difficulty);
    const wordCount = settings.wordCount;
    const layout = createPlatformLayout(wordCount);

    state.platforms = layout.map((slot, idx) => {
        const word = getNextWord() || `word${idx + 1}`;
        return {
            id: idx + 1,
            x: slot.x,
            y: slot.y,
            width: slot.width,
            word,
            displayWord: getDisplayedWord(word),
            cleared: false,
            el: null,
            wordEl: null
        };
    });

    state.totalWordsThisRun = state.platforms.length;
}

/* ----------------------------- player movement ----------------------------- */

function setPlayerPositionByPlatform(platformIndex) {
    if (!ui.playerCharacter) return;

    const platform = state.platforms[platformIndex];
    if (!platform) return;

    const targetLeft = platform.x + platform.width / 2;
    const targetTop = platform.y - 92;

    ui.playerCharacter.style.transition = "none";
    ui.playerCharacter.style.left = `${targetLeft}px`;
    ui.playerCharacter.style.top = `${targetTop}px`;
    ui.playerCharacter.style.bottom = "auto";
}

function movePlayerToPlatform(platform) {
    if (!platform || !ui.playerCharacter) return;

    state.currentJumpAnimationId += 1;
    const animationId = state.currentJumpAnimationId;

    const currentLeft = parseFloat(ui.playerCharacter.style.left);
    const currentTop = parseFloat(ui.playerCharacter.style.top);

    const startLeft = Number.isFinite(currentLeft) ?
        currentLeft :
        state.platforms[0] ?
        state.platforms[0].x + state.platforms[0].width / 2 :
        100;

    const startTop = Number.isFinite(currentTop) ?
        currentTop :
        state.platforms[0] ?
        state.platforms[0].y - 92 :
        430;

    const endLeft = platform.x + platform.width / 2;
    const endTop = platform.y - 92;

    const distance = Math.hypot(endLeft - startLeft, endTop - startTop);
    const duration = clamp(420 + distance * 0.35, 450, 850);
    const jumpHeight = clamp(95 + distance * 0.12, 110, 190);
    const startTime = performance.now();

    ui.playerCharacter.style.transition = "none";

    function animateJump(now) {
        if (animationId !== state.currentJumpAnimationId) return;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const linearLeft = startLeft + (endLeft - startLeft) * progress;
        const linearTop = startTop + (endTop - startTop) * progress;
        const arcOffset = Math.sin(progress * Math.PI) * jumpHeight;
        const currentAnimatedTop = linearTop - arcOffset;

        ui.playerCharacter.style.left = `${linearLeft}px`;
        ui.playerCharacter.style.top = `${currentAnimatedTop}px`;
        ui.playerCharacter.style.bottom = "auto";

        if (progress < 1) {
            requestAnimationFrame(animateJump);
        } else {
            ui.playerCharacter.style.left = `${endLeft}px`;
            ui.playerCharacter.style.top = `${endTop}px`;
            ui.playerCharacter.style.bottom = "auto";
        }
    }

    requestAnimationFrame(animateJump);
}

/* ----------------------------- gameplay ----------------------------- */

function markPlatformComplete(platform) {
    platform.cleared = true;

    if (platform.wordEl) {
        platform.wordEl.style.opacity = "0.2";
        platform.wordEl.style.textDecoration = "line-through";
    }
}

function handleCorrectWord(platform) {
    markPlatformComplete(platform);
    movePlayerToPlatform(platform);

    const points = platform.word.length * 100;
    state.score += points;
    state.completedWords += 1;
    state.currentPlatformIndex = platform.id - 1;

    updateHud();
    setFeedback(`Great! You jumped to "${platform.displayWord}".`);
    playSound(ui.jumpSound);

    const allCleared = state.platforms.every((item) => item.cleared);
    if (allCleared) {
        playSound(ui.winSound);
        window.setTimeout(() => finishGame(), 500);
    }
}

function handleWrongWord(typedText) {
    state.lives -= 1;
    state.lives = Math.max(0, state.lives);

    updateHud();
    setFeedback(`"${typedText}" is not correct.`);
    playSound(ui.wrongSound);

    if (state.lives <= 0) {
        finishGame();
    }
}

function submitTypedWord() {
    if (!state.started || state.paused || state.finished || !ui.typingInput) return;

    const typed = ui.typingInput.value.trim().toLowerCase();
    if (!typed) return;

    const match = state.platforms.find((platform) => {
        if (platform.cleared) return false;

        const originalWord = platform.word.toLowerCase();
        const shownWord = platform.displayWord.toLowerCase();

        return typed === originalWord || typed === shownWord;
    });

    if (match) {
        handleCorrectWord(match);
    } else {
        handleWrongWord(typed);
    }

    ui.typingInput.value = "";
    ui.typingInput.focus();
}

function startTimer() {
    stopTimer();

    gameTimerId = window.setInterval(() => {
        if (!state.started || state.paused || state.finished) return;

        state.elapsedSeconds += 1;
        state.timeLeft -= 1;

        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            finishGame();
        }
    }, 1000);
}

function stopTimer() {
    if (gameTimerId) {
        clearInterval(gameTimerId);
        gameTimerId = null;
    }
}

function prepareGameSettings() {
    const settings = getDifficultySettings(state.difficulty);
    state.duration = settings.duration;
    state.timeLeft = settings.duration;
    state.elapsedSeconds = 0;
    state.maxLives = settings.lives;
    state.lives = settings.lives;
}

function resetRunState() {
    state.score = 0;
    state.currentPlatformIndex = 0;
    state.completedWords = 0;
    state.totalWordsThisRun = 0;
    state.queue = [];
    state.usedWords = [];
    state.platforms = [];
    state.currentJumpAnimationId = 0;
}

function startGame() {
    resetRunState();
    prepareGameSettings();

    state.started = true;
    state.paused = false;
    state.finished = false;

    buildRunPlatforms();
    renderPlatforms();
    updateHud();

    showScreen(ui.gameScreen);
    updateMusicPlayback();

    setPlayerPositionByPlatform(0);
    setFeedback("Type the word on a platform to jump there.");

    if (ui.typingInput) {
        ui.typingInput.value = "";
        ui.typingInput.focus();
    }

    startTimer();
}

function finishGame() {
    if (state.finished) return;

    state.finished = true;
    state.started = false;
    state.paused = false;

    stopTimer();
    updateMusicPlayback();
    saveResult();

    setText(ui.finalScore, state.score.toLocaleString());
    setText(ui.finalTimePlayed, formatTime(state.elapsedSeconds));

    showScreen(ui.resultScreen);
}

function backToMenu() {
    stopTimer();

    state.started = false;
    state.paused = false;
    state.finished = false;

    clearPlatforms();
    updateMusicPlayback();
    showScreen(ui.menuScreen);
    setFeedback("Choose your options and press Play.");
}

function togglePause() {
    if (!state.started || state.finished) return;

    state.paused = !state.paused;
    updatePauseButton();
    updateMusicPlayback();

    if (state.paused) {
        setFeedback("Game paused.");
    } else {
        setFeedback("Game resumed.");
        if (ui.typingInput) ui.typingInput.focus();
    }
}

/* ----------------------------- selection bindings ----------------------------- */

function bindSelectionButtons() {
    ui.gradeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.gradeButtons.forEach((item) => item.classList.remove("active"));
            btn.classList.add("active");
            state.grade = Number(btn.dataset.grade);
        });
    });

    ui.difficultyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.difficultyButtons.forEach((item) => item.classList.remove("selected"));
            btn.classList.add("selected");
            state.difficulty = btn.dataset.difficulty;
        });
    });

    ui.lessonButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.lessonButtons.forEach((item) => item.classList.remove("selected"));
            btn.classList.add("selected");
            state.lesson = btn.dataset.lesson;
        });
    });

    ui.typingModeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.typingModeButtons.forEach((item) => item.classList.remove("selected"));
            btn.classList.add("selected");
            state.typingMode = btn.dataset.typingMode;
        });
    });
}

/* ----------------------------- events ----------------------------- */

function bindEvents() {
    if (ui.startGameBtn) ui.startGameBtn.addEventListener("click", startGame);
    if (ui.submitWordBtn) ui.submitWordBtn.addEventListener("click", submitTypedWord);
    if (ui.pauseGameBtn) ui.pauseGameBtn.addEventListener("click", togglePause);
    if (ui.backToMenuBtn) ui.backToMenuBtn.addEventListener("click", backToMenu);
    if (ui.playAgainBtn) ui.playAgainBtn.addEventListener("click", startGame);
    if (ui.resultMenuBtn) ui.resultMenuBtn.addEventListener("click", backToMenu);

    if (ui.typingInput) {
        ui.typingInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitTypedWord();
            }
        });
    }

    if (ui.sfxToggleBtn) {
        ui.sfxToggleBtn.addEventListener("click", () => {
            state.sfxEnabled = !state.sfxEnabled;
            updateSoundButtons();
            saveAudioSettings();
        });
    }

    if (ui.musicToggleBtn) {
        ui.musicToggleBtn.addEventListener("click", () => {
            state.musicEnabled = !state.musicEnabled;
            updateSoundButtons();
            updateMusicPlayback();
            saveAudioSettings();
        });
    }

    window.addEventListener("resize", () => {
        if (state.started && !state.finished) {
            const previousPlatforms = state.platforms.map((platform) => ({
                word: platform.word,
                cleared: platform.cleared
            }));

            state.platforms = [];

            const settings = getDifficultySettings(state.difficulty);
            const layout = createPlatformLayout(settings.wordCount);

            state.platforms = layout.map((slot, idx) => {
                const previous = previousPlatforms[idx];
                const word = previous ? previous.word : getNextWord() || `word${idx + 1}`;

                return {
                    id: idx + 1,
                    x: slot.x,
                    y: slot.y,
                    width: slot.width,
                    word,
                    displayWord: getDisplayedWord(word),
                    cleared: previous ? previous.cleared : false,
                    el: null,
                    wordEl: null
                };
            });

            renderPlatforms();

            const currentPlatform =
                state.platforms.find((platform) => platform.id - 1 === state.currentPlatformIndex) ||
                state.platforms.find((platform) => !platform.cleared) ||
                state.platforms[0];

            if (currentPlatform) {
                setPlayerPositionByPlatform(currentPlatform.id - 1);
            }
        }
    });

    bindSelectionButtons();
}

/* ----------------------------- init ----------------------------- */

function init() {
    applySavedTheme();
    state = {...DEFAULT_STATE };
    loadAudioSettings();
    updateSoundButtons();
    updateHud();
    showScreen(ui.menuScreen);
    setFeedback("Choose your options and press Play.");
    bindEvents();
}

document.addEventListener("DOMContentLoaded", init);