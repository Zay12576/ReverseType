// js/ui.js

import { getSettings } from "./storage.js";

export function applySavedTheme() {
    const settings = getSettings();

    document.body.classList.remove("theme-blue", "theme-green", "high-contrast");

    if (settings.theme === "blue") {
        document.body.classList.add("theme-blue");
    } else if (settings.theme === "green") {
        document.body.classList.add("theme-green");
    }

    if (settings.highContrast) {
        document.body.classList.add("high-contrast");
    }

    if (settings.fontSize) {
        document.documentElement.style.setProperty("--base-font-size", `${settings.fontSize}px`);
    }
}