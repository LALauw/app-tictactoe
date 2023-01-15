import { PrismaClient } from "@prisma/client";
import Highscore from "./interfaces/Highscore";
import GetTrophyEvents from "./util/GetTrophyEvents";

const prisma = new PrismaClient();

async function updateLeaderboard() {
  console.log("updating leaderboard..");
  try {
    const trophyEvents = await GetTrophyEvents();

    const newLeaderboard = arrangeLeaderboard(trophyEvents);
    const oldLeaderboard: Highscore[] = await prisma.highscore.findMany();

    for (let highscore of newLeaderboard) {
      if (
        !oldLeaderboard.some(
          (oldHighscore) =>
            oldHighscore.player_address === highscore.player_address
        )
      ) {
        await prisma.highscore.create({
          data: {
            player_address: highscore.player_address,
            wins: highscore.wins,
          },
        });
      } else {
        const oldHighscore = oldLeaderboard.find(
          (oldHighscore) =>
            oldHighscore.player_address === highscore.player_address
        );
        if (oldHighscore?.wins !== highscore.wins) {
          await prisma.highscore.update({
            where: {
              player_address: highscore.player_address,
            },
            data: {
              wins: highscore.wins,
            },
          });
        }
      }
    }
    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
  }
}

const arrangeLeaderboard = (trophyEvents: any) => {
  const winners: Map<string, number> = new Map();
  let newLeaderboard: Highscore[] = [];
  for (let winner of trophyEvents) {
    const winnerAddress = winner.event.moveEvent.fields.winner;
    if (winners.has(winnerAddress)) {
      winners.set(winnerAddress, winners.get(winnerAddress)! + 1);
    } else {
      winners.set(winnerAddress, 1);
    }
  }

  winners.forEach((value, key) => {
    newLeaderboard.push({ player_address: key, wins: value });
  });
  newLeaderboard.sort((a, b) => b.wins - a.wins);
  return newLeaderboard;
};

export default updateLeaderboard;
