import { useBoardStore } from "../store/store";
import { useWallet } from "@suiet/wallet-kit";
import FetchLeaderboard from "../util/FetchLeaderboard";
import { useQuery } from "react-query";

const Leaderboard = () => {
  const wallet = useWallet();

  const { isLoading, data, error, isFetching } = useQuery("leaderboard", () =>
    FetchLeaderboard()
  );

  if (isLoading || isFetching) {
    return (
      <>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer">
          <label className="modal-box relative" htmlFor="">
            <div className=" flex flex-col gap-5 text-center items-center justify-center">
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <div className="overflow-x-auto">
                <h1>loading data...</h1>
              </div>
            </div>
          </label>
        </label>
      </>
    );
  }

  if (error) {
    return (
      <>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer">
          <label className="modal-box relative" htmlFor="">
            <div className=" flex flex-col gap-5 text-center items-center justify-center">
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <div className="overflow-x-auto">
                <h1>error occured</h1>
              </div>
            </div>
          </label>
        </label>
      </>
    );
  }

  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className=" flex flex-col gap-5 text-center items-center justify-center">
            <h1 className="text-2xl font-bold">Leaderboard</h1>
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
                        <td>
                          {wallet.account?.address! === winner.player_address
                            ? "You"
                            : winner.player_address}
                        </td>
                        <td>{winner.wins}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
export default Leaderboard;
