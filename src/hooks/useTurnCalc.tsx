import Board from "../interfaces/Board";

export const useTurnCalc = (address: string, board: Board) => {
  if (
    address === board.o_address &&
    (board.cur_turn! % 2 == 1 || board.cur_turn == 1)
  ) {
    return "Your Turn";
  }

  if (
    address === board.x_address &&
    (board.cur_turn! % 2 == 0 || board.cur_turn == 0)
  ) {
    return "Your Turn";
  }

  return "Awaiting Opponent";
};
