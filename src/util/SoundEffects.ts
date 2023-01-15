import { Howl, Howler } from "howler";
import pop from "../assets/pop.mp3";
import whoosh from "../assets/whoosh.mp3";

const popSound = new Howl({
  src: [pop],
});

const whooshSound = new Howl({
  src: [whoosh],
});

export { popSound, whooshSound };
