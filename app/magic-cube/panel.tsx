import { KeyToMoveMap } from "utils/cube-move";

import style from "./style.module.scss";
import magicCube from "~/magic-cube/services/magic-cube";
import FiveSecondChallengeButton from "./buttons/game-five-second-btn";
import StandardChallengeButton from "./buttons/game-standard-btn";
import { useCube } from "./providers/magic-cube.provider";

function Panel() {
  const { connected } = useCube();

  return (
    <div className={style.panel}>
      <div className={style.gameModePanel}>
        <FiveSecondChallengeButton connected={connected} />
        <StandardChallengeButton connected={connected} />
      </div>
      <div className={style.rubikBtnPanel}>
        {Object.entries(KeyToMoveMap).map(([key, move]) => (
          <button
            key={move}
            className={style.actionBtn}
            onClick={() => magicCube.pushQueue(move)}
          >
            {key}={move}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Panel;
