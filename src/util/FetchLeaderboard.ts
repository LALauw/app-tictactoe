import Highscore from "../interfaces/Highscore";

const FetchLeaderboard = async () => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL as string}/getLeaderboard`
  );
  const highscores: Highscore[] = await data.json();
  return highscores;
};

export default FetchLeaderboard;
