export const CATEGORY_TH: Record<string, string> = {
  "Daily Life": "ชีวิตประจำวัน",
  Family: "ครอบครัว",
  People: "ผู้คน",
  Home: "ปัญหาห้องพัก",
  Food: "อาหาร",
  Shopping: "การซื้อของ",
  Travel: "การเดินทาง",
  Transport: "การคมนาคม",
  School: "โรงเรียน",
  Education: "การศึกษา",
  Work: "การทำงาน",
  Business: "ธุรกิจ",
  Finance: "การเงิน",
  Technology: "เทคโนโลยี",
  Internet: "อินเทอร์เน็ต",
  Communication: "การสื่อสาร",
  Health: "สุขภาพ",
  Body: "ร่างกาย",
  Emotions: "อารมณ์",
  Personality: "บุคลิกภาพ",
  Relationships: "ความสัมพันธ์",
  Nature: "ธรรมชาติ",
  Environment: "สิ่งแวดล้อม",
  Weather: "อากาศ",
  Animals: "สัตว์",
  Places: "สถานที่",
  Society: "สังคม",
  Culture: "วัฒนธรรม",
  Entertainment: "ความบันเทิง",
  Sports: "กีฬา",
  Science: "วิทยาศาสตร์",
  Politics: "การเมือง",
  Law: "กฎหมาย",
  Academic: "วิชาการ",
  "Common Verbs": "กริยาที่ใช้บ่อย",
  "Common Adjectives": "คุณศัพท์ที่ใช้บ่อย",
  "Common Adverbs": "วิเศษณ์ที่ใช้บ่อย",
  "Common Nouns": "คำนามที่ใช้บ่อย",
  "Phrasal Verbs": "วลีกริยา",
  "Useful Expressions": "สำนวนที่ใช้บ่อย",
};

export function categoryLabelTh(category: string): string {
  return CATEGORY_TH[category] ?? category;
}

const POS_TH: Record<string, string> = {
  noun: "คำนาม (Noun)",
  verb: "คำกริยา (Verb)",
  adjective: "คำคุณศัพท์ (Adjective)",
  adverb: "คำวิเศษณ์ (Adverb)",
  "phrasal verb": "วลีกริยา (Phrasal Verb)",
  preposition: "คำบุพบท (Preposition)",
  conjunction: "คำสันธาน (Conjunction)",
  pronoun: "คำสรรพนาม (Pronoun)",
  determiner: "คำกำหนด (Determiner)",
  interjection: "คำอุทาน (Interjection)",
};

export function posLabelTh(partOfSpeech: string): string {
  return POS_TH[partOfSpeech.trim().toLowerCase()] ?? partOfSpeech;
}
