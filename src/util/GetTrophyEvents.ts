import SuiProvider from "./SuiProvider";

const GetTrophyEvents = async () => {
  const data = await SuiProvider.getEvents(
    {
      MoveModule: {
        package: import.meta.env.VITE_GAME_PACKAGE_ADDRESS,
        module: "shared_tic_tac_toe",
      },
    },

    null,
    null
  );
  const filteredTrophies = data.data.filter(
    (e: any) =>
      e.event.moveEvent &&
      e.event.moveEvent.type ===
        import.meta.env.VITE_GAME_PACKAGE_ADDRESS +
          "::shared_tic_tac_toe::TrophyEvent"
  );
  return filteredTrophies;
};
export default GetTrophyEvents;
