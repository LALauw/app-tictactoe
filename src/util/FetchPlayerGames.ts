import { TransactionQuery } from "@mysten/sui.js";
import Board from "../interfaces/Board";
import provider from "./SuiProvider";

const MoveFunction: TransactionQuery = {
  MoveFunction: {
    package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS as string,
    module: "shared_tic_tac_toe",
    function: "create_game",
  },
};

const FetchPlayerGames = async (playerAddress: string | null) => {
  if (!playerAddress) return { playerFinishedGames: [], playerGames: [] };
  let transactions = [];
  let objects = [];
  let playerFinishedGames: Board[] = [];
  let playerGames: Board[] = [];

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
        board.game_status !== 0 &&
        (board.o_address === playerAddress || board.x_address === playerAddress)
      ) {
        playerFinishedGames.push(board);
      } else if (
        board.game_status === 0 &&
        (board.o_address === playerAddress || board.x_address === playerAddress)
      ) {
        playerGames.push(board);
      }
    }
  }
  console.log(playerFinishedGames);
  console.log(playerGames);
  return { playerFinishedGames, playerGames };
};

export default FetchPlayerGames;
