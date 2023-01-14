-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "game_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "x_address" TEXT NOT NULL,
    "o_address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cur_turn" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
