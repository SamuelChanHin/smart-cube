import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useCubeKeyboard } from "~/magic-cube/hook/useCubeKeyboard";
import Panel from "./panel";
import { useCube } from "./providers/magic-cube.provider";
import Rubik, { type RubikHandle } from "./rubik";
import magicCube from "./services/magic-cube";
import style from "./style.module.scss";
import TopBar from "./topbar";

function MagicCube() {
  const { resetCube } = useCube();

  const rubikRef = useRef<RubikHandle>(null);

  const reset = () => {
    // reset the 3D cube and send reset command to the physical cube
    rubikRef.current!.resetAll();

    // send reset command to physical cube
    resetCube();

    // clear the move queue
    magicCube.clearQueue();
  };

  return (
    <div className={style.container}>
      <TopBar reset={reset} />

      <div className={style.cubeContainer}>
        <Canvas shadows camera={{ position: [10, 10, 15], fov: 30 }}>
          <OrbitControls />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          <Rubik ref={rubikRef} />
        </Canvas>
      </div>

      <Panel />
    </div>
  );
}

export default MagicCube;
