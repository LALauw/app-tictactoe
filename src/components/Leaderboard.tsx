import { queryClient } from "../main";
import LeaderboardTable from "./LeaderboardTable";

const Leaderboard = () => {
  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className=" flex flex-col gap-5 text-center items-center justify-center">
            <div className="w-full flex flex-col md:flex-row md:justify-between justify-center items-center gap-5">
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <button
                onClick={() => queryClient.refetchQueries("leaderboard")}
                className="btn w-20 btn-primary btn-square"
              >
                Refresh
              </button>
            </div>
            <LeaderboardTable />
          </div>
        </label>
      </label>
    </>
  );
};
export default Leaderboard;
