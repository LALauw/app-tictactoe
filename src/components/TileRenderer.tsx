const TileRenderer = ({
  placeMarker,
  place,
  number,
}: {
  placeMarker: any;
  place: number[];
  number: number;
}) => {
  if (number === 2) {
    return (
      <div
        onClick={() => placeMarker(place)}
        className="btn btn-accent w-40 h-40"
      ></div>
    );
  }

  if (number === 0) {
    return (
      <div className="btn btn-accent btn-disabled w-40 h-40 text-5xl font-bold text-opacity-100">
        X
      </div>
    );
  }

  if (number === 1) {
    return (
      <div className="btn btn-accent btn-disabled w-40 h-40 text-5xl font-bold text-opacity-100">
        O
      </div>
    );
  }
  return null;
};

export default TileRenderer;
