import type { Move } from "~/cube/types";
import { keyboardClick } from "./kayboard";

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

type KeyType = keyof typeof KeyToMoveMap;

function cubeMove(key: KeyType) {
  keyboardClick(key);
}

export { KeyToMoveMap, cubeMove };
