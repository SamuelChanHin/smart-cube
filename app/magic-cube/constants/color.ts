const normalColors = ["red", "orange", "white", "yellow", "green", "blue"];

const topFaceColorOptions = ["white", "yellow"] as const;
type TopFaceColor = (typeof topFaceColorOptions)[number];

export type { TopFaceColor };
export { topFaceColorOptions, normalColors };
