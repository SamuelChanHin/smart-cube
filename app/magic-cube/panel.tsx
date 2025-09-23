import { KeyToMoveMap } from "utils/cube-move";

import magicCube from "~/magic-cube/services/magic-cube";
import FiveSecondChallengeButton from "./buttons/game-five-second-btn";
import StandardChallengeButton from "./buttons/game-standard-btn";
import { topFaceColorOptions, type TopFaceColor } from "./constants/color";
import { movePattern } from "./constants/regex";
import { useCube } from "./providers/magic-cube.provider";
import style from "./style.module.scss";
import type { Move } from "./types/types";
import Icon from "~/icons/Icon";

type Props = {
  rotateX: () => void;
  rotateY: () => void;
};

function Panel({ rotateX, rotateY }: Props) {
  const { connected, setTopFaceColor, topFaceColor } = useCube();

  // enable keypress for cube moves
  // useCubeKeyboard();

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const moves = input.value.split(" ") as Move[];

    // modify moves to expand 2 and 3 suffixes
    const modifiedMoves = moves
      .map((move) => {
        if (move.length === 2 && (move[1] === "2" || move[1] === "3")) {
          return Array(parseInt(move[1], 10)).fill(move[0]) as Move[];
        } else {
          return move as Move;
        }
      })
      .flat() as Move[];

    if (
      modifiedMoves.every((move) => Object.values(KeyToMoveMap).includes(move))
    ) {
      magicCube.pushQueues(modifiedMoves);
      input.value = "";
    }
  };

  return (
    <div className={style.panel}>
      <div className={style.moveInputPanel}>
        <form onSubmit={handleInputSubmit}>
          <input
            type="text"
            placeholder="Enter your algorithm"
            pattern={movePattern}
            title={`Moves must be one of: ${Object.values(KeyToMoveMap).join(", ")} optionally followed by 2 or 3`}
            className={style.moveInput}
          />
          <input type="submit" />
        </form>
      </div>

      <div className={style.topFaceColorSelectPanel}>
        <label>Top Face Color:</label>
        <select
          value={topFaceColor}
          onChange={(e) => setTopFaceColor(e.target.value as TopFaceColor)}
        >
          {topFaceColorOptions.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        {/* Here arrow-top but rotate Y refer to axis.png  */}
        {/* <button className={style.actionBtn} onClick={rotateX}>
          <Icon type="arrow-top" className={style.icon} />
        </button> */}

        {/* Here arrow-right but rotate Y refer to axis.png  */}
        {/* <button className={style.actionBtn} onClick={rotateY}>
          <Icon type="arrow-right" className={style.icon} />
        </button> */}
      </div>

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
