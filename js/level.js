// js/level.js

import { GAME_MODES } from "./gamedata.js";

const WORD_BANK = {
    easy: ["NEON", "MOON", "STAR", "PLAY", "FAST", "TYPE", "JUMP", "WAVE", "CODE", "GLOW"],
    medium: ["PURPLE", "PLAYER", "STREAK", "SCORE", "BUTTON", "RAPID", "TARGET", "CODING"],
    hard: ["JAVASCRIPT", "CHALLENGE", "KEYBOARD", "ACCURACY", "REVERSE", "INTERFACE"],
    expert: ["NEON CHARGE", "QUICK REACTION", "REVERSE TYPING", "HARDCORE MODE"]
};

export function getDifficulty(level) {
    if (level <= 3) return "easy";
    if (level <= 6) return "medium";
    if (level <= 9) return "hard";
    return "expert";
}

export function getWordForLevel(level) {
    const difficulty = getDifficulty(level);
    const bank = WORD_BANK[difficulty];
    return bank[Math.floor(Math.random() * bank.length)];
}

export function getRoundTime(mode, level) {
    const base = GAME_MODES[mode].time;
    let reduction = 0;

    if (mode === "classic") reduction = Math.floor((level - 1) * 1);
    if (mode === "rush") reduction = Math.floor((level - 1) * 0.8);
    if (mode === "endless") reduction = Math.floor((level - 1) * 0.5);
    if (mode === "hardcore") reduction = Math.floor((level - 1) * 0.9);

    return Math.max(6, base - reduction);
}

export function calculatePoints(mode, level, timeLeft, streak) {
    const base = 40 + level * 10;
    const speedBonus = Math.max(0, timeLeft) * 4;
    const streakBonus = Math.min(50, streak * 3);
    return Math.floor((base + speedBonus + streakBonus) * GAME_MODES[mode].multiplier);
}