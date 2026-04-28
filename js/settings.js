// js/settings.js

import { DEFAULT_SETTINGS } from "./gamedata.js";
import {
    getSettings,
    saveSettings,
    clearCurrentGame,
    clearHighScores,
    clearAchievements,
    clearAchievementHistory
} from "./storage.js";

const ui = {
    settingsBadge: document.getElementById("settingsBadge"),
    summaryTheme: document.getElementById("summaryTheme"),
    summarySound: document.getElementById("summarySound"),
    summaryMode: document.getElementById("summaryMode"),
    summaryAccessibility: document.getElementById("summaryAccessibility"),

    themeButtons: document.querySelectorAll(".theme-btn"),
    fontSizeRange: document.getElementById("fontSizeRange"),
    fontSizeValue: document.getElementById("fontSizeValue"),
    preferredMode: document.getElementById("preferredMode"),
    soundToggle: document.getElementById("soundToggle"),
    motionToggle: document.getElementById("motionToggle"),
    contrastToggle: document.getElementById("contrastToggle"),

    previewThemeLabel: document.getElementById("previewThemeLabel"),
    previewMotionLabel: document.getElementById("previewMotionLabel"),

    resetCurrentGameBtn: document.getElementById("resetCurrentGameBtn"),
    resetScoresBtn: document.getElementById("resetScoresBtn"),
    resetAchievementsBtn: document.getElementById("resetAchievementsBtn"),
    restoreDefaultsBtn: document.getElementById("restoreDefaultsBtn"),
    statusMessage: document.getElementById("statusMessage")
};

let settings = {...DEFAULT_SETTINGS };

function formatModeLabel(mode) {
    const map = {
        classic: "Classic",
        rush: "Time Rush",
        endless: "Endless",
        hardcore: "Hardcore"
    };
    return map[mode] || "Classic";
}

function formatThemeLabel(theme) {
    const map = {
        purple: "Purple",
        blue: "Blue",
        green: "Green"
    };
    return map[theme] || "Purple";
}

function updateStatus(message, type = "success") {
    ui.statusMessage.textContent = message;
    ui.statusMessage.className = "status-box";
    if (type === "warning") {
        ui.statusMessage.classList.add("warning");
    }
}

function applyTheme(theme) {
    document.body.classList.remove("theme-blue", "theme-green");
    if (theme === "blue") {
        document.body.classList.add("theme-blue");
    } else if (theme === "green") {
        document.body.classList.add("theme-green");
    }
}

function applyContrast(enabled) {
    document.body.classList.toggle("high-contrast", enabled);
}

function applyFontSize(size) {
    document.documentElement.style.setProperty("--base-font-size", `${size}px`);
}

function applyMotionPreference(enabled) {
    document.documentElement.style.scrollBehavior = enabled ? "auto" : "smooth";
}

function syncControls() {
    ui.soundToggle.checked = settings.soundEnabled;
    ui.motionToggle.checked = settings.reducedMotion;
    ui.contrastToggle.checked = settings.highContrast;
    ui.preferredMode.value = settings.preferredMode;
    ui.fontSizeRange.value = settings.fontSize;
    ui.fontSizeValue.textContent = `${settings.fontSize}px`;

    ui.themeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.theme === settings.theme);
    });
}

function updateSummary() {
    ui.summaryTheme.textContent = formatThemeLabel(settings.theme);
    ui.summarySound.textContent = settings.soundEnabled ? "On" : "Off";
    ui.summaryMode.textContent = formatModeLabel(settings.preferredMode);

    const accessibilityParts = [];
    if (settings.highContrast) accessibilityParts.push("High Contrast");
    if (settings.reducedMotion) accessibilityParts.push("Reduced Motion");

    ui.summaryAccessibility.textContent = accessibilityParts.length ?
        accessibilityParts.join(" + ") :
        "Standard";

    ui.previewThemeLabel.textContent = formatThemeLabel(settings.theme);
    ui.previewMotionLabel.textContent = settings.reducedMotion ? "Motion Reduced" : "Motion On";

    const anyCustom =
        settings.theme !== DEFAULT_SETTINGS.theme ||
        settings.fontSize !== DEFAULT_SETTINGS.fontSize ||
        settings.preferredMode !== DEFAULT_SETTINGS.preferredMode ||
        settings.soundEnabled !== DEFAULT_SETTINGS.soundEnabled ||
        settings.reducedMotion !== DEFAULT_SETTINGS.reducedMotion ||
        settings.highContrast !== DEFAULT_SETTINGS.highContrast;

    if (anyCustom) {
        ui.settingsBadge.textContent = "Customised";
        ui.settingsBadge.className = "pill success";
    } else {
        ui.settingsBadge.textContent = "Default";
        ui.settingsBadge.className = "pill warning";
    }
}

function applyAllSettings() {
    applyTheme(settings.theme);
    applyContrast(settings.highContrast);
    applyFontSize(settings.fontSize);
    applyMotionPreference(settings.reducedMotion);
    syncControls();
    updateSummary();
}

function persistAndApply(message = "Settings saved successfully.") {
    saveSettings(settings);
    applyAllSettings();
    updateStatus(message, "success");
}

function bindThemeButtons() {
    ui.themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            settings.theme = button.dataset.theme;
            persistAndApply(`Theme changed to ${formatThemeLabel(settings.theme)}.`);
        });
    });
}

function bindFormControls() {
    ui.fontSizeRange.addEventListener("input", () => {
        settings.fontSize = Number(ui.fontSizeRange.value);
        applyFontSize(settings.fontSize);
        ui.fontSizeValue.textContent = `${settings.fontSize}px`;
        updateSummary();
    });

    ui.fontSizeRange.addEventListener("change", () => {
        settings.fontSize = Number(ui.fontSizeRange.value);
        persistAndApply(`Font size changed to ${settings.fontSize}px.`);
    });

    ui.preferredMode.addEventListener("change", () => {
        settings.preferredMode = ui.preferredMode.value;
        persistAndApply(`Preferred mode set to ${formatModeLabel(settings.preferredMode)}.`);
    });

    ui.soundToggle.addEventListener("change", () => {
        settings.soundEnabled = ui.soundToggle.checked;
        persistAndApply(`Sound effects turned ${settings.soundEnabled ? "on" : "off"}.`);
    });

    ui.motionToggle.addEventListener("change", () => {
        settings.reducedMotion = ui.motionToggle.checked;
        persistAndApply(`Reduced motion turned ${settings.reducedMotion ? "on" : "off"}.`);
    });

    ui.contrastToggle.addEventListener("change", () => {
        settings.highContrast = ui.contrastToggle.checked;
        persistAndApply(`High contrast mode turned ${settings.highContrast ? "on" : "off"}.`);
    });
}

function resetCurrentGame() {
    const confirmed = window.confirm("Are you sure you want to delete the saved game session?");
    if (!confirmed) return;

    clearCurrentGame();
    updateStatus("Saved game session has been reset.", "warning");
}

function resetScores() {
    const confirmed = window.confirm("Are you sure you want to delete all scores and statistics?");
    if (!confirmed) return;

    clearHighScores();
    updateStatus("Scores and statistics have been reset.", "warning");
}

function resetAchievements() {
    const confirmed = window.confirm("Are you sure you want to delete all achievement progress?");
    if (!confirmed) return;

    clearAchievements();
    clearAchievementHistory();
    updateStatus("Achievements have been reset.", "warning");
}

function restoreDefaults() {
    const confirmed = window.confirm("Restore all settings to default values?");
    if (!confirmed) return;

    settings = {...DEFAULT_SETTINGS };
    persistAndApply("Default settings restored.");
}

function bindDataButtons() {
    ui.resetCurrentGameBtn.addEventListener("click", resetCurrentGame);
    ui.resetScoresBtn.addEventListener("click", resetScores);
    ui.resetAchievementsBtn.addEventListener("click", resetAchievements);
    ui.restoreDefaultsBtn.addEventListener("click", restoreDefaults);
}

function init() {
    settings = {
        ...DEFAULT_SETTINGS,
        ...getSettings()
    };

    applyAllSettings();
    bindThemeButtons();
    bindFormControls();
    bindDataButtons();
    updateStatus("Settings loaded successfully.", "success");
}

document.addEventListener("DOMContentLoaded", init);