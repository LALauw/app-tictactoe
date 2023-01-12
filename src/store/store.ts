import { create } from "zustand";
import Board from "../interfaces/Board";

type State = {
  games: Board[];
  board: Board;
  fetchingGames: boolean;
};

type Actions = {
  setBoard: (board: Board) => void;
  setGames: (games: Board[]) => void;
  setFetchingGames: (status: boolean) => void;
};

export const useBoardStore = create<State & Actions>((set) => ({
  games: [],
  board: {},
  fetchingGames: false,
  setFetchingGames: (status: boolean) =>
    set((state) => ({ fetchingGames: status })),
  setBoard: (board: Board) => set((state) => ({ board: board })),
  setGames: (games: Board[]) => set((state) => ({ games: games })),
}));
