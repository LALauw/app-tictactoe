import { toast, ToastOptions } from "react-toastify";

enum status {
  win = 1,
  lose = 2,
  draw = 3,
  mark_places = 4,
  error = 5,
  invalid_turn = 6,
}

const toastProps: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const RenderToast = (status: status) => {
  if (status == 1) {
    return toast(`🎉 You won! Congrats! 🎉`, toastProps);
  } else if (status == 2) {
    return toast(`😢 You lost! Better luck next time! 😢`, toastProps);
  } else if (status == 3) {
    return toast(`🤝 It's a draw! 🤝`, toastProps);
  } else if (status == 4) {
    return toast.success(`Mark Placed!`, toastProps);
  } else if (status == 5) {
    return toast.error(`Error! Try Again!`, toastProps);
  } else if (status == 6) {
    return toast.warn(`It's not your turn, yet!`, toastProps);
  }
};
