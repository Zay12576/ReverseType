const STORAGE_KEYS = {
    highScores: "circusTypingHighScores",
    settings: "rtgSettings"
};

const GAME_WORDS = {
    easyWords: {
        1: [
            "cat", "dog", "sun", "hat", "jam", "red", "cup", "duck", "map", "pen",
            "box", "bed", "leg", "run", "top", "sit", "bat", "bus", "pig", "fox",
            "ant", "bee", "car", "day", "ear", "fan", "gas", "hen", "ice", "jet",
            "key", "lip", "man", "net", "owl", "pan", "rat", "sea", "toy", "van",
            "wet", "yak", "zip", "mud", "nod", "rope", "cake", "fish", "milk", "frog"
        ],
        2: [
            "lamp", "fish", "cake", "frog", "milk", "ring", "book", "hand", "tree", "flag",
            "desk", "shoe", "farm", "star", "moon", "boat", "rain", "hill", "road", "wind",
            "seed", "leaf", "bird", "nest", "snow", "park", "train", "bread", "chair", "apple",
            "river", "stone", "smile", "green", "cloud", "plant", "brush", "clock", "grape", "house",
            "light", "water", "table", "tiger", "mouse", "piano", "shirt", "spoon", "beach", "happy"
        ],
        3: [
            "apple", "yellow", "school", "planet", "garden", "rabbit", "window", "basket", "rocket", "purple",
            "animal", "friend", "morning", "sister", "brother", "teacher", "holiday", "village", "kitchen", "blanket",
            "sunrise", "picture", "library", "monster", "feather", "diamond", "journey", "button", "capture", "traffic",
            "farmer", "bridge", "market", "silver", "orange", "winter", "summer", "marble", "pepper", "banana",
            "carrot", "forest", "hammer", "island", "jungle", "ladder", "magnet", "napkin", "office", "pocket"
        ],
        4: [
            "orange", "animal", "school", "friend", "market", "planet", "silver", "picnic", "button", "bridge",
            "capture", "diamond", "feather", "journey", "library", "monster", "teacher", "traffic", "victory", "weather",
            "advent", "balance", "careful", "dancing", "emerald", "farmyard", "gentle", "harvest", "imagine", "jasmine",
            "kingdom", "lantern", "miracle", "natural", "orchard", "passage", "quality", "rainbow", "shelter", "talent",
            "uniform", "velvet", "whisper", "yearbook", "zealous", "academy", "blanket", "comfort", "delight", "explore"
        ],
        5: [
            "teacher", "parade", "monkey", "camera", "rocket", "thunder", "library", "winter", "basket", "travel",
            "airport", "blanket", "capture", "diamond", "engineer", "festival", "giraffe", "harbour", "imagine", "journal",
            "kingdom", "lantern", "message", "natural", "orchard", "passenger", "quality", "railway", "science", "treasure",
            "umbrella", "village", "wildlife", "yesterday", "zebra", "adventure", "brilliant", "creative", "discovery", "elephant",
            "fountain", "grateful", "historic", "important", "kangaroo", "learning", "mountain", "notebook", "painting", "question"
        ],
        6: [
            "journey", "kingdom", "diamond", "victory", "monster", "observe", "glacier", "capture", "fortune", "culture",
            "academy", "balance", "bravery", "curious", "destiny", "elegant", "freedom", "gallery", "healthy", "improve",
            "justice", "kindness", "language", "machine", "nature", "opinion", "passion", "quarter", "respect", "special",
            "towards", "upgrade", "variety", "welcome", "ancient", "benefit", "comfort", "develop", "express", "fiction",
            "general", "honesty", "inspire", "journal", "kitchen", "liberty", "measure", "network", "organic", "purpose"
        ],
        7: [
            "creative", "powerful", "treasure", "wildlife", "adventure", "character", "marvelous", "discovery", "movement", "confident",
            "absolute", "building", "complete", "daughter", "evidence", "favorite", "generate", "historic", "increase", "judgment",
            "knowledge", "learning", "material", "narrative", "occasion", "parallel", "question", "resource", "solution", "together",
            "ultimate", "valuable", "wonderful", "activity", "birthday", "champion", "decision", "education", "friendly", "guidance",
            "heritage", "interest", "language", "memorial", "notebook", "ordinary", "position", "reaction", "strength", "triangle"
        ],
        8: [
            "education", "different", "community", "storybook", "wonderful", "basketball", "lightning", "pineapple", "knowledge", "important",
            "adventure", "beautiful", "character", "dangerous", "excellent", "favorite", "government", "happiness", "invention", "journeying",
            "kindhearted", "landscape", "meaningful", "neighbour", "opportunity", "performance", "questioning", "responsible", "successful", "technology",
            "understand", "volunteer", "watermelon", "youthful", "amazement", "brilliant", "celebrate", "determined", "encourage", "friendship",
            "generosity", "horizons", "imagination", "leadership", "motivation", "nutrition", "organizing", "positivity", "remarkable", "teamwork"
        ],
        default: [
            "cat", "dog", "sun", "hat", "jam", "red", "cup", "duck", "map", "pen",
            "box", "bed", "leg", "run", "top", "sit", "bat", "bus", "pig", "fox",
            "ant", "bee", "car", "day", "ear", "fan", "gas", "hen", "ice", "jet",
            "key", "lip", "man", "net", "owl", "pan", "rat", "sea", "toy", "van",
            "wet", "yak", "zip", "mud", "nod", "rope", "cake", "fish", "milk", "frog"
        ]
    },

    hardWords: {
        1: [
            "planet", "silver", "rocket", "winter", "basket", "button", "magnet", "soccer", "parade", "rabbit",
            "teacher", "retreat", "capture", "diamond", "feather", "journey", "library", "monster", "picture", "traffic",
            "victory", "weather", "academy", "balance", "careful", "dancing", "emerald", "farmyard", "gentle", "harvest",
            "imagine", "jasmine", "kingdom", "lantern", "miracle", "natural", "orchard", "passage", "quality", "rainbow",
            "shelter", "talent", "uniform", "velvet", "whisper", "yearbook", "zealous", "comfort", "delight", "explore"
        ],
        2: [
            "parade", "nickel", "teacher", "retreat", "phoenix", "brutal", "french", "virus", "source", "flower",
            "pressure", "deserve", "supreme", "maintain", "attempt", "airfare", "kuwait", "capture", "fortune", "glacier",
            "observe", "journey", "victory", "diamond", "kingdom", "library", "monster", "natural", "orchard", "passenger",
            "quality", "railway", "science", "treasure", "umbrella", "village", "wildlife", "yesterday", "zebra", "adventure",
            "brilliant", "creative", "discovery", "elephant", "fountain", "grateful", "historic", "important", "learning", "painting"
        ],
        3: [
            "pressure", "deserve", "supreme", "maintain", "attempt", "airfare", "kuwait", "source", "capture", "fortune",
            "festival", "triangle", "syndrome", "chamber", "genuine", "normal", "diamond", "observe", "journey", "victory",
            "creative", "powerful", "treasure", "wildlife", "adventure", "character", "marvelous", "discovery", "movement", "confident",
            "absolute", "building", "complete", "daughter", "evidence", "favorite", "generate", "historic", "increase", "judgment",
            "knowledge", "learning", "material", "narrative", "occasion", "parallel", "question", "resource", "solution", "together"
        ],
        4: [
            "festival", "triangle", "syndrome", "chamber", "genuine", "normal", "fortune", "capture", "diamond", "observe",
            "glacier", "journey", "victory", "kingdom", "library", "monster", "teacher", "parade", "pressure", "maintain",
            "beautiful", "dangerous", "excellent", "favorite", "government", "happiness", "invention", "kindhearted", "landscape", "meaningful",
            "neighbour", "opportunity", "performance", "questioning", "responsible", "successful", "technology", "understand", "volunteer", "watermelon",
            "amazement", "celebrate", "determined", "encourage", "friendship", "generosity", "imagination", "leadership", "motivation", "remarkable"
        ],
        5: [
            "glacier", "observe", "journey", "victory", "diamond", "kingdom", "library", "monster", "teacher", "parade",
            "marvelous", "adventure", "character", "creative", "powerful", "discovery", "treasure", "wildlife", "pressure", "maintain",
            "knowledge", "important", "beautiful", "confident", "dangerous", "excellent", "movement", "together", "absolute", "complete",
            "favorite", "generate", "historic", "increase", "judgment", "learning", "material", "parallel", "resource", "solution",
            "technology", "volunteer", "encourage", "friendship", "leadership", "motivation", "remarkable", "education", "community", "responsible"
        ],
        6: [
            "marvelous", "adventure", "character", "creative", "powerful", "discovery", "treasure", "wildlife", "journey", "victory",
            "knowledge", "important", "beautiful", "confident", "dangerous", "excellent", "movement", "together", "absolute", "building",
            "complete", "daughter", "evidence", "favorite", "generate", "historic", "increase", "judgment", "learning", "material",
            "narrative", "occasion", "parallel", "question", "resource", "solution", "ultimate", "valuable", "wonderful", "activity",
            "champion", "decision", "education", "friendly", "guidance", "heritage", "interest", "language", "ordinary", "position"
        ],
        7: [
            "knowledge", "important", "beautiful", "confident", "dangerous", "excellent", "movement", "together", "creative", "powerful",
            "education", "different", "community", "storybook", "wonderful", "basketball", "lightning", "pineapple", "technology", "responsible",
            "successful", "understand", "volunteer", "watermelon", "amazement", "brilliant", "celebrate", "determined", "encourage", "friendship",
            "generosity", "imagination", "leadership", "motivation", "remarkable", "opportunity", "performance", "questioning", "government", "happiness",
            "invention", "landscape", "meaningful", "neighbour", "nutrition", "organizing", "positivity", "teamwork", "horizons", "youthful"
        ],
        8: [
            "education", "wonderful", "community", "different", "lightning", "pineapple", "storybook", "basketball", "adventure", "treasure",
            "technology", "responsible", "successful", "understand", "volunteer", "watermelon", "amazement", "brilliant", "celebrate", "determined",
            "encourage", "friendship", "generosity", "imagination", "leadership", "motivation", "remarkable", "opportunity", "performance", "questioning",
            "government", "happiness", "invention", "landscape", "meaningful", "neighbour", "nutrition", "organizing", "positivity", "teamwork",
            "absolute", "creative", "discovery", "excellent", "favorite", "historic", "important", "knowledge", "movement", "together"
        ],
        default: [
            "teacher", "retreat", "attempt", "pressure", "normal", "source", "virus", "french", "capture", "fortune",
            "festival", "triangle", "syndrome", "chamber", "genuine", "diamond", "observe", "journey", "victory", "kingdom",
            "library", "monster", "creative", "powerful", "treasure", "wildlife", "adventure", "character", "marvelous", "discovery",
            "knowledge", "important", "beautiful", "confident", "dangerous", "excellent", "movement", "together", "education", "community",
            "technology", "responsible", "successful", "understand", "volunteer", "encourage", "leadership", "motivation", "remarkable", "opportunity"
        ]
    },

    homeRow: {
        default: [
            "sad", "dad", "fall", "ask", "flash", "alfalfa", "salad", "all", "lad", "flask",
            "dash", "glass", "half", "shall", "fad", "lass", "adds", "falls", "asks", "salsa",
            "flasks", "asdf", "dads", "lads", "gala", "slag", "jags", "flags", "shalls", "alfa",
            "fads", "sall", "gall", "flak", "dall", "jaffa", "salal", "alls", "lasss", "asksa",
            "flall", "dads", "sagas", "halfl", "saladf", "jall", "adds", "falla", "slagg", "dada"
        ]
    },

    topRow: {
        default: [
            "type", "quiet", "power", "tower", "writer", "pretty", "riot", "pie", "wept", "port",
            "tree", "tire", "were", "peer", "rope", "route", "outer", "trio", "query", "twit",
            "wire", "yeti", "pope", "qwerty", "top", "tier", "twerp", "poetry", "woe", "eerie",
            "piper", "pry", "rower", "wipe", "wrote", "troy", "equip", "tweet", "retro", "proper",
            "quote", "report", "priority", "poet", "troupe", "write", "rewire", "yow", "ropey", "twyer"
        ]
    },

    bottomRow: {
        default: [
            "zoo", "zoom", "xray", "vivid", "banana", "magic", "civic", "maze", "cabin", "vase",
            "crazy", "mix", "buzz", "vacuum", "zinc", "cacao", "maxim", "amaze", "zebra", "comma",
            "cabbage", "vacancy", "mimic", "bazaar", "vaccine", "amazing", "caveman", "zapper", "bamboo", "mazes",
            "maven", "vex", "zesty", "crab", "vicar", "czar", "cobweb", "mazer", "vibes", "zappers",
            "civics", "mixer", "vocal", "zonal", "cabinz", "vasey", "cobra", "zippy", "mambo", "cacaoz"
        ]
    }
};

const DEFAULT_GAME = {
    grade: 1,
    difficulty: "easy",
    lesson: "easyWords",
    typingMode: "normal",
    duration: 60,
    score: 0,
    lives: 5,
    timeLeft: 60,
    started: false,
    paused: false,
    finished: false,
    spawnLimit: 6,
    activeWords: [],
    wordQueue: [],
    usedWords: [],
    sfxEnabled: true,
    musicEnabled: true
};

const ANIMALS = ["duck", "panda", "frog"];

const ui = {
    menuScreen: document.getElementById("menuScreen"),
    gameScreen: document.getElementById("gameScreen"),
    resultScreen: document.getElementById("resultScreen"),

    leftGameControls: document.getElementById("leftGameControls"),
    rightGameControls: document.getElementById("rightGameControls"),

    stage: document.getElementById("stage"),
    typingInput: document.getElementById("typingInput"),
    feedbackMessage: document.getElementById("feedbackMessage"),

    scoreValue: document.getElementById("scoreValue"),
    timerValue: document.getElementById("timerValue"),
    livesValue: document.getElementById("livesValue"),
    targetValue: document.getElementById("targetValue"),
    finalScore: document.getElementById("finalScore"),

    startGameBtn: document.getElementById("startGameBtn"),
    submitWordBtn: document.getElementById("submitWordBtn"),
    backToMenuBtn: document.getElementById("backToMenuBtn"),
    playAgainBtn: document.getElementById("playAgainBtn"),
    resultMenuBtn: document.getElementById("resultMenuBtn"),

    gradeButtons: document.querySelectorAll(".grade-btn"),
    difficultyButtons: document.querySelectorAll(".option-btn"),
    lessonButtons: document.querySelectorAll(".lesson-btn"),
    typingModeButtons: document.querySelectorAll(".typing-mode-btn"),

    sfxToggleBtn: document.getElementById("sfxToggleBtn"),
    musicToggleBtn: document.getElementById("musicToggleBtn"),
    duckMeterFill: document.getElementById("duckMeterFill"),
    duckMeterDuck: document.getElementById("duckMeterDuck"),

    bgMusic: document.getElementById("bgMusic"),
    popSound: document.getElementById("popSound"),
    wrongSound: document.getElementById("wrongSound")
};

let state = {...DEFAULT_GAME };
let timerId = null;
let spawnId = null;

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function pickRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
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

function getAnimalEmoji(animal) {
    if (animal === "duck") return "🦆";
    if (animal === "panda") return "🐼";
    return "🐸";
}

function setText(element, value) {
    if (element) {
        element.textContent = String(value);
    }
}

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
        playedAt: new Date().toISOString()
    });

    scores.sort((a, b) => b.score - a.score);
    saveHighScores(scores.slice(0, 10));
}

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

    if (typeof settings.circusSfxEnabled === "boolean") {
        state.sfxEnabled = settings.circusSfxEnabled;
    }

    if (typeof settings.circusMusicEnabled === "boolean") {
        state.musicEnabled = settings.circusMusicEnabled;
    }
}

function saveAudioSettings() {
    const settings = safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
    settings.circusSfxEnabled = state.sfxEnabled;
    settings.circusMusicEnabled = state.musicEnabled;
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function updateSoundButtons() {
    if (ui.sfxToggleBtn) {
        ui.sfxToggleBtn.classList.toggle("off", !state.sfxEnabled);
        ui.sfxToggleBtn.setAttribute("aria-pressed", String(state.sfxEnabled));
        const icon = ui.sfxToggleBtn.querySelector(".side-icon");
        if (icon) icon.textContent = state.sfxEnabled ? "🔊" : "🔇";
    }

    if (ui.musicToggleBtn) {
        ui.musicToggleBtn.classList.toggle("off", !state.musicEnabled);
        ui.musicToggleBtn.setAttribute("aria-pressed", String(state.musicEnabled));
        const icon = ui.musicToggleBtn.querySelector(".side-icon");
        if (icon) icon.textContent = state.musicEnabled ? "🎵" : "🔈";
    }
}

function playSound(audioEl) {
    if (!state.sfxEnabled || !audioEl) return;

    try {
        audioEl.pause();
        audioEl.currentTime = 0;
        const playPromise = audioEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
        }
    } catch {}
}

function updateMusicPlayback() {
    if (!ui.bgMusic) return;

    if (state.musicEnabled && state.started && !state.finished) {
        try {
            ui.bgMusic.volume = 0.35;
            const playPromise = ui.bgMusic.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        } catch {}
    } else {
        ui.bgMusic.pause();
        ui.bgMusic.currentTime = 0;
    }
}

function getDifficultySettings(difficulty) {
    switch (difficulty) {
        case "medium":
            return { duration: 50, spawnLimit: 7, lives: 5 };
        case "hard":
            return { duration: 45, spawnLimit: 8, lives: 4 };
        case "easy":
        default:
            return { duration: 60, spawnLimit: 6, lives: 5 };
    }
}

function getWordPool() {
    const lessonData = GAME_WORDS[state.lesson] || GAME_WORDS.easyWords;
    return lessonData[state.grade] || lessonData.default || [];
}

function getActiveWordSet() {
    return new Set(state.activeWords.map((entry) => entry.word.toLowerCase()));
}

function refillWordQueue() {
    const pool = getWordPool();
    const activeSet = getActiveWordSet();

    const freshWords = pool.filter((word) => {
        const normalized = word.toLowerCase();
        return !state.usedWords.includes(normalized) && !activeSet.has(normalized);
    });

    if (freshWords.length > 0) {
        state.wordQueue = shuffleArray(freshWords);
        return;
    }

    state.usedWords = [];
    const resetWords = pool.filter((word) => !activeSet.has(word.toLowerCase()));
    state.wordQueue = shuffleArray(resetWords);
}

function getNextUniqueWord() {
    if (state.wordQueue.length === 0) {
        refillWordQueue();
    }

    if (state.wordQueue.length === 0) {
        return null;
    }

    const nextWord = state.wordQueue.shift();
    state.usedWords.push(nextWord.toLowerCase());
    return nextWord;
}

function updateGameModeControls() {
    const shouldShow = state.started && !state.finished;

    if (ui.leftGameControls) {
        ui.leftGameControls.classList.toggle("hidden", !shouldShow);
    }

    if (ui.rightGameControls) {
        ui.rightGameControls.classList.toggle("hidden", !shouldShow);
    }
}

function showScreen(screen) {
    if (ui.menuScreen) ui.menuScreen.classList.add("hidden");
    if (ui.gameScreen) ui.gameScreen.classList.add("hidden");
    if (ui.resultScreen) ui.resultScreen.classList.add("hidden");
    if (screen) screen.classList.remove("hidden");

    updateGameModeControls();
}

function updateDuckMeter() {
    if (!ui.duckMeterFill || !ui.duckMeterDuck) return;

    const maxTime = Math.max(1, state.duration);
    const progress = (state.timeLeft / maxTime) * 100;
    const clamped = Math.max(0, Math.min(100, progress));

    if (window.innerWidth <= 980) {
        ui.duckMeterFill.style.width = `${clamped}%`;
        ui.duckMeterFill.style.height = "100%";
        ui.duckMeterDuck.style.left = `${clamped}%`;
        ui.duckMeterDuck.style.bottom = "auto";
    } else {
        ui.duckMeterFill.style.height = `${clamped}%`;
        ui.duckMeterFill.style.width = "100%";
        ui.duckMeterDuck.style.left = "50%";
        ui.duckMeterDuck.style.bottom = `calc(${clamped}% - 8px)`;
    }
}

function updateStats() {
    setText(ui.scoreValue, state.score);
    setText(ui.timerValue, state.timeLeft);
    setText(ui.livesValue, state.lives);
    updateDuckMeter();
}

function setFeedback(message) {
    setText(ui.feedbackMessage, message);
}

function updateTargetHint() {
    if (!ui.targetValue || !ui.typingInput) return;

    const typed = ui.typingInput.value.trim().toLowerCase();

    if (!typed) {
        ui.targetValue.textContent = "-";
        return;
    }

    const match = state.activeWords.find((item) =>
        item.displayWord.toLowerCase().startsWith(typed)
    );

    ui.targetValue.textContent = match ? match.displayWord : "No match";
}

function focusInput() {
    if (ui.typingInput) {
        ui.typingInput.focus();
    }
}

function clearStage() {
    state.activeWords.forEach((entry) => {
        if (entry.element && entry.element.parentNode) {
            entry.element.parentNode.removeChild(entry.element);
        }
    });

    state.activeWords = [];
}

function createWordElement(word) {
    if (!ui.stage) return null;

    const animal = pickRandomItem(ANIMALS);
    const displayedWord = getDisplayedWord(word);
    const element = document.createElement("div");

    element.className = `float-word ${animal}`;
    element.style.left = `${randomBetween(3, 80)}%`;
    element.style.top = `${randomBetween(5, 72)}%`;
    element.dataset.word = word.toLowerCase();
    element.dataset.displayWord = displayedWord.toLowerCase();

    const emoji = document.createElement("div");
    emoji.className = "animal-emoji";
    emoji.textContent = getAnimalEmoji(animal);

    const label = document.createElement("span");
    label.className = "word-label";
    label.textContent = displayedWord;

    element.appendChild(emoji);
    element.appendChild(label);
    ui.stage.appendChild(element);

    return {
        word,
        displayWord: displayedWord,
        animal,
        element
    };
}

function spawnWords(limit = state.spawnLimit) {
    if (!ui.stage) return;

    while (state.activeWords.length < limit) {
        const word = getNextUniqueWord();
        if (!word) break;

        const entry = createWordElement(word);
        if (entry) {
            state.activeWords.push(entry);
        }
    }
}

function removeWordEntry(entry) {
    if (!entry) return;

    if (entry.element && entry.element.parentNode) {
        entry.element.parentNode.removeChild(entry.element);
    }

    state.activeWords = state.activeWords.filter((item) => item !== entry);
}

function clearTimers() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    if (spawnId) {
        clearInterval(spawnId);
        spawnId = null;
    }
}

function finishGame() {
    if (state.finished) return;

    state.finished = true;
    state.started = false;
    state.paused = false;

    clearTimers();
    saveResult();
    clearStage();

    setText(ui.finalScore, state.score);

    if (ui.bgMusic) {
        ui.bgMusic.pause();
    }

    showScreen(ui.resultScreen);
}

function startTimer() {
    clearTimers();

    timerId = setInterval(() => {
        if (!state.started || state.paused || state.finished) return;

        state.timeLeft -= 1;

        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            updateStats();
            finishGame();
            return;
        }

        updateStats();
    }, 1000);

    spawnId = setInterval(() => {
        if (!state.started || state.paused || state.finished) return;
        spawnWords(state.spawnLimit);
    }, 2000);
}

function prepareGameByDifficulty() {
    const settings = getDifficultySettings(state.difficulty);
    state.duration = settings.duration;
    state.timeLeft = settings.duration;
    state.spawnLimit = settings.spawnLimit;
    state.lives = settings.lives;
}

function resetWordCycle() {
    state.wordQueue = [];
    state.usedWords = [];
}

function startGame() {
    prepareGameByDifficulty();

    state.score = 0;
    state.started = true;
    state.paused = false;
    state.finished = false;

    clearStage();
    resetWordCycle();
    spawnWords(state.spawnLimit);

    updateStats();
    updateSoundButtons();
    updateMusicPlayback();

    setFeedback("Type the words before time runs out.");
    showScreen(ui.gameScreen);

    if (ui.typingInput) {
        ui.typingInput.value = "";
    }

    if (ui.targetValue) {
        ui.targetValue.textContent = "-";
    }

    focusInput();
    startTimer();
}

function handleCorrectWord(match, typedWord) {
    removeWordEntry(match);
    state.score += typedWord.length * 10;
    setFeedback(`Great! You popped "${typedWord}".`);
    playSound(ui.popSound);

    if (state.activeWords.length < state.spawnLimit) {
        spawnWords(state.spawnLimit);
    }
}

function handleWrongWord(typedWord) {
    state.lives -= 1;
    setFeedback(`"${typedWord}" is not on the stage.`);
    playSound(ui.wrongSound);

    if (state.lives <= 0) {
        state.lives = 0;
        updateStats();
        finishGame();
    }
}

function submitTypedWord() {
    if (!state.started || state.paused || state.finished || !ui.typingInput) return;

    const typed = ui.typingInput.value.trim().toLowerCase();
    if (!typed) return;

    const match = state.activeWords.find(
        (entry) => entry.displayWord.toLowerCase() === typed
    );

    if (match) {
        handleCorrectWord(match, typed);
    } else {
        handleWrongWord(typed);
        if (state.finished) return;
    }

    ui.typingInput.value = "";
    updateStats();
    updateTargetHint();
    focusInput();
}

function backToMenu() {
    clearTimers();
    clearStage();

    state.started = false;
    state.paused = false;
    state.finished = false;

    resetWordCycle();

    if (ui.bgMusic) {
        ui.bgMusic.pause();
    }

    showScreen(ui.menuScreen);
    setFeedback("Choose your options and press Play.");
}

function bindSelectionButtons() {
    ui.gradeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.gradeButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.grade = Number(btn.dataset.grade);
        });
    });

    ui.difficultyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.difficultyButtons.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.difficulty = btn.dataset.difficulty;
            prepareGameByDifficulty();
            updateStats();
            updateDuckMeter();
        });
    });

    ui.lessonButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.lessonButtons.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.lesson = btn.dataset.lesson;
        });
    });

    ui.typingModeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (state.started && !state.finished) return;

            ui.typingModeButtons.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.typingMode = btn.dataset.typingMode;
        });
    });
}

function bindEvents() {
    if (ui.startGameBtn) {
        ui.startGameBtn.addEventListener("click", startGame);
    }

    if (ui.submitWordBtn) {
        ui.submitWordBtn.addEventListener("click", submitTypedWord);
    }

    if (ui.backToMenuBtn) {
        ui.backToMenuBtn.addEventListener("click", backToMenu);
    }

    if (ui.playAgainBtn) {
        ui.playAgainBtn.addEventListener("click", startGame);
    }

    if (ui.resultMenuBtn) {
        ui.resultMenuBtn.addEventListener("click", backToMenu);
    }

    if (ui.typingInput) {
        ui.typingInput.addEventListener("input", updateTargetHint);

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

    window.addEventListener("resize", updateDuckMeter);

    bindSelectionButtons();
}

function init() {
    applySavedTheme();
    state = {...DEFAULT_GAME };
    loadAudioSettings();
    prepareGameByDifficulty();
    bindEvents();
    updateStats();
    updateSoundButtons();
    showScreen(ui.menuScreen);
    setFeedback("Choose your options and press Play.");
}

document.addEventListener("DOMContentLoaded", init);