// js/achievements.js

import {
    getAchievements,
    getAchievementHistory,
    clearAchievements,
    clearAchievementHistory
} from "./storage.js";

import { ACHIEVEMENTS } from "./achievements-data.js";
import { applySavedTheme } from "./ui.js";

const STORAGE_KEYS = {
    achievements: "rtgAchievements",
    achievementHistory: "rtgAchievementHistory",

    reverseScores: "rtgHighScores",
    keyboardScores: "keyboardJumpHighScores",
    circusScores: "circusTypingHighScores",

    shooterScores: "typingShooterScores",
    shooterNormalBest: "ztypeNormalBest",
    shooterReverseBest: "ztypeReverseBest"
};

const ui = {
    unlockedCount: document.getElementById("unlockedCount"),
    lockedCount: document.getElementById("lockedCount"),
    totalCount: document.getElementById("totalCount"),
    latestUnlock: document.getElementById("latestUnlock"),
    completionBadge: document.getElementById("completionBadge"),

    // supports both possible IDs
    achievementsGrid: document.getElementById("achievementsGrid") ||
        document.getElementById("achievementGrid"),

    resultsCountLabel: document.getElementById("resultsCountLabel"),
    recentUnlockList: document.getElementById("recentUnlockList"),

    filterButtons: document.querySelectorAll(".filter-btn"),
    resetAchievementsBtn: document.getElementById("resetAchievementsBtn")
};

let currentFilter = "all";

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function readStorageArray(key) {
    const data = safeParse(localStorage.getItem(key), []);
    return Array.isArray(data) ? data : [];
}

function getSavedAchievementList() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEYS.achievements), []);
    return Array.isArray(stored) ? stored : [];
}

function getSavedAchievementHistory() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEYS.achievementHistory), []);
    return Array.isArray(stored) ? stored : [];
}

function saveAchievementList(list) {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(list));
}

function saveAchievementHistory(list) {
    localStorage.setItem(STORAGE_KEYS.achievementHistory, JSON.stringify(list));
}

function getAchievementIdList(list) {
    return list.map((item) => {
        if (typeof item === "string") return item;
        return item.id;
    }).filter(Boolean);
}

function unlockAchievement(id, unlockedList, historyList) {
    const unlockedIds = getAchievementIdList(unlockedList);

    if (unlockedIds.includes(id)) {
        return;
    }

    unlockedList.push({
        id,
        unlockedAt: new Date().toISOString()
    });

    historyList.push({
        id,
        unlockedAt: new Date().toISOString()
    });
}

/* =========================
 Score Normalizers
========================= */

function normaliseReverseScore(score) {
    return {
        gameKey: "reverse",
        mode: score.mode || "",
        score: toNumber(score.score),
        level: toNumber(score.level),
        wave: 0,
        accuracy: toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        typingMode: score.typingMode || "",
        empUsed: 0
    };
}

function normaliseKeyboardScore(score) {
    return {
        gameKey: "keyboard",
        mode: score.mode || score.difficulty || "",
        score: toNumber(score.score),
        level: toNumber(score.level),
        wave: 0,
        accuracy: toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        typingMode: score.typingMode || "",
        empUsed: 0
    };
}

function normaliseCircusScore(score) {
    return {
        gameKey: "circus",
        mode: score.mode || score.difficulty || "",
        score: toNumber(score.score),
        level: toNumber(score.level),
        wave: 0,
        accuracy: toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak),
        typingMode: score.typingMode || "",
        empUsed: 0
    };
}

function normaliseShooterScore(score) {
    return {
        gameKey: "shooter",
        mode: score.mode || "Space",
        score: toNumber(score.score),
        level: 0,
        wave: toNumber(score.wave),
        accuracy: toNumber(score.accuracy),
        bestStreak: toNumber(score.bestStreak || score.longestStreak),
        typingMode: score.typingMode || "normal",
        empUsed: toNumber(score.empUsed)
    };
}

function getShooterBestScores() {
    const normalBest = toNumber(localStorage.getItem(STORAGE_KEYS.shooterNormalBest));
    const reverseBest = toNumber(localStorage.getItem(STORAGE_KEYS.shooterReverseBest));

    const scores = [];

    if (normalBest > 0) {
        scores.push({
            gameKey: "shooter",
            mode: "Space",
            score: normalBest,
            level: 0,
            wave: 0,
            accuracy: 0,
            bestStreak: 0,
            typingMode: "normal",
            empUsed: 0
        });
    }

    if (reverseBest > 0) {
        scores.push({
            gameKey: "shooter",
            mode: "Space",
            score: reverseBest,
            level: 0,
            wave: 0,
            accuracy: 0,
            bestStreak: 0,
            typingMode: "reverse",
            empUsed: 0
        });
    }

    return scores;
}

function getAllGameScores() {
    const reverseScores = readStorageArray(STORAGE_KEYS.reverseScores).map(normaliseReverseScore);
    const keyboardScores = readStorageArray(STORAGE_KEYS.keyboardScores).map(normaliseKeyboardScore);
    const circusScores = readStorageArray(STORAGE_KEYS.circusScores).map(normaliseCircusScore);
    const shooterScores = readStorageArray(STORAGE_KEYS.shooterScores).map(normaliseShooterScore);
    const shooterBestScores = getShooterBestScores();

    return [
        ...reverseScores,
        ...keyboardScores,
        ...circusScores,
        ...shooterScores,
        ...shooterBestScores
    ];
}

/* =========================
 Auto Unlock Logic
========================= */

function syncAchievementsFromScores() {
    const scores = getAllGameScores();
    const shooterScores = scores.filter((score) => score.gameKey === "shooter");

    const unlockedList = getSavedAchievementList();
    const historyList = getSavedAchievementHistory();

    if (scores.length >= 1) {
        unlockAchievement("first-game", unlockedList, historyList);
    }

    if (scores.some((score) => score.score >= 100)) {
        unlockAchievement("score-100", unlockedList, historyList);
    }

    if (scores.some((score) => score.score >= 500)) {
        unlockAchievement("score-500", unlockedList, historyList);
    }

    if (scores.some((score) => score.score >= 1000)) {
        unlockAchievement("score-1000", unlockedList, historyList);
    }

    if (scores.some((score) => score.level >= 5 || score.wave >= 5)) {
        unlockAchievement("level-5", unlockedList, historyList);
    }

    if (scores.some((score) => score.level >= 10 || score.wave >= 10)) {
        unlockAchievement("level-10", unlockedList, historyList);
    }

    if (scores.some((score) => score.accuracy >= 90)) {
        unlockAchievement("accuracy-90", unlockedList, historyList);
    }

    if (scores.some((score) => score.bestStreak >= 5)) {
        unlockAchievement("streak-5", unlockedList, historyList);
    }

    if (scores.some((score) => score.bestStreak >= 10)) {
        unlockAchievement("streak-10", unlockedList, historyList);
    }

    if (scores.some((score) => String(score.mode).toLowerCase() === "hardcore")) {
        unlockAchievement("hardcore-finish", unlockedList, historyList);
    }

    // Typing Shooter achievements
    if (shooterScores.length >= 1) {
        unlockAchievement("shooter-first-run", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.score >= 300)) {
        unlockAchievement("shooter-score-300", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.score >= 500)) {
        unlockAchievement("shooter-score-500", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.wave >= 3)) {
        unlockAchievement("shooter-wave-3", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.wave >= 5)) {
        unlockAchievement("shooter-wave-5", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.accuracy >= 90)) {
        unlockAchievement("shooter-accuracy-90", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.bestStreak >= 5)) {
        unlockAchievement("shooter-streak-5", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.typingMode === "reverse")) {
        unlockAchievement("shooter-reverse-run", unlockedList, historyList);
    }

    if (shooterScores.some((score) => score.empUsed >= 1)) {
        unlockAchievement("shooter-emp-user", unlockedList, historyList);
    }

    saveAchievementList(unlockedList);
    saveAchievementHistory(historyList);
}

/* =========================
 Render Helpers
========================= */

function getLatestUnlock(history) {
    const sorted = [...history].sort((a, b) => {
        return new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime();
    });

    return sorted[0] || null;
}

function formatDate(value) {
    if (!value) return "Unknown";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleString();
}

function updateSummary(unlocked, history) {
    if (!ui.unlockedCount) return;

    const unlockedIds = getAchievementIdList(unlocked);
    const total = ACHIEVEMENTS.length;
    const unlockedCount = unlockedIds.length;
    const lockedCount = total - unlockedCount;
    const latest = getLatestUnlock(history);
    const percentage = total ? Math.round((unlockedCount / total) * 100) : 0;

    ui.unlockedCount.textContent = String(unlockedCount);
    ui.lockedCount.textContent = String(lockedCount);
    ui.totalCount.textContent = String(total);

    const latestAchievement = latest ?
        ACHIEVEMENTS.find((item) => item.id === latest.id) :
        null;

    ui.latestUnlock.textContent = latestAchievement ?
        latestAchievement.title :
        "None";

    ui.completionBadge.textContent = `${percentage}% Complete`;

    if (percentage === 100) {
        ui.completionBadge.className = "pill success";
    } else if (percentage > 0) {
        ui.completionBadge.className = "pill warning";
    } else {
        ui.completionBadge.className = "pill";
    }
}

function filterAchievements(unlockedIds) {
    if (currentFilter === "unlocked") {
        return ACHIEVEMENTS.filter((item) => unlockedIds.includes(item.id));
    }

    if (currentFilter === "locked") {
        return ACHIEVEMENTS.filter((item) => !unlockedIds.includes(item.id));
    }

    if (currentFilter === "progress") {
        return ACHIEVEMENTS.filter((item) => {
            return item.id.includes("first") ||
                item.id.includes("level") ||
                item.id.includes("wave") ||
                item.id.includes("shooter-first");
        });
    }

    if (currentFilter === "challenge") {
        return ACHIEVEMENTS.filter((item) => {
            return !item.id.includes("first");
        });
    }

    return ACHIEVEMENTS;
}

function renderRecentUnlocks(history) {
    if (!ui.recentUnlockList) return;

    if (!history.length) {
        ui.recentUnlockList.innerHTML = `
          <div class="empty-state">
              No achievements unlocked yet. Play the game to begin earning rewards.
          </div>
      `;
        return;
    }

    const sorted = [...history]
        .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
        .slice(0, 3);

    ui.recentUnlockList.innerHTML = sorted.map((item) => {
        const achievement = ACHIEVEMENTS.find((achievementItem) => achievementItem.id === item.id);

        if (!achievement) return "";

        return `
          <div class="recent-item">
              <div class="recent-icon" aria-hidden="true">🏆</div>
              <div>
                  <h4>${achievement.title}</h4>
                  <p>${formatDate(item.unlockedAt)}</p>
              </div>
          </div>
      `;
    }).join("");
}

function renderAchievements() {
    syncAchievementsFromScores();

    const unlocked = getAchievements();
    const history = getAchievementHistory();
    const unlockedIds = getAchievementIdList(unlocked);

    updateSummary(unlocked, history);
    renderRecentUnlocks(history);

    const filtered = filterAchievements(unlockedIds);

    if (ui.resultsCountLabel) {
        ui.resultsCountLabel.textContent = `Showing ${filtered.length}`;
    }

    if (!ui.achievementsGrid) return;

    if (!filtered.length) {
        ui.achievementsGrid.innerHTML = `
          <div class="empty-state">No achievements match this filter.</div>
      `;
        return;
    }

    ui.achievementsGrid.innerHTML = filtered.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                const unlockRecord = history.find((entry) => entry.id === achievement.id);

                return `
          <article class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
              <div class="achievement-top">
                  <span class="achievement-status ${isUnlocked ? "success" : "warning"}">
                      ${isUnlocked ? "Unlocked" : "Locked"}
                  </span>
              </div>

              <h3>${achievement.title}</h3>
              <p>${achievement.description}</p>

              <div class="achievement-condition">${achievement.condition}</div>

              <small>
                  ${
                      isUnlocked && unlockRecord
                          ? `Unlocked on ${formatDate(unlockRecord.unlockedAt)}`
                          : "Not unlocked yet"
                  }
              </small>
          </article>
      `;
  }).join("");
}

/* =========================
 Events
========================= */

function setActiveFilter(button) {
  ui.filterButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function bindEvents() {
  ui.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
          currentFilter = button.dataset.filter || "all";
          setActiveFilter(button);
          renderAchievements();
      });
  });

  if (ui.resetAchievementsBtn) {
      ui.resetAchievementsBtn.addEventListener("click", () => {
          const confirmed = window.confirm("Are you sure you want to reset all achievements?");
          if (!confirmed) return;

          clearAchievements();
          clearAchievementHistory();
          renderAchievements();

          window.alert("Achievements have been reset.");
      });
  }
}

function init() {
  applySavedTheme();
  bindEvents();
  renderAchievements();
}

document.addEventListener("DOMContentLoaded", init);