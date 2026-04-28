class AudioManager {
    constructor() {
        this.context = null;
        this.soundVolume = 1;
        this.musicVolume = 1;
        this.musicTimer = null;
    }

    unlock() {
        if (!this.context) {
            this.context = new(window.AudioContext || window.webkitAudioContext)();
        }

        if (this.context.state === "suspended") {
            this.context.resume();
        }
    }

    setSoundVolume(value) {
        this.soundVolume = Math.max(0, Math.min(1, value));
    }

    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
    }

    beep(frequency = 440, duration = 0.08, type = "sine", volume = 0.25) {
        if (!this.context || this.soundVolume <= 0) return;

        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume * this.soundVolume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        oscillator.connect(gain);
        gain.connect(this.context.destination);
        oscillator.start(now);
        oscillator.stop(now + duration + 0.02);
    }

    shoot() {
        this.beep(760, 0.055, "square", 0.14);
    }

    explode() {
        this.beep(150, 0.14, "sawtooth", 0.22);
        setTimeout(() => this.beep(80, 0.1, "square", 0.12), 60);
    }

    wrong() {
        this.beep(90, 0.15, "sawtooth", 0.22);
    }

    click() {
        this.beep(420, 0.06, "triangle", 0.13);
    }

    emp() {
        this.beep(90, 0.22, "sawtooth", 0.25);
        setTimeout(() => this.beep(300, 0.18, "triangle", 0.18), 90);
    }

    gameOver() {
        this.beep(180, 0.28, "sawtooth", 0.22);
        setTimeout(() => this.beep(100, 0.35, "sawtooth", 0.18), 230);
    }

    startMusic() {
        if (!this.context || this.musicTimer) return;

        const notes = [220, 277, 330, 277, 196, 247, 294, 247];
        let index = 0;

        this.musicTimer = setInterval(() => {
            if (this.musicVolume <= 0) return;

            const now = this.context.currentTime;
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(notes[index % notes.length], now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.06 * this.musicVolume, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

            oscillator.connect(gain);
            gain.connect(this.context.destination);
            oscillator.start(now);
            oscillator.stop(now + 0.5);

            index++;
        }, 600);
    }

    stopMusic() {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
    }
}

class EnemyWord {
    constructor({ word, reverseMode, layer, screenWidth, speed, onBottom }) {
        this.originalWord = word;
        this.reverseMode = reverseMode;
        this.targetText = reverseMode ? EnemyWord.reverse(word) : word;
        this.typedText = "";

        this.x = Math.random() * Math.max(120, screenWidth - 220) + 50;
        this.y = 80 + Math.random() * 140;
        this.speed = speed;
        this.onBottom = onBottom;

        this.element = document.createElement("div");
        this.element.className = `enemy-word${reverseMode ? " reverse-mode" : ""}`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        this.render();
        layer.appendChild(this.element);
    }

    static reverse(text) {
        return text.split("").reverse().join("");
    }

    startsWith(letter) {
        return this.targetText.startsWith(letter);
    }

    getNextLetter() {
        return this.targetText[this.typedText.length];
    }

    typeLetter(letter) {
        if (letter !== this.getNextLetter()) return false;

        this.typedText += letter;
        this.render();
        return true;
    }

    isComplete() {
        return this.typedText === this.targetText;
    }

    lock() {
        this.element.classList.add("locked");
    }

    unlock() {
        this.element.classList.remove("locked");
    }

    flashWrong() {
        this.element.classList.add("wrong");

        setTimeout(() => {
            this.element.classList.remove("wrong");
        }, 130);
    }

    update(delta) {
        this.y += this.speed * delta;
        this.element.style.top = `${this.y}px`;

        if (this.y > window.innerHeight - 115) {
            this.remove();
            this.onBottom(this);
        }
    }

    render() {
        const typed = this.targetText.slice(0, this.typedText.length);
        const rest = this.targetText.slice(this.typedText.length);

        this.element.innerHTML = `<span class="typed">${EnemyWord.escapeHTML(typed)}</span>${EnemyWord.escapeHTML(rest)}`;
    }

    remove() {
        this.element.remove();
    }

    getCenter() {
        const rect = this.element.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    static escapeHTML(text) {
        return text.replace(/[&<>'"]/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#039;",
            '"': "&quot;"
        }[char]));
    }
}

class StarField {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.stars = [];

        this.resize();

        window.addEventListener("resize", () => this.resize());
        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const count = Math.floor((window.innerWidth * window.innerHeight) / 5200);

        this.stars = Array.from({ length: count }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            r: Math.random() * 1.8 + 0.3,
            speed: Math.random() * 0.25 + 0.08,
            alpha: Math.random() * 0.8 + 0.2
        }));
    }

    draw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const star of this.stars) {
            star.y += star.speed;

            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }

            ctx.beginPath();
            ctx.fillStyle = `rgba(220, 242, 255, ${star.alpha})`;
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(() => this.draw());
    }
}

class TypingShooterGame {
    constructor() {
        this.audio = new AudioManager();
        this.starField = new StarField(document.getElementById("starCanvas"));

        this.screens = {
            title: document.getElementById("titleScreen"),
            play: document.getElementById("playScreen"),
            pause: document.getElementById("pauseScreen"),
            result: document.getElementById("resultScreen"),
            info: document.getElementById("infoScreen")
        };

        this.elements = {
            wordLayer: document.getElementById("wordLayer"),
            laserLayer: document.getElementById("laserLayer"),
            scoreText: document.getElementById("scoreText"),
            waveText: document.getElementById("waveText"),
            modeText: document.getElementById("modeText"),
            mainHelpText: document.getElementById("mainHelpText"),
            empBadge: document.getElementById("empBadge"),
            finalScore: document.getElementById("finalScore"),
            finalWave: document.getElementById("finalWave"),
            accuracyText: document.getElementById("accuracyText"),
            streakText: document.getElementById("streakText"),
            bestRow: document.getElementById("bestRow"),
            soundValue: document.getElementById("soundValue"),
            musicValue: document.getElementById("musicValue"),
            reverseTypeBtn: document.getElementById("reverseTypeBtn"),
            reverseStateText: document.getElementById("reverseStateText")
        };

        this.wordBank = [
            "body", "near", "has", "cease", "turns", "prospect", "world", "author",
            "bid", "output", "planet", "rocket", "signal", "shadow", "galaxy", "typing",
            "future", "system", "energy", "comet", "shield", "memory", "attack", "orbit",
            "window", "silver", "hunter", "engine", "danger", "rescue", "battle", "vector"
        ];

        this.storageKeys = {
            reverseMode: "ztypeReverseMode",
            normalBest: "ztypeNormalBest",
            reverseBest: "ztypeReverseBest",
            scoreHistory: "typingShooterScores"
        };

        this.reverseMode = localStorage.getItem(this.storageKeys.reverseMode) === "true";
        this.gameState = "title";
        this.enemies = [];
        this.activeEnemy = null;
        this.lastFrame = 0;
        this.spawnTimer = 0;

        this.resetStats();
        this.bindEvents();
        this.updateReverseButton();
        this.showScreen("title");

        requestAnimationFrame(time => this.loop(time));
    }

    bindEvents() {
        document.getElementById("newGameBtn").addEventListener("click", () => {
            this.audio.unlock();
            this.audio.click();
            this.startGame();
        });

        document.getElementById("soundMenuBtn").addEventListener("click", () => {
            this.audio.unlock();
            this.audio.click();
            this.pauseFromTitle();
        });

        this.elements.reverseTypeBtn.addEventListener("click", () => {
            this.audio.unlock();
            this.audio.click();
            this.toggleReverseMode();
        });

        document.getElementById("infoBtn").addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            this.audio.unlock();
            this.audio.click();
            this.gameState = "info";
            this.showScreen("info");
        });

        document.getElementById("closeInfoBtn").addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            this.audio.click();
            window.location.href = "index.html";
        });

        document.getElementById("resumeBtn").addEventListener("click", () => {
            this.audio.click();
            this.resumeGame();
        });

        document.getElementById("backTitleBtn").addEventListener("click", () => {
            this.audio.click();
            this.backToTitle();
        });

        document.getElementById("restartBtn").addEventListener("click", () => {
            this.audio.click();
            this.backToTitle();
        });

        document.getElementById("soundMinus").addEventListener("click", () => this.changeSound(-0.1));
        document.getElementById("soundPlus").addEventListener("click", () => this.changeSound(0.1));
        document.getElementById("musicMinus").addEventListener("click", () => this.changeMusic(-0.1));
        document.getElementById("musicPlus").addEventListener("click", () => this.changeMusic(0.1));

        document.addEventListener("keydown", event => this.handleKey(event));
    }

    toggleReverseMode() {
        this.reverseMode = !this.reverseMode;

        localStorage.setItem(this.storageKeys.reverseMode, String(this.reverseMode));
        this.updateReverseButton();
    }

    updateReverseButton() {
        this.elements.reverseStateText.textContent = this.reverseMode ? "on" : "off";
        this.elements.reverseTypeBtn.classList.toggle("reverse-on", this.reverseMode);
        this.elements.reverseTypeBtn.setAttribute("aria-pressed", String(this.reverseMode));
    }

    resetStats() {
        this.score = 0;
        this.wave = 1;
        this.emp = 3;
        this.empUsed = 0;
        this.totalTyped = 0;
        this.correctTyped = 0;
        this.errors = 0;
        this.streak = 0;
        this.longestStreak = 0;
        this.wordsDestroyed = 0;
        this.startedAt = null;
        this.endedAt = null;
    }

    startGame() {
        this.clearEnemies();
        this.resetStats();

        this.startedAt = Date.now();
        this.activeEnemy = null;
        this.spawnTimer = 0;
        this.lastFrame = performance.now();
        this.gameState = "playing";

        this.audio.startMusic();
        this.updateHud();
        this.showScreen("play");

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (this.gameState === "playing") {
                    this.spawnEnemy();
                }
            }, i * 250);
        }
    }

    pauseFromTitle() {
        this.gameState = "pause-title";
        this.showScreen("pause");
        document.getElementById("resumeBtn").style.display = "none";
    }

    pauseGame() {
        if (this.gameState !== "playing") return;

        this.gameState = "paused";
        this.audio.stopMusic();

        document.getElementById("resumeBtn").style.display = "block";
        this.showScreen("pause");
    }

    resumeGame() {
        if (this.gameState === "paused") {
            this.gameState = "playing";
            this.lastFrame = performance.now();
            this.audio.startMusic();
            this.showScreen("play");
        } else {
            this.backToTitle();
        }
    }

    backToTitle() {
        this.gameState = "title";
        this.audio.stopMusic();
        this.clearEnemies();
        this.showScreen("title");
    }

    showScreen(name) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove("active");
        });

        this.screens[name].classList.add("active");
    }

    handleKey(event) {
        if (event.key === "Escape") {
            if (this.gameState === "playing") {
                this.pauseGame();
            } else if (this.gameState === "paused") {
                this.resumeGame();
            }

            return;
        }

        if (this.gameState !== "playing") return;

        if (event.key === "Enter") {
            event.preventDefault();
            this.useEmp();
            return;
        }

        if (event.key.length !== 1 || !/[a-zA-Z]/.test(event.key)) return;

        event.preventDefault();
        this.typeLetter(event.key.toLowerCase());
    }

    typeLetter(letter) {
        this.totalTyped++;

        if (!this.activeEnemy) {
            this.activeEnemy = this.enemies.find(enemy => enemy.startsWith(letter)) || null;

            if (!this.activeEnemy) {
                this.wrongType();
                return;
            }

            this.activeEnemy.lock();
        }

        if (this.activeEnemy.typeLetter(letter)) {
            this.correctTyped++;
            this.audio.shoot();
            this.drawLaser(this.activeEnemy);

            if (this.activeEnemy.isComplete()) {
                this.destroyEnemy(this.activeEnemy);
            }
        } else {
            this.activeEnemy.flashWrong();
            this.wrongType();
        }
    }

    wrongType() {
        this.streak = 0;
        this.errors++;
        this.audio.wrong();
    }

    destroyEnemy(enemy) {
        const center = enemy.getCenter();
        this.makeExplosion(center.x, center.y);

        this.score += enemy.targetText.length * 10 + this.wave * 5;
        this.streak++;
        this.longestStreak = Math.max(this.longestStreak, this.streak);
        this.wordsDestroyed++;

        this.enemies = this.enemies.filter(item => item !== enemy);
        enemy.remove();
        this.activeEnemy = null;

        this.audio.explode();

        if (this.score >= this.wave * 260) {
            this.wave++;
        }

        this.updateHud();
    }

    useEmp() {
        if (this.emp <= 0 || this.enemies.length === 0) return;

        this.emp--;
        this.empUsed++;
        this.score += this.enemies.length * 20;

        this.audio.emp();

        this.enemies.forEach(enemy => {
            const center = enemy.getCenter();
            this.makeExplosion(center.x, center.y);
            enemy.remove();
        });

        this.wordsDestroyed += this.enemies.length;
        this.enemies = [];
        this.activeEnemy = null;

        this.updateHud();
    }

    spawnEnemy() {
        const word = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];

        const speed = 0.012 + this.wave * 0.004 + Math.random() * 0.008;

        const enemy = new EnemyWord({
            word,
            reverseMode: this.reverseMode,
            layer: this.elements.wordLayer,
            screenWidth: window.innerWidth,
            speed,
            onBottom: enemyWord => this.enemyReachedBottom(enemyWord)
        });

        this.enemies.push(enemy);
    }

    enemyReachedBottom(enemy) {
        this.enemies = this.enemies.filter(item => item !== enemy);

        if (this.activeEnemy === enemy) {
            this.activeEnemy = null;
        }

        this.endGame();
    }

    loop(time) {
        const delta = Math.min(45, time - this.lastFrame || 16);
        this.lastFrame = time;

        if (this.gameState === "playing") {
            this.spawnTimer += delta;

            const spawnDelay = Math.max(1200, 2600 - this.wave * 80);

            if (this.spawnTimer >= spawnDelay) {
                this.spawnTimer = 0;
                this.spawnEnemy();
            }

            for (const enemy of[...this.enemies]) {
                enemy.update(delta);
            }
        }

        requestAnimationFrame(nextTime => this.loop(nextTime));
    }

    drawLaser(enemy) {
        const shipX = window.innerWidth / 2;
        const shipY = window.innerHeight - window.innerHeight * 0.09 - 15;
        const target = enemy.getCenter();

        const dx = target.x - shipX;
        const dy = target.y - shipY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;

        const laser = document.createElement("div");
        laser.className = "laser";
        laser.style.left = `${shipX}px`;
        laser.style.top = `${shipY}px`;
        laser.style.height = `${distance}px`;
        laser.style.transform = `rotate(${angle}rad)`;

        this.elements.laserLayer.appendChild(laser);

        setTimeout(() => {
            laser.remove();
        }, 180);
    }

    makeExplosion(x, y) {
        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;

        this.elements.laserLayer.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 350);
    }

    clearEnemies() {
        this.enemies.forEach(enemy => enemy.remove());

        this.enemies = [];
        this.activeEnemy = null;
        this.elements.wordLayer.innerHTML = "";
        this.elements.laserLayer.innerHTML = "";
    }

    getAccuracy() {
        if (this.totalTyped === 0) return 0;

        return Math.round((this.correctTyped / this.totalTyped) * 1000) / 10;
    }

    getWpm() {
        if (!this.startedAt) return 0;

        const now = this.endedAt || Date.now();
        const minutes = Math.max((now - this.startedAt) / 1000 / 60, 1 / 60);
        const estimatedWords = this.correctTyped / 5;

        return Math.round(estimatedWords / minutes);
    }

    readScoreHistory() {
        try {
            const value = localStorage.getItem(this.storageKeys.scoreHistory);
            const parsed = value ? JSON.parse(value) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    saveScoreHistory(scoreData) {
        const history = this.readScoreHistory();

        history.unshift(scoreData);

        const limitedHistory = history.slice(0, 50);

        localStorage.setItem(this.storageKeys.scoreHistory, JSON.stringify(limitedHistory));
    }

    saveScoreResult({ accuracy, wpm, newBest }) {
        const scoreData = {
            game: "Typing Shooter",
            mode: "Space",
            typingMode: this.reverseMode ? "reverse" : "normal",
            score: this.score,
            wave: this.wave,
            accuracy: accuracy,
            wpm: wpm,
            errors: this.errors,
            bestStreak: this.longestStreak,
            longestStreak: this.longestStreak,
            wordsDestroyed: this.wordsDestroyed,
            empUsed: this.empUsed,
            empLeft: this.emp,
            winner: newBest ? "New Best" : "Completed",
            playedAt: new Date().toISOString()
        };

        this.saveScoreHistory(scoreData);
    }

    endGame() {
        if (this.gameState !== "playing") return;

        this.gameState = "result";
        this.endedAt = Date.now();

        this.audio.stopMusic();
        this.audio.gameOver();

        const accuracy = this.getAccuracy();
        const wpm = this.getWpm();

        const bestKey = this.reverseMode ? this.storageKeys.reverseBest : this.storageKeys.normalBest;
        const oldBest = Number(localStorage.getItem(bestKey) || 0);
        const newBest = this.score > oldBest;

        if (newBest) {
            localStorage.setItem(bestKey, String(this.score));
        }

        this.saveScoreResult({
            accuracy,
            wpm,
            newBest
        });

        this.elements.finalScore.textContent = String(this.score).padStart(6, "0");
        this.elements.finalWave.textContent = String(this.wave).padStart(3, "0");
        this.elements.accuracyText.textContent = accuracy;
        this.elements.streakText.textContent = this.longestStreak;
        this.elements.bestRow.style.visibility = newBest ? "visible" : "hidden";

        this.clearEnemies();
        this.showScreen("result");
    }

    updateHud() {
        this.elements.scoreText.textContent = String(this.score).padStart(6, "0");
        this.elements.waveText.textContent = String(this.wave).padStart(3, "0");
        this.elements.empBadge.textContent = this.emp;
        this.elements.modeText.textContent = this.reverseMode ? "REVERSE" : "NORMAL";

        this.elements.mainHelpText.textContent = this.reverseMode ?
            "Reverse mode: type the backwards words!" :
            "Type the words to shoot!";
    }

    changeSound(amount) {
        this.audio.unlock();
        this.audio.setSoundVolume(this.audio.soundVolume + amount);
        this.elements.soundValue.textContent = `${Math.round(this.audio.soundVolume * 100)}%`;
        this.audio.click();
    }

    changeMusic(amount) {
        this.audio.unlock();
        this.audio.setMusicVolume(this.audio.musicVolume + amount);
        this.elements.musicValue.textContent = `${Math.round(this.audio.musicVolume * 100)}%`;
        this.audio.click();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new TypingShooterGame();
});