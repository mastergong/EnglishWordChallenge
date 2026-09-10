import { GamePlay } from "./Game";
import { localDateKey } from "../utils/random";

export function DailyChallenge() {
  return <GamePlay key={localDateKey()} mode="daily" level="adaptive" />;
}
