import { KeyToMoveMap } from "utils/cube-move";

const movePattern = `(${Object.values(KeyToMoveMap).join("|")})([23])?( (${Object.values(KeyToMoveMap).join("|")})([23])?)*`;

const movePatternRegex = new RegExp(`^${movePattern}$`);

export { movePattern, movePatternRegex };
