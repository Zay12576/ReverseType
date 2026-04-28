// js/gamedata.js

export const STORAGE_KEYS = {
    highScores: "rtgHighScores",
    currentGame: "rtgCurrentGame",
    settings: "rtgSettings",
    achievements: "rtgAchievements",
    achievementHistory: "rtgAchievementHistory"
};

export const GAME_MODES = {
    classic: {
        label: "Classic",
        time: 30,
        lives: 3,
        multiplier: 1,
        answersToLevelUp: 3
    },
    rush: {
        label: "Time Rush",
        time: 18,
        lives: 3,
        multiplier: 1.35,
        answersToLevelUp: 3
    },
    endless: {
        label: "Endless",
        time: 24,
        lives: 4,
        multiplier: 1.15,
        answersToLevelUp: 2
    },
    hardcore: {
        label: "Hardcore",
        time: 14,
        lives: 2,
        multiplier: 1.7,
        answersToLevelUp: 3
    }
};

export const DEFAULT_SETTINGS = {
    soundEnabled: true,
    reducedMotion: false,
    highContrast: false,
    preferredMode: "classic",
    theme: "purple",
    fontSize: 16
};

export const DEFAULT_GAME_STATE = {
    mode: "classic",
    level: 1,
    score: 0,
    lives: 3,
    timeLeft: 30,
    currentWord: "",
    correctAnswer: "",
    isRunning: false,
    isPaused: false,
    totalAnswered: 0,
    totalCorrect: 0,
    streak: 0,
    bestStreak: 0,
    correctThisLevel: 0
};