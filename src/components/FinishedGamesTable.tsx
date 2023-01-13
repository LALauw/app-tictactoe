import { useWallet } from "@suiet/wallet-kit";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";

const GameStatus = (game: Board, user: string) => {
  if (game.game_status === 1 && user === game.x_address) {
    return "Win";
  }

  if (game.game_status === 1 && user === game.o_address) {
    return "Lost";
  }

  if (game.game_status === 2 && user === game.x_address) {
    return "Lost";
  }

  if (game.game_status === 2 && user === game.o_address) {
    return "Win";
  }

  if (game.game_status === 3) {
    return "Draw";
  }
};

const FinishedGamesTable = () => {
  const finishedGames = useBoardStore((state) => state.finishedGames);
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setWinner = useBoardStore((state) => state.setWinner);

  return (
    <>
      <table className="table table-zebra ">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Result</th>
            <th>Player O</th>
            <th>Player X</th>
            <th>Load Board</th>
          </tr>
        </thead>
        <tbody>
          {finishedGames.map((game: Board, index: number) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{game.id?.id}</td>
              <td>{GameStatus(game, wallet.account?.address!)}</td>
              <td>
                {wallet.account?.address === game.o_address
                  ? "You"
                  : game.o_address}
              </td>
              <td>
                {wallet.account?.address === game.x_address
                  ? "You"
                  : game.x_address}
              </td>
              <td>
                {board.id?.id === game.id?.id ? (
                  <button className="btn btn-success btn-sm">Selected</button>
                ) : (
                  <button
                    onClick={() => {
                      setBoard(game);
                      setWinner(false);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Select
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default FinishedGamesTable;
