import { describe, expect, it } from "vitest";
import { buildRhymeFamilies, familyTitle, rhymeKey } from "./rhymeMap";
import type { Word } from "../types/word";

function stub(id: number, word: string, ipa = `/${word}/`): Word {
  return {
    id,
    word,
    meaningTh: word,
    meaningEn: word,
    ipa,
    phoneticThai: word,
    level: "A1",
    partOfSpeech: "noun",
    category: "Food",
    difficulty: 1,
    example: word,
    exampleThai: word,
  };
}

describe("rhyme mind map", () => {
  it("groups ice → rice → price by the same ending", () => {
    expect(rhymeKey("ice", "/aɪs/")).toBe(rhymeKey("rice", "/raɪs/"));
    expect(rhymeKey("rice", "/raɪs/")).toBe(rhymeKey("price", "/praɪs/"));
    const families = buildRhymeFamilies([
      stub(1, "ice", "/aɪs/"),
      stub(2, "rice", "/raɪs/"),
      stub(3, "price", "/praɪs/"),
      stub(4, "office", "/ˈɒf.ɪs/"),
      stub(5, "cat", "/kæt/"),
    ]);
    const ice = families.find((family) => family.words.some((item) => item.word === "ice"));
    expect(ice?.words.map((item) => item.word)).toEqual(["ice", "rice", "price"]);
    expect(familyTitle(ice!)).toMatch(/ice|aɪs|-/);
  });
});
