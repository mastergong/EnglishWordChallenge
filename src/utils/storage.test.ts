import { describe, expect, it, beforeEach } from "vitest";
import { loadSettings, saveSettings, resetLocalStorage } from "./storage";
import { DEFAULT_SETTINGS } from "../types/game";

describe("storage", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("returns defaults for empty storage", () => {
    expect(loadSettings().countdownSec).toBe(DEFAULT_SETTINGS.countdownSec);
  });

  it("persists valid settings", () => {
    saveSettings({ ...DEFAULT_SETTINGS, sound: false, voice: "en-GB" });
    expect(loadSettings().sound).toBe(false);
    expect(loadSettings().voice).toBe("en-GB");
  });

  it("merges confirmSubmit default for older saved settings", () => {
    expect(loadSettings().confirmSubmit).toBe(true);
    saveSettings({ ...DEFAULT_SETTINGS, confirmSubmit: false });
    expect(loadSettings().confirmSubmit).toBe(false);
  });

  it("resets corrupted settings", () => {
    localStorage.setItem("ewc.settings", "{not json");
    expect(loadSettings().theme).toBe("system");
  });
});
