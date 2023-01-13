import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import SuiProvider from "../util/SuiProvider";
import TileRenderer from "./TileRenderer";
import TurnCalc from "./TurnCalc";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { RenderToast } from "../util/RenderToast";
import { SuiEventEnvelope, SuiEventFilter } from "@mysten/sui.js";
import provider from "../util/SuiProvider";

const GameBoard = () => {
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setWinner = useBoardStore((state) => state.setWinner);
  const winner = useBoardStore((state) => state.winner);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const watchForEvents = async () => {
      console.log("starting watch");
      const filter: SuiEventFilter = {
        Package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS as string,
        Module: "shared_tic_tac_toe",
        EventType: "MutateObject",
      };
      const subNum = await provider.subscribeEvent(
        filter,
        (event: SuiEventEnvelope) => {
          console.log("event received");
          console.log(event);
        }
      );

      console.log("watching.." + subNum);
    };
    watchForEvents();
  }, [board]);

  async function handleMarkPlacement(place: number[]) {
    if (!wallet.connected) return;
    if (TurnCalc(wallet.account?.address!, board) !== "Your Turn") {
      RenderToast(6);
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
          if (!newBoard) return;
          else {
            const decision: boolean = decideWinner(
              newBoard,
              wallet.account?.address!
            );
            setWinner(decision);
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
        {winner && (
          <Confetti width={width - 50} height={height - 50} recycle={false} />
        )}
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
          <label htmlFor="my-modal-4" className="btn btn-accent">
            Leaderboard
          </label>
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
  if (
    (board.game_status === 1 && board.x_address === wallet) ||
    (board.game_status === 2 && board.o_address === wallet)
  ) {
    RenderToast(1);
    return true;
  } else if (
    (board.game_status === 1 && board.x_address !== wallet) ||
    (board.game_status === 2 && board.o_address !== wallet)
  ) {
    RenderToast(2);
    return false;
  } else if (board.game_status === 3) {
    RenderToast(3);
    return false;
  }
  RenderToast(4);
  return false;
};

export default GameBoard;
