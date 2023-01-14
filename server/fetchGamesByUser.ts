import { PrismaClient } from "@prisma/client";
import GameObject from "./util/GameObject";

const prisma = new PrismaClient();

async function fetchGamesByUser(address: string): Promise<GameObject[]> {
  const games = await prisma.game.findMany({
    where: {
      OR: [
        {
          x_address: address,
        },
        {
          o_address: address,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  await prisma.$disconnect();
  return games;
}

export default fetchGamesByUser;
