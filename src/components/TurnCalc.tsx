import { useWallet } from "@suiet/wallet-kit";
import Board from "../interfaces/Board";

const TurnCalc = (address: string, game: Board) => {
  if (
    address === game.o_address &&
    (game.cur_turn! % 2 == 1 || game.cur_turn == 1)
  ) {
    return "Your Turn";
  }

  if (
    address === game.x_address &&
    (game.cur_turn! % 2 == 0 || game.cur_turn == 0)
  ) {
    return "Your Turn";
  }

  return "Awaiting Opponent";
};

export default TurnCalc;
