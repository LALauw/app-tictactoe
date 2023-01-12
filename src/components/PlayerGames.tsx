import { useEffect, useState } from "react";
import {
  JsonRpcProvider,
  Network,
  SuiEventEnvelope,
  SuiEventFilter,
  TransactionQuery,
} from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import React from "react";
import Board from "../interfaces/Board";
import GameTable from "./GameTable";
import { useBoardStore } from "../store/store";

const PlayerGames = () => {
  const [playerGames, setPlayerGames] = useState<any>();
  const wallet = useWallet();
  const setGames = useBoardStore((state) => state.setGames);
  const setFetchingGames = useBoardStore((state) => state.setFetchingGames);
  const fetchingGames = useBoardStore((state) => state.fetchingGames);
  const provider = new JsonRpcProvider(Network.DEVNET);
  const MoveFunction: TransactionQuery = {
    MoveFunction: {
      package: "0xad5831fe358a89d487648c2c52f6cad0560767fa",
      module: "shared_tic_tac_toe",
      function: "create_game",
    },
  };

  async function fetchGames() {
    let transactions = [];
    let objects = [];
    let playerGames = [];
    setFetchingGames(true);
    const data = await provider.getTransactions(MoveFunction);
    for (let item of data.data) {
      transactions.push(item);
    }

    for (let item of transactions) {
      const transactionalData = await provider.getTransactionWithEffects(item);
      if (transactionalData.effects.events) {
        // @ts-ignore
        objects.push(transactionalData.effects.events[1].newObject.objectId);
      }
    }

    for (let object of objects) {
      const objectData = await provider.getObject(object);
      if (objectData) {
        // @ts-ignore
        const board: Board = objectData.details.data.fields;
        if (
          board.game_status === 0 &&
          (board.o_address === wallet.account?.address ||
            board.x_address === wallet.account?.address)
        ) {
          playerGames.push(board);
        }
      }
    }
    setGames(playerGames);
    setFetchingGames(false);
  }

  return (
    <>
      {fetchingGames ? (
        <button className="btn btn-accent loading">Fetching</button>
      ) : (
        <button onClick={() => fetchGames()} className="btn btn-accent">
          Get Games
        </button>
      )}

      <div className="flex items-center justify-center w-full overflow-x-auto mb-20">
        <GameTable />
      </div>
    </>
  );
};

export default PlayerGames;
