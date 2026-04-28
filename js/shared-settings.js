/* =====================================================
   ReverseType Shared Settings JavaScript
   Add this JS file to every page.
===================================================== */

const REVERSE_TYPE_SETTINGS_KEY = "rtgSettings";

const REVERSE_TYPE_DEFAULT_SETTINGS = {
    soundEnabled: true,
    reducedMotion: false,
    highContrast: false,
    preferredMode: "classic",
    theme: "purple",
    fontSize: 16
};

function rtSafeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function rtLoadSettings() {
    const stored = rtSafeParse(
        localStorage.getItem(REVERSE_TYPE_SETTINGS_KEY),
        REVERSE_TYPE_DEFAULT_SETTINGS
    );

    return {
        soundEnabled: typeof stored.soundEnabled === "boolean" ? stored.soundEnabled : true,
        reducedMotion: typeof stored.reducedMotion === "boolean" ? stored.reducedMotion : false,
        highContrast: typeof stored.highContrast === "boolean" ? stored.highContrast : false,
        preferredMode: typeof stored.preferredMode === "string" ? stored.preferredMode : "classic",
        theme: typeof stored.theme === "string" ? stored.theme : "purple",
        fontSize: Number(stored.fontSize) || 16
    };
}

function rtSaveSettings(settings) {
    localStorage.setItem(REVERSE_TYPE_SETTINGS_KEY, JSON.stringify(settings));
}

function rtApplySettings() {
    const settings = rtLoadSettings();

    document.body.classList.remove(
        "theme-purple",
        "theme-blue",
        "theme-green",
        "high-contrast",
        "reduced-motion",
        "sound-on",
        "sound-off",
        "mode-classic",
        "mode-rush",
        "mode-endless",
        "mode-hardcore"
    );

    const themeClass = `theme-${settings.theme}`;
    const modeClass = `mode-${settings.preferredMode}`;

    document.body.classList.add(themeClass);
    document.body.classList.add(modeClass);

    if (settings.highContrast) {
        document.body.classList.add("high-contrast");
    }

    if (settings.reducedMotion) {
        document.body.classList.add("reduced-motion");
    }

    if (settings.soundEnabled) {
        document.body.classList.add("sound-on");
    } else {
        document.body.classList.add("sound-off");
    }

    document.documentElement.style.setProperty("--base-font-size", `${settings.fontSize}px`);

    window.reverseTypeSettings = settings;

    rtApplyPreferredModeToForms(settings);
}

function rtApplyPreferredModeToForms(settings) {
    const possibleModeSelectIds = [
        "modeSelect",
        "gameMode",
        "preferredMode",
        "mode",
        "difficultyMode"
    ];

    possibleModeSelectIds.forEach((id) => {
        const select = document.getElementById(id);

        if (select && select.tagName === "SELECT") {
            const optionExists = Array.from(select.options).some((option) => {
                return option.value === settings.preferredMode;
            });

            if (optionExists) {
                select.value = settings.preferredMode;
            }
        }
    });

    const modeButtons = document.querySelectorAll("[data-mode]");

    modeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === settings.preferredMode);
        button.setAttribute(
            "aria-pressed",
            button.dataset.mode === settings.preferredMode ? "true" : "false"
        );
    });
}

function rtShouldPlaySound() {
    const settings = rtLoadSettings();
    return settings.soundEnabled !== false;
}

function rtPlaySound(audioElement) {
    if (!audioElement) {
        return;
    }

    if (!rtShouldPlaySound()) {
        return;
    }

    try {
        audioElement.currentTime = 0;
        audioElement.play();
    } catch (error) {
        console.warn("Sound could not be played:", error);
    }
}

function rtGetPreferredMode() {
    const settings = rtLoadSettings();
    return settings.preferredMode || "classic";
}

function rtGetTheme() {
    const settings = rtLoadSettings();
    return settings.theme || "purple";
}

function rtRefreshSettings() {
    rtApplySettings();
}

document.addEventListener("DOMContentLoaded", rtApplySettings);

window.addEventListener("storage", (event) => {
    if (event.key === REVERSE_TYPE_SETTINGS_KEY) {
        rtApplySettings();
    }
});