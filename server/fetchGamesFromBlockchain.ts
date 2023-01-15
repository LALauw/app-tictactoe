import { TransactionQuery } from "@mysten/sui.js";
import storeGames from "./storeGames";
import GameObject from "./interfaces/GameObject";
import provider from "./util/Provider";

const fetchGamesFromBlockchain = async () => {
  try {
    console.log("fetching games");
    const MoveFunction: TransactionQuery = {
      MoveFunction: {
        package: process.env.GAME_PACKAGE_ADDRESS as string,
        module: "shared_tic_tac_toe",
        function: "create_game",
      },
    };
    let transactions = [];
    let objects = [];
    let games = [];

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
        const board: GameObject = {
          cur_turn: objectData.details.data.fields.cur_turn,
          o_address: objectData.details.data.fields.o_address,
          x_address: objectData.details.data.fields.x_address,
          game_id: objectData.details.data.fields.id.id,
          game_status: objectData.details.data.fields.game_status,
        };
        games.push(board);
      }
    }
    await storeGames(games);
  } catch (err) {
    console.log(err);
  }
};

export default fetchGamesFromBlockchain;
