-- CreateTable
CREATE TABLE "Highscore" (
    "player_address" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "Highscore_pkey" PRIMARY KEY ("player_address")
);
