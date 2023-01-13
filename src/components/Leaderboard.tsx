import { useEffect } from "react";
import WinnerObject from "../interfaces/WinnerObject";
import { useBoardStore } from "../store/store";
import SuiProvider from "../util/SuiProvider";
import { useWallet } from "@suiet/wallet-kit";

const Leaderboard = () => {
  const setLeaderboard = useBoardStore((state) => state.setLeaderboard);
  const wallet = useWallet();
  const leaderboard = useBoardStore((state) => state.leaderboard);
  useEffect(() => {
    const getLeaderboard = async () => {
      const data = await SuiProvider.getEvents(
        {
          MoveModule: {
            package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS,
            module: "shared_tic_tac_toe",
          },
        },

        null,
        null
      );
      const filteredTrophies: any = data.data.filter(
        (e: any) =>
          e.event.moveEvent &&
          e.event.moveEvent.type ===
            import.meta.env.VITE_GAME_PACKAGE_ADDRESS +
              "::shared_tic_tac_toe::TrophyEvent"
      );
      const winners: Map<string, number> = new Map();
      let newLeaderboard: WinnerObject[] = [];
      for (let winner of filteredTrophies) {
        const winnerAddress = winner.event.moveEvent.fields.winner;
        if (winners.has(winnerAddress)) {
          winners.set(winnerAddress, winners.get(winnerAddress)! + 1);
        } else {
          winners.set(winnerAddress, 1);
        }
      }

      winners.forEach((value, key) => {
        newLeaderboard.push({ address: key, trophies: value });
      });
      newLeaderboard.sort((a, b) => b.trophies - a.trophies);
      setLeaderboard(newLeaderboard);

      return data;
    };
    getLeaderboard();
  }, []);
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
                  {leaderboard.map((winner, index) => {
                    return (
                      <tr key={winner.address}>
                        <td>
                          {wallet.account?.address! === winner.address
                            ? "You"
                            : winner.address}
                        </td>
                        <td>{winner.trophies}</td>
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
