import { useFrame, useThree } from "@react-three/fiber";
import JEASINGS from "jeasings";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Mesh } from "three";
import magicCube from "~/services/magic-cube";
import Cube from "./cube";
import * as THREE from "three";

type Props = {
  quaternion: { x: number; y: number; z: number; w: number } | null;
};

export type RubikHandle = {
  resetAll: () => void;
};

const Rubik = forwardRef<RubikHandle, Props>(({ quaternion }, childRef) => {
  const ref = useRef<Mesh | null>(null);
  const rotationGroup = useRef<Mesh | null>(null);
  const { camera } = useThree();

  useImperativeHandle(childRef, () => ({
    resetAll: () => {
      magicCube.resetAll(ref.current!, rotationGroup.current!);
    },
  }));

  // Using useFrame to update the scene on screen using JEASINGS achieves animation.
  useFrame(() => {
    JEASINGS.update();

    // ref.current!.rotation.z = (0 * Math.PI) / 2;

    if (quaternion) {
      let quat = new THREE.Quaternion(
        quaternion.x,
        quaternion.z,
        -quaternion.y,
        quaternion.w
      ).normalize();

      const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ"); // You can use other rotation orders if needed

      ref.current!.rotation.x = euler.x;
      ref.current!.rotation.y = euler.y;
      ref.current!.rotation.z = euler.z;
    }
  });

  useEffect(() => {
    if (!ref.current || !rotationGroup.current) return;

    magicCube.move(ref.current, rotationGroup.current);
  }, [ref, rotationGroup]);

  // In the return function the group with rotationGroup ref is used for temp holder
  // we will use this to achieve full face rotation on group axis in a direction
  // instead of individually rotating them on their own axis.
  return (
    <>
      <group ref={ref}>
        {[...Array(3).keys()].map((x) =>
          [...Array(3).keys()].map((y) =>
            [...Array(3).keys()].map((z) => (
              <Cube key={x + y * 3 + z * 9} position={[x - 1, y - 1, z - 1]} />
            ))
          )
        )}
      </group>
      <group ref={rotationGroup} />
    </>
  );
});

export default Rubik;
