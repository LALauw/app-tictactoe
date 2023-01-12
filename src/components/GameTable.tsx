import Board from "../interfaces/Board";
import React, { useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { useBoardStore } from "../store/store";
import TurnCalc from "./TurnCalc";

const GameTable = () => {
  const games = useBoardStore((state) => state.games);
  const setBoard = useBoardStore((state) => state.setBoard);
  const wallet = useWallet();

  async function handleSignAndExecuteTx(id: string) {
    if (!wallet.connected) return;
    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: "0xad5831fe358a89d487648c2c52f6cad0560767fa",
            module: "shared_tic_tac_toe",
            function: "delete_game",
            typeArguments: [],
            arguments: [id],
            gasBudget: 10000,
          },
        },
      });
      console.log("Deleting game", resData);
    } catch (e) {
      console.error("Game Creation failed", e);
    }
  }

  if (games.length > 0) {
    return (
      <>
        <table className="table table-normal table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Turn</th>
              <th>o_address</th>
              <th>x_address</th>
              <th>Load Board</th>
              <th>FF</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game: Board, index: number) => (
              <tr key={index}>
                <td>{game.id?.id}</td>
                <td>{game.game_status}</td>
                <td>{TurnCalc(wallet.account?.address!, game)}</td>
                <td>
                  {wallet.account?.address === game.o_address
                    ? "You"
                    : game.o_address}
                </td>
                <td>
                  {wallet.account?.address === game.x_address
                    ? "You"
                    : game.x_address}
                </td>
                <td>
                  <button
                    onClick={() => setBoard(game)}
                    className="btn btn-primary btn-sm"
                  >
                    Select
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleSignAndExecuteTx(game.id?.id!)}
                    className="btn btn-primary btn-sm"
                  >
                    Forfeit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  return <></>;
};

export default GameTable;
