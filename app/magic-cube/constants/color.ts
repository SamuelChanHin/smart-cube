const normalColors = ["red", "orange", "white", "yellow", "green", "blue"];
const yellowFaceColors = ["red", "orange", "yellow", "white", "green", "blue"];

const topFaceColorOptions = ["white", "yellow"] as const;
type TopFaceColor = (typeof topFaceColorOptions)[number];

export type { TopFaceColor };
export { topFaceColorOptions, normalColors, yellowFaceColors };
