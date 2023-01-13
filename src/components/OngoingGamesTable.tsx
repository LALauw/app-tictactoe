import { useWallet } from "@suiet/wallet-kit";
import Board from "../interfaces/Board";
import { useBoardStore } from "../store/store";
import TurnCalc from "./TurnCalc";

const OngoingGamesTable = () => {
  const games = useBoardStore((state) => state.games);
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
            <th>Turn</th>
            <th>Player O</th>
            <th>Player X</th>
            <th>Load Board</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game: Board, index: number) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{game.id?.id}</td>
              <td>{TurnCalc(wallet.account?.address!, game)}</td>
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

export default OngoingGamesTable;
