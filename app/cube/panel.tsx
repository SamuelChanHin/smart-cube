import FiveSecondChallengeButton from "./challenge/five-second";
import StandardChallengeButton from "./challenge/standard";
import style from "./style.module.scss";

type Props = {
  connected: boolean;
};

function Panel({ connected }: Props) {
  return (
    <div className={style.panel}>
      <div className={style.gameModePanel}>
        <FiveSecondChallengeButton connected={connected} />
        <StandardChallengeButton connected={connected} />
      </div>
      {/* <div className={style.rubikBtnPanel}>
        {Object.entries(KeyToMoveMap).map(([key, move]) => (
          <button
            key={move}
            className={style.actionBtn}
            onClick={() => magicCube.pushQueue(move)}
          >
            {key}={move}
          </button>
        ))}
      </div> */}
    </div>
  );
}

export default Panel;
