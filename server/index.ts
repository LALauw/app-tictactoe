import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import provider from "./util/Provider";
import GameObject from "./interfaces/GameObject";
import cron from "node-cron";
import fetchGamesByUser from "./fetchGamesByUser";
import cors from "cors";
import Board from "./interfaces/Board";
import createGame from "./createGame";
import fetchGamesFromBlockchain from "./fetchGamesFromBlockchain";
import updateLeaderboard from "./updateLeaderboard";
import fetchLeaderboard from "./fetchLeaderboard";

let corsOptions = {
  origin: ["http://127.0.0.1:5173/"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

cron.schedule("*/30 * * * * *", function () {
  fetchGamesFromBlockchain();
  updateLeaderboard();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get(
  "/getUserGames/:id",
  cors(corsOptions),
  async (req: Request, res: Response) => {
    const userGames: GameObject[] = await fetchGamesByUser(req.params.id);
    res.status(200).json(userGames);
  }
);

app.get(
  "/getLeaderboard",
  cors(corsOptions),
  async (req: Request, res: Response) => {
    try {
      const leaderboard = await fetchLeaderboard();
      res.status(200).json(leaderboard);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

app.post(
  "/createGame",
  cors(corsOptions),
  async (req: Request, res: Response) => {
    const game_id = req.body.game_id;
    const objectData: any = await provider.getObject(game_id);
    if (objectData) {
      const board: Board = objectData.details.data.fields;
      const gameCreated = await createGame(board);
      if (gameCreated)
        res.status(200).json({
          status: "success",
        });
      else {
        res.status(400).json({
          status: "failed",
        });
      }
    } else {
      res.status(400).json({
        status: "failed",
      });
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
