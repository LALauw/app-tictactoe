import { useWallet } from "@suiet/wallet-kit";
import { useEffect } from "react";
import { queryClient } from "../main";
import FinishedGamesTable from "./FinishedGamesTable";
import OngoingGamesTable from "./OngoingGamesTable";

const PlayerGames = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected) {
      queryClient.invalidateQueries("PlayerGames");
    }
  }, [wallet.connected]);

  return (
    <div className="container p-2 mx-auto flex flex-col gap-5">
      <div className="flex w-full md:w-1/3 gap-5 justify-center md:justify-start">
        <label htmlFor="my-modal-4" className="btn btn-accent">
          Leaderboard
        </label>
        <button
          onClick={() => queryClient.refetchQueries("PlayerGames")}
          className="btn btn-accent"
        >
          Get Games
        </button>
      </div>
      <OngoingGamesTable />

      <FinishedGamesTable />
    </div>
  );
};

export default PlayerGames;
