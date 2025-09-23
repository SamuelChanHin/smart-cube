import { useFrame } from "@react-three/fiber";
import JEASINGS from "jeasings";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import Cube from "./cube";
import { useCube } from "./providers/magic-cube.provider";
import magicCube3d from "./services/magic-cube-3d";

type Props = {};

export type RubikHandle = {
  resetAll: () => void;
  rotateX: () => void;
  rotateY: () => void;
};

const Rubik = forwardRef<RubikHandle, Props>((_, childRef) => {
  const { topFaceColor } = useCube();
  // ref for entire cube
  const cubeRef = useRef<Mesh | null>(null);

  // ref for rotation group attach
  const ref = useRef<Mesh | null>(null);

  // ref for rotation group
  const rotationGroup = useRef<Mesh | null>(null);

  const { quaternion } = useCube();

  useImperativeHandle(childRef, () => ({
    resetAll: () => {
      magicCube3d.resetAll(ref.current!, rotationGroup.current!);
    },
    rotateY: () => {
      const euler = new THREE.Euler(0, Math.PI / 2, 0, "XYZ"); // 90 degrees around the Z-axis
      cubeRef.current!.rotation.x += euler.x;
      cubeRef.current!.rotation.y += euler.y;
      cubeRef.current!.rotation.z += euler.z;
    },
    rotateX: () => {
      const euler = new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"); // 90 degrees around the Y-axis
      cubeRef.current!.rotation.x += euler.x;
      cubeRef.current!.rotation.y += euler.y;
      cubeRef.current!.rotation.z += euler.z;
    },
  }));

  useFrame(() => {
    JEASINGS.update();

    if (quaternion) {
      let quat = new THREE.Quaternion(
        quaternion.x,
        quaternion.z,
        -quaternion.y,
        quaternion.w
      ).normalize();

      const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ"); // You can use other rotation orders if needed

      cubeRef.current!.rotation.x = euler.x;
      cubeRef.current!.rotation.y = euler.y;
      cubeRef.current!.rotation.z = euler.z;
    }
  });

  useEffect(() => {
    if (!ref.current || !rotationGroup.current) return;

    magicCube3d.move(ref.current, rotationGroup.current);
  }, [ref, rotationGroup]);

  // In the return function the group with rotationGroup ref is used for temp holder
  // we will use this to achieve full face rotation on group axis in a direction
  // instead of individually rotating them on their own axis.
  return (
    <>
      <group ref={cubeRef}>
        <group ref={ref}>
          {[...Array(3).keys()].map((x) =>
            [...Array(3).keys()].map((y) =>
              [...Array(3).keys()].map((z) => (
                <Cube
                  key={x + y * 3 + z * 9}
                  position={[x - 1, y - 1, z - 1]}
                />
              ))
            )
          )}
        </group>
        <group ref={rotationGroup} />
      </group>
    </>
  );
});

export default Rubik;
