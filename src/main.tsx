import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import Leaderboard from "./components/Leaderboard";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Leaderboard />
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
