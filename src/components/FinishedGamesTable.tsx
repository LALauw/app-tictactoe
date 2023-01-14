import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "react-query";
import Board from "../interfaces/Board";
import GameObject from "../interfaces/GameObject";
import { useBoardStore } from "../store/store";
import FetchPlayerGamesv2 from "../util/FetchPlayerGamesv2";
import { GamesStatusOption } from "../util/GameStatusOption";
import { RenderToast } from "../util/RenderToast";
import provider from "../util/SuiProvider";

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
  const wallet = useWallet();
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setGameStatus = useBoardStore((state) => state.setGameStatus);
  const gamestatus = useBoardStore((state) => state.gamestatus);

  const { isLoading, error, data, isRefetching, isRefetchError } = useQuery(
    "PlayerGames",
    () => FetchPlayerGamesv2(wallet.account?.address || null),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isRefetching) {
    return (
      <div className="container h-36 flex items-center justify-center text-white">
        <button className="btn loading">Loading Finished Games...</button>
      </div>
    );
  }

  if (error || isRefetchError) {
    return (
      <div className="container h-36 flex items-center justify-center text-white">
        <h1 className="font-bold text-2xl">An error occured, try again!</h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-4xl font-bold">Finished Games</h1>
      <div className="overflow-x-auto flex lg:justify-center mb-20">
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
            {data &&
              data.map((game: GameObject, index: number) => (
                <tr
                  key={index}
                  className={`${game.game_status !== 0 ? "" : "hidden"}`}
                >
                  <td>{index}</td>
                  <td>{game.game_id}</td>
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
                    {board.id?.id === game.game_id ? (
                      <button className="btn btn-success btn-sm">
                        Selected
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const objectData: any = await provider.getObject(
                            game.game_id
                          );
                          const board: Board = objectData.details.data.fields;
                          setBoard(board);
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
      </div>
    </>
  );
};

export default FinishedGamesTable;
