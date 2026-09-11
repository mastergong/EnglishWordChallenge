import { describe, expect, it } from "vitest";
import { letterPlaySlotMs, lettersOf, letterAudioSrc, quizSpeechParts, spellingGuide } from "./speech";

describe("spellingGuide", () => {
  it("lists English letters for able", () => {
    expect(lettersOf("able")).toEqual(["A", "B", "L", "E"]);
    expect(spellingGuide("able").map((item) => item.thai)).toEqual(["เอ", "บี", "เอล", "อี"]);
  });

  it("skips spaces and punctuation", () => {
    expect(lettersOf("ice-cream")).toEqual(["I", "C", "E", "C", "R", "E", "A", "M"]);
  });

  it("points letter clips at the audio folder", () => {
    expect(letterAudioSrc("A")).toBe("/audio/a_letter.mp3");
    expect(letterAudioSrc("b")).toBe("/audio/b_letter.mp3");
  });

  it("keeps a minimum slot so short letter clips are not cut off", () => {
    expect(letterPlaySlotMs(0.12)).toBeGreaterThanOrEqual(420);
    expect(letterPlaySlotMs(0.6)).toBeGreaterThan(600);
  });
});

describe("quizSpeechParts", () => {
  it("speaks only English or only Thai from the setting", () => {
    expect(quizSpeechParts("en", "able", "สามารถ", true)).toEqual({ english: "able" });
    expect(quizSpeechParts("th", "able", "สามารถ", true)).toEqual({ thai: "สามารถ" });
  });

  it("omits English when the answer would be spoken", () => {
    expect(quizSpeechParts("en", "able", "สามารถ", false)).toEqual({});
    expect(quizSpeechParts("th", "able", "สามารถ", false)).toEqual({ thai: "สามารถ" });
  });
});
