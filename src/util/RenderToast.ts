import { toast, ToastOptions } from "react-toastify";

const toastProps: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const RenderToast = (status: number) => {
  if (status === 1) return toast(`🎉 You won! Congrats! 🎉`, toastProps);

  if (status === 2)
    return toast(`😢 You lost! Better luck next time! 😢`, toastProps);

  if (status === 3) return toast(`🤝 It's a draw! 🤝`, toastProps);

  if (status === 4) return toast.success(`Mark Placed!`, toastProps);

  if (status === 5) return toast.error(`Error! Try Again!`, toastProps);

  if (status === 6) return toast.warn(`It's not your turn, yet!`, toastProps);

  if (status === 7) return toast.info(`Game Created!`, toastProps);

  if (status === 8) return toast.warn(`Game Ended!`, toastProps);
};
