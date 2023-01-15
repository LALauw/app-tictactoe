import { create } from "zustand";
import Board from "../interfaces/Board";
import { GamesStatusOption } from "../util/GameStatusOption";
import SuiProvider from "../util/SuiProvider";

type State = {
  gamestatus: GamesStatusOption;
  games: Board[];
  finishedGames: Board[];
  board: Board;
  fetchingGames: boolean;
};

type Actions = {
  setGameStatus: (status: GamesStatusOption) => void;
  setBoard: (board: Board) => void;
  setGames: (games: Board[]) => void;
  setFinishedGames: (games: Board[]) => void;
  setFetchingGames: (status: boolean) => void;
  updateBoard: (boardId: string) => Promise<Board>;
};

export const useBoardStore = create<State & Actions>((set) => ({
  gamestatus: "Ongoing",
  finishedGames: [],
  games: [],
  board: {},
  fetchingGames: false,
  setGameStatus: (status: GamesStatusOption) =>
    set((state) => ({ gamestatus: status })),
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
    if (newBoard.game_status === 1) {
      set({ gamestatus: "XWin" });
    }
    if (newBoard.game_status === 2) {
      set({ gamestatus: "OWin" });
    }
    if (newBoard.game_status === 3) {
      set({ gamestatus: "Draw" });
    }
    set({ board: newBoard });
    return newBoard;
  },
}));
