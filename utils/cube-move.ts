import type { Move } from "~/modules/types";

const KeyToMoveMap: Record<string, Move> = {
  q: "L",
  w: "L'",
  e: "R'",
  r: "R",
  a: "D",
  s: "D'",
  d: "U'",
  f: "U",
  z: "F'",
  x: "F",
  c: "B",
  v: "B'",
} as const;

export { KeyToMoveMap };
