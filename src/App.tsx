import { useState } from "react";
import "./App.css";
import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import PlayerGames from "./components/PlayerGames";
import SuiProvider from "./util/SuiProvider";
import { useBoardStore } from "./store/store";
import GameBoard from "./components/GameBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import provider from "./util/SuiProvider";
import { RenderToast } from "./util/RenderToast";

function App() {
  const [challengedPlayer, setChallengedPlayer] = useState("");
  const setBoard = useBoardStore((state) => state.setBoard);
  const board = useBoardStore((state) => state.board);
  const wallet = useWallet();

  async function handleSignAndExecuteTx() {
    if (!wallet.connected) return;
    try {
      if (wallet.account?.address! === challengedPlayer) {
        return alert("You can't challenge yourself!");
      }

      if (challengedPlayer.length !== 42) {
        return alert("Enter a valid address!");
      }

      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: import.meta.env
              .VITE_GAME_PACKAGE_ADDRESS as string,
            module: "shared_tic_tac_toe",
            function: "create_game",
            typeArguments: [],
            arguments: [wallet.account?.address!, challengedPlayer],
            gasBudget: 10000,
          },
        },
      });

      if (resData.effects.created) {
        const newBoard: any = await SuiProvider.getObject(
          resData.effects.created[0].reference.objectId
        );
        setBoard(newBoard.details?.data.fields);

        RenderToast(7);
      }
    } catch (e) {
      console.error("Game Creation failed", e);
    }
  }

  return (
    <div className="container mx-auto overflow-x-hidden">
      <div className="navbar justify-between flex flex-col lg:flex-row mb-10 mt-5 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-5xl font-bold">Tic-Tac-Toe</h1>
          <h2 className="text-base lg:text-md font-bold">
            Created by Leslie Lauw
          </h2>
        </div>

        <ConnectButton label="Connect" />
      </div>
      {wallet.account && (
        <>
          <div className="container flex flex-col items-center justify-center lg:flex-row gap-5 p-2 ">
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <label className="text-2xl font-bold text-pink-500">
                Challenge a player
              </label>
              <input
                className="input input-secondary max-w-md"
                onChange={(e) => setChallengedPlayer(e.target.value)}
                type="text"
              ></input>
              <button
                className="btn btn-md w-40"
                onClick={() => handleSignAndExecuteTx()}
              >
                Make Game
              </button>
            </div>

            {board && <GameBoard />}
          </div>
          <PlayerGames />
        </>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
      />
    </div>
  );
}

export default App;
