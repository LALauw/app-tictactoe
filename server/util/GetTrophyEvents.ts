import Provider from "./Provider";

const GetTrophyEvents = async () => {
  const data = await Provider.getEvents(
    {
      MoveModule: {
        package: process.env.GAME_PACKAGE_ADDRESS as string,
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
        (process.env.GAME_PACKAGE_ADDRESS as string) +
          "::shared_tic_tac_toe::TrophyEvent"
  );
  return filteredTrophies;
};
export default GetTrophyEvents;
