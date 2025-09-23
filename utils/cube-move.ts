import type { Move } from "~/magic-cube/types/types";

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
  t: "M",
  y: "M'",
  g: "S",
  h: "S'",
  b: "r",
  n: "r'",
  u: "u",
  i: "u'",
  j: "f",
  k: "f'",
} as const;

export { KeyToMoveMap };
