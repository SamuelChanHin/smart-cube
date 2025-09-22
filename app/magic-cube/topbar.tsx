import React from "react";
import style from "./style.module.scss";
import { useCube } from "./providers/magic-cube.provider";

type Props = {
  reset: () => void;
};

function TopBar({ reset }: Props) {
  const { connect, cubeName, connecting, connected } = useCube();

  return (
    <div className={style.topBar}>
      {connected ? (
        <div>Connected to {cubeName}...</div>
      ) : (
        <button className={style.actionBtn} onClick={connect}>
          {connecting ? "Connecting..." : "Connect BlueTooth Device"}
        </button>
      )}

      <button className={style.actionBtn} onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default TopBar;
