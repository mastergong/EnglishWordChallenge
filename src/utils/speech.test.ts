import { describe, expect, it } from "vitest";
import { lettersOf, letterAudioSrc, quizSpeechParts, spellingGuide } from "./speech";

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
});

describe("quizSpeechParts", () => {
  it("speaks English then Thai when both are allowed", () => {
    expect(quizSpeechParts("both", "able", "สามารถ", true)).toEqual({
      english: "able",
      thai: "สามารถ",
    });
  });

  it("omits English on Thai-to-English items so the answer is not spoken", () => {
    expect(quizSpeechParts("both", "able", "สามารถ", false)).toEqual({ thai: "สามารถ" });
    expect(quizSpeechParts("en", "able", "สามารถ", false)).toEqual({});
  });
});
