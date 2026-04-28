// js/scores.js

const STORAGE_KEYS = {
    reverseScores: "rtgHighScores",
    keyboardScores: "keyboardJumpHighScores",
    circusScores: "circusTypingHighScores",

    // Typing Shooter best score keys from typing-shooter.js
    shooterNormalBest: "ztypeNormalBest",
    shooterReverseBest: "ztypeReverseBest",

    // Optional full history key for Typing Shooter
    shooterScores: "typingShooterScores"
};

const ui = {
    bestWpmValue: document.getElementById("bestWpmValue"),
    bestPlayerScoreValue: document.getElementById("bestPlayerScoreValue"),
    gamesPlayedValue: document.getElementById("gamesPlayedValue"),
    bestAccuracyValue: document.getElementById("bestAccuracyValue"),

    scoresTableBody: document.getElementById("scoresTableBody"),
    resultsCount: document.getElementById("resultsCount"),
    sortSelect: document.getElementById("sortSelect"),
    resetScoresBtn: document.getElementById("resetScoresBtn"),
    filterButtons: document.querySelectorAll(".filter-btn"),

    confirmOverlay: document.getElementById("confirmOverlay"),
    confirmCancelBtn: document.getElementById("confirmCancelBtn"),
    confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
    toastMessage: document.getElementById("toastMessage")
};

let currentGameFilter = "all";
let currentSort = "recent";
let toastTimer = null;

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function readStorageArray(key) {
    const data = safeParse(localStorage.getItem(key), []);
    return Array.isArray(data) ? data : [];
}

function writeStorageArray(key, value) {
    localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normaliseDate(value) {
    if (!value) return "";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function formatDate(value) {
    if (!value) return "Unknown";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleString();
}

function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function formatTimeFromSeconds(seconds) {
    const safeSeconds = Math.max(0, Math.floor(toNumber(seconds)));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function titleCase(value) {
    return String(value || "-")
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =========================
   Normalise Game Scores
========================= */

function normaliseReverseScore(score) {
    return {
        gameKey: "reverse",
        gameName: "Reverse Typing",
        mode: score.mode || "common",
        typingMode: score.typingMode || "reverse",
        score: toNumber(score.score),
        computerScore: toNumber(score.computerScore),
        winner: score.winner || "Solo",
        wpm: toNumber(score.wpm),
        accuracy: toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        errors: toNumber(score.errors),
        extra: `Streak: ${toNumber(score.bestStreak)}`,
        playedAt: normaliseDate(score.playedAt)
    };
}

function normaliseKeyboardScore(score) {
    const timePlayed = score.timePlayed || score.time || score.duration || "-";

    return {
        gameKey: "keyboard",
        gameName: "Keyboard Jump",
        mode: score.mode || score.difficulty || "Platform",
        typingMode: score.typingMode || "normal",
        score: toNumber(score.score),
        computerScore: 0,
        winner: score.winner || "Completed",
        wpm: toNumber(score.wpm),
        accuracy: score.accuracy === undefined ? 0 : toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        errors: toNumber(score.errors),
        extra: `Grade: ${score.grade || "-"} | Time: ${typeof timePlayed === "number" ? formatTimeFromSeconds(timePlayed) : timePlayed}`,
        playedAt: normaliseDate(score.playedAt)
    };
}

function normaliseCircusScore(score) {
    return {
        gameKey: "circus",
        gameName: "Type Toss Circus",
        mode: score.difficulty || score.mode || "Circus",
        typingMode: score.typingMode || "normal",
        score: toNumber(score.score),
        computerScore: 0,
        winner: score.winner || "Completed",
        wpm: toNumber(score.wpm),
        accuracy: score.accuracy === undefined ? 0 : toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        errors: toNumber(score.errors),
        extra: `Grade: ${score.grade || "-"} | Lesson: ${titleCase(score.lesson || score.wordList || "-")}`,
        playedAt: normaliseDate(score.playedAt)
    };
}

function normaliseShooterScore(score) {
    return {
        gameKey: "shooter",
        gameName: "Typing Shooter",
        mode: score.mode || "Space",
        typingMode: score.typingMode || "normal",
        score: toNumber(score.score),
        computerScore: 0,
        winner: score.winner || "Completed",
        wpm: toNumber(score.wpm),
        accuracy: score.accuracy === undefined ? 0 : toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak || score.longestStreak),
        errors: toNumber(score.errors),
        extra: `Wave: ${toNumber(score.wave, 1)} | EMP: ${toNumber(score.empUsed || 0)}`,
        playedAt: normaliseDate(score.playedAt)
    };
}

function getShooterBestScores() {
    const normalBest = toNumber(localStorage.getItem(STORAGE_KEYS.shooterNormalBest));
    const reverseBest = toNumber(localStorage.getItem(STORAGE_KEYS.shooterReverseBest));

    const scores = [];

    if (normalBest > 0) {
        scores.push({
            gameKey: "shooter",
            gameName: "Typing Shooter",
            mode: "Space",
            typingMode: "normal",
            score: normalBest,
            computerScore: 0,
            winner: "Best Score",
            wpm: 0,
            accuracy: 0,
            bestStreak: 0,
            errors: 0,
            extra: "Normal Mode Best",
            playedAt: ""
        });
    }

    if (reverseBest > 0) {
        scores.push({
            gameKey: "shooter",
            gameName: "Typing Shooter",
            mode: "Space",
            typingMode: "reverse",
            score: reverseBest,
            computerScore: 0,
            winner: "Best Score",
            wpm: 0,
            accuracy: 0,
            bestStreak: 0,
            errors: 0,
            extra: "Reverse Mode Best",
            playedAt: ""
        });
    }

    return scores;
}

function getAllScores() {
    const reverseScores = readStorageArray(STORAGE_KEYS.reverseScores).map(normaliseReverseScore);
    const keyboardScores = readStorageArray(STORAGE_KEYS.keyboardScores).map(normaliseKeyboardScore);
    const circusScores = readStorageArray(STORAGE_KEYS.circusScores).map(normaliseCircusScore);

    const shooterHistoryScores = readStorageArray(STORAGE_KEYS.shooterScores).map(normaliseShooterScore);
    const shooterBestScores = getShooterBestScores();

    return [
        ...reverseScores,
        ...keyboardScores,
        ...circusScores,
        ...shooterHistoryScores,
        ...shooterBestScores
    ];
}

/* =========================
   Table Helpers
========================= */

function getGameTagClass(gameKey) {
    if (gameKey === "keyboard") return "keyboard";
    if (gameKey === "circus") return "circus";
    if (gameKey === "shooter") return "shooter";

    return "reverse";
}

function getRankClass(index) {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";

    return "";
}

function getWinnerClass(winner) {
    const value = String(winner || "").toLowerCase();

    if (value.includes("draw")) return "draw";
    if (value.includes("computer")) return "loss";
    if (value.includes("completed")) return "draw";
    if (value.includes("solo")) return "draw";
    if (value.includes("best")) return "draw";

    return "";
}

function formatReverseMode(mode) {
    const labels = {
        common: "Common",
        quotes: "Quotes",
        code: "Code",
        numbers: "Numbers",
        custom: "Custom"
    };

    return labels[mode] || titleCase(mode);
}

function formatMode(score) {
    if (score.gameKey === "reverse") {
        return formatReverseMode(score.mode);
    }

    return titleCase(score.mode);
}

function formatTypingMode(mode) {
    return mode === "reverse" ? "Reverse" : "Normal";
}

/* =========================
   Filter / Sort
========================= */

function filterScores(scores) {
    if (currentGameFilter === "all") {
        return scores;
    }

    return scores.filter((score) => score.gameKey === currentGameFilter);
}

function sortScores(scores) {
    const sorted = [...scores];

    if (currentSort === "playerScore") {
        sorted.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.wpm - a.wpm;
        });
    } else if (currentSort === "computerScore") {
        sorted.sort((a, b) => {
            if (b.computerScore !== a.computerScore) {
                return b.computerScore - a.computerScore;
            }

            return b.score - a.score;
        });
    } else if (currentSort === "wpm") {
        sorted.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return b.score - a.score;
        });
    } else if (currentSort === "accuracy") {
        sorted.sort((a, b) => {
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return b.score - a.score;
        });
    } else if (currentSort === "errors") {
        sorted.sort((a, b) => {
            if (a.errors !== b.errors) return a.errors - b.errors;
            return b.score - a.score;
        });
    } else {
        sorted.sort((a, b) => {
            const dateA = new Date(a.playedAt || 0).getTime();
            const dateB = new Date(b.playedAt || 0).getTime();

            if (dateB !== dateA) {
                return dateB - dateA;
            }

            return b.score - a.score;
        });
    }

    return sorted;
}

/* =========================
   Render
========================= */

function updateSummary(scores) {
    if (!scores.length) {
        ui.bestWpmValue.textContent = "0";
        ui.bestPlayerScoreValue.textContent = "0";
        ui.gamesPlayedValue.textContent = "0";
        ui.bestAccuracyValue.textContent = "0%";
        return;
    }

    const bestWpm = Math.max(...scores.map((score) => toNumber(score.wpm)));
    const bestScore = Math.max(...scores.map((score) => toNumber(score.score)));
    const bestAccuracy = Math.max(...scores.map((score) => toNumber(score.accuracy)));

    ui.bestWpmValue.textContent = String(bestWpm);
    ui.bestPlayerScoreValue.textContent = String(bestScore);
    ui.gamesPlayedValue.textContent = String(scores.length);
    ui.bestAccuracyValue.textContent = `${bestAccuracy}%`;
}

function renderTable() {
    const allScores = getAllScores();
    updateSummary(allScores);

    const filtered = filterScores(allScores);
    const sorted = sortScores(filtered);

    ui.resultsCount.textContent = `Showing ${sorted.length} result${sorted.length === 1 ? "" : "s"}`;

    if (!sorted.length) {
        ui.scoresTableBody.innerHTML = `
            <tr>
                <td colspan="12">
                    <div class="empty-state">No scores match the selected filter yet.</div>
                </td>
            </tr>
        `;
        return;
    }

    ui.scoresTableBody.innerHTML = sorted.map((score, index) => {
        return `
            <tr>
                <td>
                    <span class="rank-badge ${getRankClass(index)}">${index + 1}</span>
                </td>

                <td>
                    <span class="game-tag ${getGameTagClass(score.gameKey)}">
                        ${escapeHtml(score.gameName)}
                    </span>
                </td>

                <td>
                    <span class="mode-tag">${escapeHtml(formatMode(score))}</span>
                </td>

                <td>
                    <span class="typing-tag">${escapeHtml(formatTypingMode(score.typingMode))}</span>
                </td>

                <td>${escapeHtml(score.score)}</td>
                <td>${escapeHtml(score.computerScore)}</td>

                <td>
                    <span class="winner-tag ${getWinnerClass(score.winner)}">
                        ${escapeHtml(score.winner)}
                    </span>
                </td>

                <td>${escapeHtml(score.wpm)}</td>
                <td>${escapeHtml(score.accuracy)}%</td>
                <td>${escapeHtml(score.errors)}</td>
                <td>${escapeHtml(score.extra)}</td>
                <td>${escapeHtml(formatDate(score.playedAt))}</td>
            </tr>
        `;
    }).join("");
}

/* =========================
   Modal / Toast
========================= */

function setActiveFilter(button) {
    ui.filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
}

function openConfirmModal() {
    if (!ui.confirmOverlay) return;

    ui.confirmOverlay.classList.add("show");
    ui.confirmOverlay.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        if (ui.confirmCancelBtn) {
            ui.confirmCancelBtn.focus();
        }
    }, 50);
}

function closeConfirmModal() {
    if (!ui.confirmOverlay) return;

    ui.confirmOverlay.classList.remove("show");
    ui.confirmOverlay.setAttribute("aria-hidden", "true");
}

function showToast(message) {
    if (!ui.toastMessage) return;

    ui.toastMessage.textContent = message;
    ui.toastMessage.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        ui.toastMessage.classList.remove("show");
    }, 2600);
}

function resetScores() {
    writeStorageArray(STORAGE_KEYS.reverseScores, []);
    writeStorageArray(STORAGE_KEYS.keyboardScores, []);
    writeStorageArray(STORAGE_KEYS.circusScores, []);
    writeStorageArray(STORAGE_KEYS.shooterScores, []);

    localStorage.removeItem(STORAGE_KEYS.shooterNormalBest);
    localStorage.removeItem(STORAGE_KEYS.shooterReverseBest);

    renderTable();
    closeConfirmModal();
    showToast("All saved scores have been reset.");
}

/* =========================
   Events
========================= */

function bindEvents() {
    ui.filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentGameFilter = button.dataset.gameFilter || "all";
            setActiveFilter(button);
            renderTable();
        });
    });

    if (ui.sortSelect) {
        ui.sortSelect.addEventListener("change", () => {
            currentSort = ui.sortSelect.value;
            renderTable();
        });
    }

    if (ui.resetScoresBtn) {
        ui.resetScoresBtn.addEventListener("click", openConfirmModal);
    }

    if (ui.confirmCancelBtn) {
        ui.confirmCancelBtn.addEventListener("click", closeConfirmModal);
    }

    if (ui.confirmDeleteBtn) {
        ui.confirmDeleteBtn.addEventListener("click", resetScores);
    }

    if (ui.confirmOverlay) {
        ui.confirmOverlay.addEventListener("click", (event) => {
            if (event.target === ui.confirmOverlay) {
                closeConfirmModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            ui.confirmOverlay &&
            ui.confirmOverlay.classList.contains("show")
        ) {
            closeConfirmModal();
        }
    });
}

function initScoresPage() {
    bindEvents();
    renderTable();
}

document.addEventListener("DOMContentLoaded", initScoresPage);