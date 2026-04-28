// js/storage.js

import { STORAGE_KEYS } from "./gamedata.js";

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

export function getSettings() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.settings), {});
}

export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function getHighScores() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.highScores), []);
}

export function saveHighScores(scores) {
    localStorage.setItem(STORAGE_KEYS.highScores, JSON.stringify(scores));
}

export function clearHighScores() {
    localStorage.removeItem(STORAGE_KEYS.highScores);
}

export function getCurrentGame() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.currentGame), null);
}

export function saveCurrentGame(gameData) {
    localStorage.setItem(STORAGE_KEYS.currentGame, JSON.stringify(gameData));
}

export function clearCurrentGame() {
    localStorage.removeItem(STORAGE_KEYS.currentGame);
}

export function getAchievements() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.achievements), []);
}

export function saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
}

export function clearAchievements() {
    localStorage.removeItem(STORAGE_KEYS.achievements);
}

export function getAchievementHistory() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.achievementHistory), []);
}

export function saveAchievementHistory(history) {
    localStorage.setItem(STORAGE_KEYS.achievementHistory, JSON.stringify(history));
}

export function clearAchievementHistory() {
    localStorage.removeItem(STORAGE_KEYS.achievementHistory);
}