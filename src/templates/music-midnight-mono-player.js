const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "music",
  template: "music-midnight-mono-player",
  width: 900,
  height: 340,
  background: {
    imagePath: null,
    startColor: "#080808",
    endColor: "#141414",
    overlayColor: "#000000",
    overlayOpacity: 0
  },
  card: {
    x: 50,
    y: 40,
    width: 800,
    height: 260,
    radius: 28,
    startColor: "#111111",
    endColor: "#1A1A1A",
    borderColor: "#FFFFFF",
    borderOpacity: 0.08,
    borderWidth: 1.5,
    outlineColor: "#FFFFFF",
    outlineOpacity: 0.03,
    outlineWidth: 1
  },
  cover: {
    enabled: true,
    path: null,
    opacity: 1,
    frameX: 78,
    frameY: 52,
    frameWidth: 236,
    frameHeight: 236,
    frameRadius: 28,
    frameFill: "#0D0D0D",
    frameBorderColor: "#FFFFFF",
    frameBorderOpacity: 0.08,
    frameBorderWidth: 2,
    x: 86,
    y: 60,
    width: 220,
    height: 220,
    radius: 22,
    overlayColor: "#000000",
    overlayOpacity: 0.10,
    placeholderText: "Capa",
    placeholderColor: "#FFFFFF",
    placeholderOpacity: 0.58
  },
  text: {
    badge: {
      value: "NOW PLAYING",
      color: "#FFFFFF",
      opacity: 0.76,
      bgColor: "#FFFFFF",
      bgOpacity: 0.06,
      borderColor: "#FFFFFF",
      borderOpacity: 0.06
    },
    title: {
      value: "Nome da música",
      color: "#FFFFFF"
    },
    subtitle: {
      value: "music card",
      color: "#FFFFFF",
      opacity: 0.42
    },
    timeStart: {
      value: "0:00",
      color: "#FFFFFF"
    },
    timeEnd: {
      value: "~:~",
      color: "#FFFFFF"
    },
    timeOpacity: 0.60
  },
  progress: {
    x: 370,
    y: 218,
    width: 400,
    height: 10,
    radius: 999,
    value: 38,
    startColor: "#FFFFFF",
    endColor: "#BFBFBF",
    trackColor: "#FFFFFF",
    trackOpacity: 0.10,
    handleColor: "#FFFFFF",
    handleRadius: 9
  },
  shadow: {
    dx: 0,
    dy: 14,
    blur: 18,
    color: "#000000",
    opacity: 0.32
  },
  fonts: {
    base: "Inter, Roboto, Arial, sans-serif"
  },
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createMusicMidnightMonoPlayer(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createMusicMidnightMonoPlayer
};
