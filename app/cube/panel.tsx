import { useFiveSecondChallenge } from "~/mode/five-second-challenge.provider";
import style from "./style.module.scss";
import magicCube from "~/services/magic-cube";
import { KeyToMoveMap } from "utils/cube-move";
import clsx from "clsx";

type Props = {
  connected: boolean;
};

function Panel({ connected }: Props) {
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
      {(isActive || isPrestart) && (
        <div className={style.overlay}>
          <div className={style.overlayContent}>
            {isPrestart && `Starting in ${prestartTimeLeft}`}
            {isActive && `Time Left: ${timeLeft}`}
          </div>
        </div>
      )}
      <div className={style.gameModePanel}>
        <button
          className={clsx(style.actionBtn, {
            [style.disabled]: !connected || isActive || isPrestart,
          })}
          disabled={!connected || isActive || isPrestart}
          onClick={startChallenge}
        >
          {"5 Seconds Challenge"}
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
