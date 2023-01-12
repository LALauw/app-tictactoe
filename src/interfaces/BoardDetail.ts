export default interface BoardDetail {
  details:
    | string
    | {
        digest: string;
        objectId: string;
        version: number;
      };
  data: {
    dataType: string;
    fields: {
      cur_turn: number;
      game_status: number;
      gameboard: number[][];
      id: {
        id: string;
      };
      o_address: string;
      x_address: string;
    };
  };
}
