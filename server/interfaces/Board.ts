export default interface Board {
  cur_turn?: number;
  o_address?: string;
  x_address?: string;
  gameboard?: number[][];
  id?: {
    id: string;
  };
  game_status?: number;
}
