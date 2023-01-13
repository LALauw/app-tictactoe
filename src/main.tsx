import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import Leaderboard from "./components/Leaderboard";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider>
      <Leaderboard />
      <App />
    </WalletProvider>
  </React.StrictMode>
);
