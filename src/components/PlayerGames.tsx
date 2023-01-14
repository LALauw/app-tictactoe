import { JsonRpcProvider, Network, TransactionQuery } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect } from "react";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import FinishedGamesTable from "./FinishedGamesTable";
import OngoingGamesTable from "./OngoingGamesTable";

const PlayerGames = () => {
  const wallet = useWallet();
  const setGames = useBoardStore((state) => state.setGames);
  const setFinishedGames = useBoardStore((state) => state.setFinishedGames);
  const setFetchingGames = useBoardStore((state) => state.setFetchingGames);
  const fetchingGames = useBoardStore((state) => state.fetchingGames);
  const provider = new JsonRpcProvider(Network.DEVNET);
  const MoveFunction: TransactionQuery = {
    MoveFunction: {
      package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS as string,
      module: "shared_tic_tac_toe",
      function: "create_game",
    },
  };

  useEffect(() => {
    console.log("Fetching games");
    if (wallet.connected) {
      setGames([]);
      setFinishedGames([]);
      fetchGames();
    }
  }, [wallet.connected]);

  async function fetchGames() {
    let transactions = [];
    let objects = [];
    let playerGames = [];
    let playerFinishedGames = [];
    setFetchingGames(true);
    const data = await provider.getTransactions(MoveFunction);
    for (let item of data.data) {
      transactions.push(item);
    }

    for (let item of transactions) {
      const transactionalData: any = await provider.getTransactionWithEffects(
        item
      );
      if (transactionalData.effects.events) {
        objects.push(transactionalData.effects.events[1].newObject.objectId);
      }
    }

    for (let object of objects) {
      const objectData: any = await provider.getObject(object);
      if (objectData) {
        const board: Board = objectData.details.data.fields;
        if (
          board.game_status === 0 &&
          (board.o_address === wallet.account?.address ||
            board.x_address === wallet.account?.address)
        ) {
          playerGames.push(board);
        } else {
          if (
            board.o_address === wallet.account?.address ||
            board.x_address === wallet.account?.address
          ) {
            playerFinishedGames.push(board);
          }
        }
      }
    }
    setFinishedGames(playerFinishedGames);
    setGames(playerGames);
    setFetchingGames(false);
  }

  return (
    <div className="container p-2 mx-auto flex flex-col gap-5">
      <div className="flex w-full md:w-1/3 gap-5 justify-center md:justify-start">
        <label htmlFor="my-modal-4" className="btn btn-accent">
          Leaderboard
        </label>
        {fetchingGames ? (
          <button className="btn btn-accent loading">Fetching</button>
        ) : (
          <button onClick={() => fetchGames()} className="btn btn-accent">
            Get Games
          </button>
        )}
      </div>
      <h1 className="text-center text-4xl font-bold">Open Games</h1>
      <div className="overflow-x-auto flex lg:justify-center">
        <OngoingGamesTable />
      </div>
      <h1 className="text-center text-4xl font-bold">Finished Games</h1>
      <div className="overflow-x-auto flex lg:justify-center mb-20">
        <FinishedGamesTable />
      </div>
    </div>
  );
};

export default PlayerGames;
