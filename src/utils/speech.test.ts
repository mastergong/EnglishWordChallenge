import { describe, expect, it } from "vitest";
import { lettersOf, letterAudioSrc, spellingGuide } from "./speech";

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
