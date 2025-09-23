import { normalColors, yellowFaceColors } from "./constants/color";
import { useCube } from "./providers/magic-cube.provider";

type Props = {
  position: [number, number, number];
};

function Cube({ position }: Props) {
  const { topFaceColor } = useCube();
  const colors = topFaceColor === "white" ? normalColors : yellowFaceColors;

  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        {colors.map((color, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={color || "black"}
          />
        ))}
      </mesh>
    </>
  );
}

export default Cube;
