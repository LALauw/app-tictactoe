import { PrismaClient } from "@prisma/client";
import GameObject from "./interfaces/GameObject";

const prisma = new PrismaClient();

async function storeGames(games: GameObject[]) {
  for (let game of games) {
    const gameExists = await prisma.game.findUnique({
      where: {
        game_id: game.game_id,
      },
    });
    if (!gameExists) {
      await prisma.game.create({
        data: {
          game_id: game.game_id,
          x_address: game.x_address,
          o_address: game.o_address,
          cur_turn: game.cur_turn,
          game_status: game.game_status,
        },
      });
      console.log("game created: " + game.game_id);
    } else {
      if (gameExists.game_status !== game.game_status) {
        await prisma.game.update({
          where: {
            game_id: game.game_id,
          },
          data: {
            game_id: game.game_id,
            x_address: game.x_address,
            o_address: game.o_address,
            cur_turn: game.cur_turn,
            game_status: game.game_status,
          },
        });
        console.log("game updated: " + game.game_id);
      }
    }
  }
  await prisma.$disconnect();
}

export default storeGames;
