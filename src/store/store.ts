import { create } from "zustand";
import Board from "../interfaces/Board";
import WinnerObject from "../interfaces/WinnerObject";
import SuiProvider from "../util/SuiProvider";

type State = {
  leaderboard: WinnerObject[];
  winner: boolean;
  games: Board[];
  finishedGames: Board[];
  board: Board;
  fetchingGames: boolean;
};

type Actions = {
  setLeaderboard: (newLeaderboard: WinnerObject[]) => void;
  setWinner: (isWinner: boolean) => void;
  setBoard: (board: Board) => void;
  setGames: (games: Board[]) => void;
  setFinishedGames: (games: Board[]) => void;
  setFetchingGames: (status: boolean) => void;
  updateBoard: (boardId: string) => Promise<Board>;
};

export const useBoardStore = create<State & Actions>((set) => ({
  leaderboard: [],
  winner: false,
  finishedGames: [],
  games: [],
  board: {},
  fetchingGames: false,
  setLeaderboard: (newLeaderboard: WinnerObject[]) =>
    set((state) => ({ leaderboard: newLeaderboard })),
  setWinner: (isWinner: boolean) => set((state) => ({ winner: isWinner })),
  setFetchingGames: (status: boolean) =>
    set((state) => ({ fetchingGames: status })),
  setBoard: (board: Board) => set((state) => ({ board: board })),
  setFinishedGames: (finishedGames: Board[]) =>
    set((state) => ({ finishedGames: finishedGames })),
  setGames: (games: Board[]) => set((state) => ({ games: games })),
  updateBoard: async (boardId: string) => {
    const updatedBoard = await SuiProvider.getObject(boardId);
    //@ts-ignore
    const newBoard: Board = updatedBoard.details?.data.fields;
    set({ board: newBoard });
    return newBoard;
  },
}));
