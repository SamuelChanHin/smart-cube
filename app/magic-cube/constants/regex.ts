import { KeyToMoveMap } from "utils/cube-move";

const movePattern = `(${Object.values(KeyToMoveMap).join("|")})([23])?( (${Object.values(KeyToMoveMap).join("|")})([23])?)*`;

export { movePattern };
