import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import SuiProvider from "../util/SuiProvider";
import TileRenderer from "./TileRenderer";
import TurnCalc from "./TurnCalc";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import updateBoard from "../util/updateBoard";

const GameBoard = () => {
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const { width, height } = useWindowSize();
  const [isWinner, setIsWinner] = useState(false);

  async function handleMarkPlacement(place: number[]) {
    if (!wallet.connected) return;
    if (TurnCalc(wallet.account?.address!, board) !== "Your Turn") {
      alert("Not your turn!");
      return;
    }
    try {
      if (board.id) {
        const resData = await wallet.signAndExecuteTransaction({
          transaction: {
            kind: "moveCall",
            data: {
              packageObjectId: import.meta.env
                .VITE_GAME_PACKAGE_ADDRESS as string,
              module: "shared_tic_tac_toe",
              function: "place_mark",
              typeArguments: [],
              arguments: [board.id?.id, place[0], place[1]],
              gasBudget: 10000,
            },
          },
        });
        console.log("Placing mark", resData);

        if (resData.effects.status.status === "success") {
          const newBoard = await updateBoard(board.id?.id!);
          console.log(newBoard);
          if (newBoard && newBoard.game_status === 1) {
            alert("Winner!");
            setIsWinner(true);
            return;
          }
          alert("Placed mark on: " + place[0] + "," + place[1]);
        }
        if (resData.effects.status.status === "failure") {
          alert("Mark placement failed, not your turn!");
        }
      }
    } catch (e) {
      console.error("Mark Placement Failed!", e);
    }
  }

  if (board.gameboard) {
    return (
      <>
        {isWinner && <Confetti width={width} height={height} recycle={false} />}
        <div className="flex gap-1">
          {board.gameboard?.map((row, i) => {
            return (
              <div key={i} className=" flex flex-col gap-1">
                {row.map((col, j) => {
                  return (
                    <TileRenderer
                      placeMarker={handleMarkPlacement}
                      key={j}
                      place={[i, j]}
                      number={col}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-5">
          <button
            className="btn btn-accent"
            onClick={async () => {
              const data = await SuiProvider.getEvents(
                {
                  MoveModule: {
                    package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS,
                    module: "shared_tic_tac_toe",
                  },
                },

                null,
                null
              );
              const filteredTrophies: any = data.data.filter(
                (e: any) =>
                  e.event.moveEvent &&
                  e.event.moveEvent.type ===
                    import.meta.env.VITE_GAME_PACKAGE_ADDRESS +
                      "::shared_tic_tac_toe::TrophyEvent"
              );
              console.log(filteredTrophies);
              const winners: Map<string, number> = new Map();
              for (let winner of filteredTrophies) {
                const winnerAddress = winner.event.moveEvent.fields.winner;
                if (winners.has(winnerAddress)) {
                  winners.set(winnerAddress, winners.get(winnerAddress)! + 1);
                } else {
                  winners.set(winnerAddress, 1);
                }
              }
              console.log(winners);
              return data;
            }}
          >
            winners
          </button>
          <button
            className="btn btn-accent"
            onClick={() => updateBoard(board.id?.id!)}
          >
            Update Board
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl font-bold">No Board</h1>
      <p className="text-lg font-bold">
        Please, use the "Get Games" button below to select a game or create a
        game by challenging a player.{" "}
      </p>
    </div>
  );
};

export default GameBoard;
