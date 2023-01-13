import { useBoardStore } from "../store/store";

const TileRenderer = ({
  placeMarker,
  place,
  number,
}: {
  placeMarker: any;
  place: number[];
  number: number;
}) => {
  const winner = useBoardStore((state) => state.winner);
  if (number === 2) {
    return (
      <div
        onClick={() => placeMarker(place)}
        className={`btn btn-accent ${
          winner ? "btn-disabled" : ""
        } w-20 h-20 lg:w-40 lg:h-40`}
      ></div>
    );
  }

  if (number === 0) {
    return (
      <div className="btn btn-accent btn-disabled w-20 h-20 lg:w-40 lg:h-40 text-5xl font-bold text-opacity-100">
        X
      </div>
    );
  }

  if (number === 1) {
    return (
      <div className="btn btn-accent btn-disabled w-20 h-20 lg:w-40 lg:h-40 text-5xl font-bold text-opacity-100">
        O
      </div>
    );
  }
  return null;
};

export default TileRenderer;
