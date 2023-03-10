import { useWallet } from "@suiet/wallet-kit";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import TileRenderer from "./TileRenderer";
import TurnCalc from "./TurnCalc";
import { RenderToast } from "../util/RenderToast";
import { GamesStatusOption } from "../util/GameStatusOption";
import { successSound, winSound } from "../util/SoundEffects";

const GameBoard = () => {
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setGameStatus = useBoardStore((state) => state.setGameStatus);
  const updateBoard = useBoardStore((state) => state.updateBoard);

  async function handleMarkPlacement(place: number[]) {
    if (!wallet.connected) return;
    if (TurnCalc(wallet.account?.address!, board) !== "Your Turn") {
      RenderToast(6);
      return;
    }
    if (board.game_status !== 0) {
      RenderToast(8);
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

        if (resData.effects.status.status === "success") {
          successSound.play();
          const newBoard = await updateBoard(board.id?.id!);
          if (!newBoard) return;
          else {
            const decision: GamesStatusOption = decideWinner(
              newBoard,
              wallet.account?.address!
            );
            setGameStatus(decision);
          }
        }
        if (resData.effects.status.status === "failure") {
          RenderToast(5);
        }
      }
    } catch (e) {
      console.error("Mark Placement Failed!", e);
    }
  }

  if (board.gameboard) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
          <h1 className="font-bold w-1/2 lg:w-full truncate">{board.id?.id}</h1>
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

const decideWinner = (board: Board, wallet: string) => {
  if (board.game_status === 1 && board.x_address === wallet) {
    winSound.play();
    RenderToast(1);
    return "XWin";
  }

  if (board.game_status === 1 && board.o_address === wallet) {
    RenderToast(2);
    return "XWin";
  }

  if (board.game_status === 2 && board.x_address === wallet) {
    RenderToast(2);
    return "OWin";
  }

  if (board.game_status === 2 && board.o_address === wallet) {
    winSound.play();
    RenderToast(1);
    return "OWin";
  }
  if (board.game_status === 3) {
    RenderToast(3);
    return "Draw";
  }

  RenderToast(4);
  return "Ongoing";
};

export default GameBoard;
