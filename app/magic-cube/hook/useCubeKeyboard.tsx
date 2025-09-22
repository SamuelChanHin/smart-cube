import { useEffect } from "react";
import { KeyToMoveMap } from "utils/cube-move";
import magicCube from "~/magic-cube/services/magic-cube";

export const useCubeKeyboard = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      magicCube.pushQueue(KeyToMoveMap[e.key.toLowerCase()]);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return;
};
