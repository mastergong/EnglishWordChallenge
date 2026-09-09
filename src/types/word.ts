export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Word {
  id: number;
  word: string;
  meaningTh: string;
  meaningEn: string;
  ipa: string;
  phoneticThai: string;
  level: CEFRLevel;
  partOfSpeech: string;
  category: string;
  difficulty: number;
  example: string;
  exampleThai: string;
  synonyms?: string[];
  tags?: string[];
  primaryMeaning?: string;
  secondaryMeanings?: string[];
}

export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
