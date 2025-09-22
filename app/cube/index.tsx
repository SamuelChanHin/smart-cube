import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import useCube from "~/hook/useCube";
import Panel from "./panel";
import Rubik, { type RubikHandle } from "./rubik";
import style from "./style.module.scss";
import { useCubeKeyboard } from "~/hook/useCubeKeyboard";

function MagicCube() {
  const { connect, cubeName, loading, connected, quaternion } = useCube();
  useCubeKeyboard();

  const childRef = useRef<RubikHandle>(null);

  const reset = () => {
    childRef.current!.resetAll();
  };

  return (
    <div className={style.container}>
      <div className={style.topBar}>
        {cubeName ? (
          <div>Connecting to {cubeName}...</div>
        ) : (
          <button className={style.actionBtn} onClick={connect}>
            {loading ? "Connecting..." : "Connect BlueTooth Device"}
          </button>
        )}

        <button className={style.actionBtn} onClick={reset}>
          Reset
        </button>
      </div>

      <div className={style.fullscreen}>
        <Canvas shadows camera={{ position: [10, 10, 15], fov: 30 }}>
          <OrbitControls />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          <Rubik ref={childRef} quaternion={quaternion} />
        </Canvas>
      </div>

      <Panel connected={connected} />
    </div>
  );
}

export default MagicCube;
