import { useFiveSecondChallenge } from "~/mode/five-second-challenge.provider";
import style from "./style.module.scss";
import magicCube from "~/services/magic-cube";
import { KeyToMoveMap } from "utils/cube-move";

function Panel() {
  const {
    startChallenge,
    timeLeft,
    isActive,
    isPrestart,
    prestartTimeLeft,
    count,
    tps,
  } = useFiveSecondChallenge();

  return (
    <div className={style.panel}>
      <div className={style.gameModePanel}>
        <button className={style.actionBtn} onClick={startChallenge}>
          {isActive && `Time Left: ${timeLeft}`}
          {isPrestart && `Starting in ${prestartTimeLeft}`}
          {!isActive && !isPrestart && "Start 5 Second Challenge"}
          <p>
            Count: {count} {tps > 0 && <span>TPS: {tps.toFixed(2)}</span>}
          </p>
        </button>
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
