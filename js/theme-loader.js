(function() {
    const SETTINGS_KEY = "rtgSettings";

    const DEFAULT_SETTINGS = {
        theme: "purple",
        highContrast: false,
        fontSize: 16,
        reducedMotion: false
    };

    function safeParse(value, fallback) {
        try {
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function loadSettings() {
        const stored = safeParse(localStorage.getItem(SETTINGS_KEY), DEFAULT_SETTINGS);

        return {
            theme: typeof stored.theme === "string" ? stored.theme : DEFAULT_SETTINGS.theme,
            highContrast: typeof stored.highContrast === "boolean" ? stored.highContrast : DEFAULT_SETTINGS.highContrast,
            fontSize: Number(stored.fontSize) || DEFAULT_SETTINGS.fontSize,
            reducedMotion: typeof stored.reducedMotion === "boolean" ? stored.reducedMotion : DEFAULT_SETTINGS.reducedMotion
        };
    }

    function applyTheme(settings) {
        document.body.classList.remove("theme-blue", "theme-green", "theme-light", "high-contrast");

        if (settings.theme === "blue") {
            document.body.classList.add("theme-blue");
        }

        if (settings.theme === "green") {
            document.body.classList.add("theme-green");
        }

        if (settings.theme === "light") {
            document.body.classList.add("theme-light");
        }

        if (settings.highContrast) {
            document.body.classList.add("high-contrast");
        }

        document.documentElement.style.setProperty("--base-font-size", `${settings.fontSize}px`);
        document.documentElement.style.scrollBehavior = settings.reducedMotion ? "auto" : "smooth";
    }

    function initTheme() {
        const settings = loadSettings();
        applyTheme(settings);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }

    window.addEventListener("storage", function(event) {
        if (event.key === SETTINGS_KEY) {
            initTheme();
        }
    });
})();