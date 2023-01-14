import { PrismaClient } from "@prisma/client";
import Board from "./util/Board";
import GameObject from "./util/GameObject";

const prisma = new PrismaClient();

async function createGame(game: Board) {
  const gameExists = await prisma.game.findUnique({
    where: {
      game_id: game.id?.id,
    },
  });
  if (!gameExists) {
    const gameCreated = await prisma.game.create({
      data: {
        game_id: game.id?.id!,
        x_address: game.x_address!,
        o_address: game.o_address!,
        cur_turn: game.cur_turn!,
        game_status: game.game_status!,
      },
    });
    await prisma.$disconnect();
    return true;
  } else {
    await prisma.$disconnect();
    return false;
  }
}

export default createGame;
