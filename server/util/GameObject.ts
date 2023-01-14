export default interface GameObject {
  cur_turn: number;
  o_address: string;
  x_address: string;
  game_id: string;
  game_status: number;
  createdAt?: Date;
}
