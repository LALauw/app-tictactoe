import { Howl } from "howler";
import pop from "../assets/pop.mp3";
import whoosh from "../assets/whoosh.mp3";
import success from "../assets/success.wav";
import win from "../assets/win.wav";
import bg_music from "../assets/bg_music.mp3";

const popSound = new Howl({
  src: [pop],
});

const whooshSound = new Howl({
  src: [whoosh],
});

const successSound = new Howl({
  src: [success],
});

const winSound = new Howl({
  src: [win],
});

const bgMusic = new Howl({
  src: [bg_music],
  loop: true,
  volume: 0.2,
  autoplay: true,
});

export { popSound, whooshSound, successSound, winSound, bgMusic };
