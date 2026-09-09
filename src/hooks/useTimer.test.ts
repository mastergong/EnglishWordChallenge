import { describe, expect, it } from "vitest";
import { useTimer } from "../hooks/useTimer";

describe("timer contract", () => {
  it("exports a timer hook", () => {
    expect(typeof useTimer).toBe("function");
  });
});
