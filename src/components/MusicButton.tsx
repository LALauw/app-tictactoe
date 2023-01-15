import { useState } from "react";
import { bgMusic } from "../util/SoundEffects";

const MusicButton = () => {
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    if (playing) {
      bgMusic.pause();
      setPlaying(false);
    } else {
      bgMusic.play();
      setPlaying(true);
    }
  };
  return (
    <div className=" fixed bottom-5 left-5 z-20">
      <div className="chat chat-start">
        <div className="chat-bubble font-bold">
          <div className="w-full h-full font-bold ">
            Music
            <input
              onClick={() => toggleMusic()}
              type="checkbox"
              className="toggle toggle-success"
              checked={playing ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicButton;
