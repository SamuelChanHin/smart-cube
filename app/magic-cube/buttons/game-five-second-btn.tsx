import React from "react";
import { useFiveSecondChallenge } from "~/magic-cube/providers/five-second-challenge.provider";
import style from "../style.module.scss";
import clsx from "clsx";

type Props = {
  connected: boolean;
};

function FiveSecondChallengeButton({ connected }: Props) {
  const {
    startChallenge,
    timeLeft,
    isStarted,
    isPrestart,
    prestartTimeLeft,
    count,
    tps,
  } = useFiveSecondChallenge();

  return (
    <>
      {(isStarted || isPrestart) && (
        <div className={style.overlay}>
          <div className={style.overlayContent}>
            {isPrestart && `Starting in ${prestartTimeLeft}`}
            {isStarted && `Time Left: ${timeLeft}`}
          </div>
        </div>
      )}
      <button
        className={clsx(style.actionBtn, {
          [style.disabled]: !connected || isStarted || isPrestart,
        })}
        disabled={!connected || isStarted || isPrestart}
        onClick={startChallenge}
      >
        {"5 Seconds Challenge"}
        <p>
          Count: {count} {tps > 0 && <span>TPS: {tps.toFixed(2)}</span>}
        </p>
      </button>
    </>
  );
}

export default FiveSecondChallengeButton;
