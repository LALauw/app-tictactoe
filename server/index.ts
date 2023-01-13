import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import provider from "./util/Provider";
import { SuiEventEnvelope, SuiEventFilter } from "@mysten/sui.js/dist/types";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const watchForEvents = async () => {
  console.log("starting watch");
  const filter: SuiEventFilter = {
    Package: "0xa18edaa54913a7e324ce066dfbce703317215e3f",
    Module: "shared_tic_tac_toe",
    MoveEventType:
      "0xa18edaa54913a7e324ce066dfbce703317215e3f::shared_tic_tac_toe::CreateGameEvent",
    EventType: "MoveEvent",
  };
  console.log(provider.endpoints);
  await provider.subscribeEvent(filter, (event: SuiEventEnvelope) => {
    console.log("event received");
    console.log(event);
  });

  console.log("watching..");
};

watchForEvents();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
