import { useWallet } from "@suiet/wallet-kit";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import { GamesStatusOption } from "../util/GameStatusOption";

const Result = (game: Board, user: string, status: GamesStatusOption) => {
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
  const setGameStatus = useBoardStore((state) => state.setGameStatus);
  const gamestatus = useBoardStore((state) => state.gamestatus);

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
              <td>{Result(game, wallet.account?.address!, gamestatus)}</td>
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
                      setGameStatus(
                        game.game_status === 1
                          ? "XWin"
                          : game.game_status === 2
                          ? "OWin"
                          : "Draw"
                      );
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
