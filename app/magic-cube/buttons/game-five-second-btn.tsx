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
    isActive,
    isPrestart,
    prestartTimeLeft,
    count,
    tps,
  } = useFiveSecondChallenge();

  return (
    <>
      {(isActive || isPrestart) && (
        <div className={style.overlay}>
          <div className={style.overlayContent}>
            {isPrestart && `Starting in ${prestartTimeLeft}`}
            {isActive && `Time Left: ${timeLeft}`}
          </div>
        </div>
      )}
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
    </>
  );
}

export default FiveSecondChallengeButton;
