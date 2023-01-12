import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import SuiProvider from "../util/SuiProvider";
import TileRenderer from "./TileRenderer";
import TurnCalc from "./TurnCalc";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const GameBoard = () => {
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const { width, height } = useWindowSize();
  const [isWinner, setIsWinner] = useState(false);

  async function handleMarkPlacement(place: number[]) {
    if (!wallet.connected) return;
    if (TurnCalc(wallet.account?.address!, board) !== "Your Turn") {
      alert("Not your turn!");
      return;
    }
    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: "0xad5831fe358a89d487648c2c52f6cad0560767fa",
            module: "shared_tic_tac_toe",
            function: "place_mark",
            typeArguments: [],
            arguments: [board.id?.id!, place[0], place[1]],
            gasBudget: 10000,
          },
        },
      });
      console.log("Placing mark", resData);
      if (resData.effects.status.status === "success") {
        const newBoard = await updateBoard();
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
    } catch (e) {
      console.error("Mark Placement Failed!", e);
    }
  }

  async function updateBoard() {
    const updatedBoard = await SuiProvider.getObject(board.id?.id!);

    if (updatedBoard.details) {
      //@ts-ignore
      const newBoard: Board = updatedBoard.details?.data.fields;
      setBoard(newBoard);
      return newBoard;
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
        <button className="btn btn-accent" onClick={() => updateBoard()}>
          Update Board
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-5xl">No Board</h1>
    </>
  );
};

export default GameBoard;
