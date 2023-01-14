import GameObject from "../interfaces/GameObject";

const FetchPlayerGamesv2 = async (playerAddress: string | null) => {
  const data = await fetch(
    `${import.meta.env.VITE_API_URL as string}/getUserGames/${playerAddress}`
  );
  const games: GameObject[] = await data.json();
  return games;
};

export default FetchPlayerGamesv2;
