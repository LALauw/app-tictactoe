import { useBoardStore } from "../store/store";
import SuiProvider from "./SuiProvider";

async function updateBoard(boardId: string) {
  //   const setBoard = useBoardStore((state) => state.setBoard);
  //   const updatedBoard = await SuiProvider.getObject(boardId);
  //   if (updatedBoard.details) {
  //     //@ts-ignore
  //     const newBoard: Board = updatedBoard.details?.data.fields;
  //     setBoard(newBoard);
  //     return newBoard;
  //   }
}

export default updateBoard;
