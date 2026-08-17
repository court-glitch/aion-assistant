export type Theme = "light" | "dark" | "system";
export type Accent = "indigo" | "violet" | "purple";
export type FontSize = "small" | "medium" | "large";
export type Moderation = "strict" | "moderate" | "lenient";
export type Citation = "always" | "on-request" | "never";

export type Preferences = {
  theme: Theme;
  accent: Accent;
  fontSize: FontSize;
  moderation: Moderation;
  transparency: boolean;
  citation: Citation;
};

export const defaultPreferences: Preferences = {
  theme: "dark",
  accent: "indigo",
  fontSize: "medium",
  moderation: "moderate",
  transparency: false,
  citation: "on-request",
};

const KEY = "aion.preferences";
export const PREFS_EVENT = "aion:preferences";

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) };
  } catch {
    return defaultPreferences;
  }
}

export function writePreferences(prefs: Preferences) {
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

export function applyPreferences(prefs: Preferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark =
    prefs.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : prefs.theme === "dark";

  root.classList.toggle("dark", prefersDark);
  root.classList.toggle("light", !prefersDark);
  root.dataset["accent"] = prefs.accent;
  root.dataset["fontSize"] = prefs.fontSize;
}
