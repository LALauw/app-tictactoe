import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import * as tweetnacl from "tweetnacl";
import Board from "./interfaces/Board";
import PlayerGames from "./components/PlayerGames";
import SuiProvider from "./util/SuiProvider";
import { useBoardStore } from "./store/store";
import GameBoard from "./components/GameBoard";
// connect to Devnet

function App() {
  const [count, setCount] = useState(0);
  const [challengedPlayer, setChallengedPlayer] = useState("");
  const [gameId, setGameId] = useState("");
  // const [board, setBoard] = useState<Board>();
  const board = useBoardStore((state) => state.board);
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("connected wallet name: ", wallet.name);
    console.log("account address: ", wallet.account?.address);
    console.log("account publicKey: ", wallet.account?.publicKey);
    const objectFetch = async () => {
      const objects = await SuiProvider.getObject(
        "0x4b292decdb128ba879ac82d5779df0e9db3e9b84"
      );
      console.log(objects);
    };
    objectFetch();
  }, [wallet.connected]);

  async function handleSignMsg() {
    try {
      const msg = "Hello world!";
      const result = await wallet.signMessage({
        message: new TextEncoder().encode(msg),
      });
      if (!result) return;
      console.log("signMessage success", result);

      // you can use tweetnacl library
      // to verify whether the signature matches the publicKey of the account.
      const isSignatureTrue = tweetnacl.sign.detached.verify(
        result.signedMessage,
        result.signature,
        wallet.account?.publicKey as Uint8Array
      );
      console.log(
        "verify signature with publicKey via tweetnacl",
        isSignatureTrue
      );
    } catch (e) {
      console.error("signMessage failed", e);
    }
  }

  async function handleSignAndExecuteTx() {
    if (!wallet.connected) return;
    try {
      if (wallet.account?.address! === challengedPlayer) {
        return alert("You can't challenge yourself");
      }
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data: {
            packageObjectId: "0xad5831fe358a89d487648c2c52f6cad0560767fa",
            module: "shared_tic_tac_toe",
            function: "create_game",
            typeArguments: [],
            arguments: [wallet.account?.address!, challengedPlayer],
            gasBudget: 10000,
          },
        },
      });
      console.log("Creating game", resData);
      if (resData.effects.created) {
        console.log("Game ID", resData.effects.created[0].reference.objectId);
        setGameId(resData.effects.created[0].reference.objectId);
        const newBoard = await SuiProvider.getObject(
          resData.effects.created[0].reference.objectId
        );
        //@ts-ignore
        setBoard(newBoard.details?.data.fields);

        alert(
          "Congrats, created a game \n ID: " +
            resData.effects.created[0].reference.objectId
        );
      }
    } catch (e) {
      console.error("Game Creation failed", e);
    }
  }

  async function getEvents() {
    const MoveFunction: any = {
      MoveModule: {
        package: "0xad5831fe358a89d487648c2c52f6cad0560767fa",
        module: "shared_tic_tac_toe",
      },
    };
    // const events = await provider.ge(devnetNftFilter);
    //console.log(events);
  }

  return (
    <div className="container mx-auto">
      <div className="navbar justify-between flex mb-10 mt-5">
        <h1 className="text-5xl font-bold">Tic-Tac-Toe</h1>
        <ConnectButton label="Connect" />
      </div>
      {wallet.account && (
        <div className="container flex gap-5 p-20">
          <div className="w-1/2 flex flex-col gap-5">
            <label className="text-2xl font-bold text-pink-500">
              Challenge a player
            </label>
            <input
              className="input input-secondary max-w-md"
              onChange={(e) => setChallengedPlayer(e.target.value)}
              type="text"
            ></input>
            <button
              className="btn btn-md w-40"
              onClick={() => handleSignAndExecuteTx()}
            >
              Make Game
            </button>
            <button className="btn btn-md w-40" onClick={() => getEvents()}>
              print events
            </button>
          </div>

          {board && <GameBoard />}
        </div>
      )}
      <PlayerGames />
    </div>
  );
}

export default App;
