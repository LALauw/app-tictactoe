import { PrismaClient } from "@prisma/client";
import Highscore from "./interfaces/Highscore";

const prisma = new PrismaClient();

async function fetchLeaderboard(): Promise<Highscore[]> {
  const highscores = await prisma.highscore.findMany({
    orderBy: {
      wins: "desc",
    },
  });
  await prisma.$disconnect();
  return highscores;
}

export default fetchLeaderboard;
