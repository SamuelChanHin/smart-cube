import { normalColors } from "./constants/color";

type Props = {
  position: [number, number, number];
};

function Cube({ position }: Props) {
  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        {normalColors.map((color, i) => (
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
