import { useCallback, useEffect, useState } from "react";

import {
  applyPreferences,
  defaultPreferences,
  PREFS_EVENT,
  readPreferences,
  writePreferences,
  type Preferences,
} from "@/lib/preferences";

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const sync = () => {
      const next = readPreferences();
      setPrefs(next);
      applyPreferences(next);
    };
    sync();
    window.addEventListener(PREFS_EVENT, sync);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener(PREFS_EVENT, sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  const update = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const next = { ...readPreferences(), [key]: value };
    writePreferences(next);
    applyPreferences(next);
    setPrefs(next);
  }, []);

  return { prefs, update };
}
