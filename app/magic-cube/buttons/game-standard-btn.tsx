import React from "react";
import style from "../style.module.scss";
import clsx from "clsx";
import { useStandardChallenge } from "~/magic-cube/providers/standard";
import { useCube } from "../providers/magic-cube.provider";

type Props = {
  connected: boolean;
};

function StandardChallengeButton({ connected }: Props) {
  const { isCompleted } = useCube();
  const {
    startChallenge,
    isStarted,
    timer,
    tps,
    isPrestart,
    prestartTimeLeft,
  } = useStandardChallenge();

  return (
    <>
      {(isStarted || isPrestart) && (
        <div className={style.overlay}>
          <div className={style.overlayContent}>
            {isPrestart && `Starting in ${prestartTimeLeft}`}
            {isStarted && `Time: ${timer}s`}
          </div>
        </div>
      )}
      <button
        className={clsx(style.actionBtn, {
          [style.disabled]:
            !connected || isCompleted || isStarted || isPrestart,
        })}
        disabled={!connected || isCompleted || isStarted || isPrestart}
        onClick={startChallenge}
      >
        {"Standard"}
        <p>{tps > 0 && <span>TPS: {tps.toFixed(2)}</span>}</p>
        <p>Time: {timer}s</p>
      </button>
    </>
  );
}

export default StandardChallengeButton;
