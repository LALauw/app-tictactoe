import Board from "../interfaces/Board";
import { useWallet } from "@suiet/wallet-kit";
import { useBoardStore } from "../store/store";
import TurnCalc from "./TurnCalc";

const GameTable = ({ option }: { option: number }) => {
  const games = useBoardStore((state) => state.games);
  const finishedGames = useBoardStore((state) => state.finishedGames);
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setWinner = useBoardStore((state) => state.setWinner);
  const wallet = useWallet();

  if (games.length > 0 || finishedGames.length > 0) {
    return (
      <>
        <table className="table table-normal table-zebra ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Turn</th>
              <th>Player O</th>
              <th>Player X</th>
              <th>Load Board</th>
            </tr>
          </thead>
          <tbody>
            {option === 0
              ? games.map((game: Board, index: number) => (
                  <tr key={index}>
                    <td>{game.id?.id}</td>
                    <td>{game.game_status}</td>
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
                        <button className="btn btn-success btn-sm">
                          Selected
                        </button>
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
                ))
              : finishedGames.map((game: Board, index: number) => (
                  <tr key={index}>
                    <td>{game.id?.id}</td>
                    <td>{game.game_status}</td>
                    <td>Finished</td>
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
                        <button className="btn btn-success btn-sm">
                          Selected
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setBoard(game);
                            setWinner(true);
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
  }
  return <></>;
};

export default GameTable;
