import React from "react";
import style from "../style.module.scss";
import clsx from "clsx";
import { useStandardChallenge } from "~/magic-cube/providers/standard";
import magicCube from "~/magic-cube/services/magic-cube";

type Props = {
  connected: boolean;
};

function StandardChallengeButton({ connected }: Props) {
  const { startChallenge, isActive, timer, tps, isPrestart, prestartTimeLeft } =
    useStandardChallenge();

  return (
    <>
      {(isActive || isPrestart) && (
        <div className={style.overlay}>
          <div className={style.overlayContent}>
            {isPrestart && `Starting in ${prestartTimeLeft}`}
            {isActive && `Time: ${timer}s`}
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
        {"Standard"}
        <p>{tps > 0 && <span>TPS: {tps.toFixed(2)}</span>}</p>
        <p>Time: {timer}s</p>
      </button>
    </>
  );
}

export default StandardChallengeButton;
