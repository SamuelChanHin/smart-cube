import React from "react";

function Cube({ position }) {
  const colors = ["red", "orange", "white", "yellow", "green", "blue"]; // R L U D F B
  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          attach="material-0"
          color={colors[0] || "black"}
        />{" "}
        {/* right */}
        <meshStandardMaterial
          attach="material-1"
          color={colors[1] || "black"}
        />{" "}
        {/* left */}
        <meshStandardMaterial
          attach="material-2"
          color={colors[2] || "black"}
        />{" "}
        {/* top */}
        <meshStandardMaterial
          attach="material-3"
          color={colors[3] || "black"}
        />{" "}
        {/* bottom */}
        <meshStandardMaterial
          attach="material-4"
          color={colors[4] || "black"}
        />{" "}
        {/* front */}
        <meshStandardMaterial
          attach="material-5"
          color={colors[5] || "black"}
        />{" "}
        {/* back */}
      </mesh>
    </>
  );
}

export default Cube;
