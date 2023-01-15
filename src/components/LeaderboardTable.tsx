import { useBoardStore } from "../store/store";
import { useWallet } from "@suiet/wallet-kit";
import FetchLeaderboard from "../util/FetchLeaderboard";
import { useQuery } from "react-query";
import { queryClient } from "../main";

const LeaderboardTable = () => {
  const wallet = useWallet();

  const { isLoading, data, error, isFetching } = useQuery("leaderboard", () =>
    FetchLeaderboard()
  );

  if (isLoading || isFetching) {
    return (
      <div className="overflow-x-auto">
        <h1>loading data...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-auto">
        <h1>error occured</h1>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Address</th>
            <th>Trophies 🏆</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((winner, index) => {
            return (
              <tr key={winner.player_address}>
                <td className="hidden md:block">
                  {wallet.account?.address! === winner.player_address
                    ? "You"
                    : winner.player_address}
                </td>
                <td className="block md:hidden">
                  {wallet.account?.address! === winner.player_address
                    ? "You"
                    : winner.player_address.slice(0, 9) +
                      "..." +
                      winner.player_address.slice(-9)}
                </td>

                <td>{winner.wins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
