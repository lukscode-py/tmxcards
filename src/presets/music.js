const accents = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#84cc16",
  "#14b8a6",
  "#f97316"
];

const layouts = [
  {
    panel: { x: 24, y: 24, width: 752, height: 272, radius: 26 },
    thumbnail: { enabled: true, x: 48, y: 55, width: 210, height: 210, radius: 20 },
    progress: { x: 285, y: 242, width: 420, height: 10 },
    title: { x: 287, y: 82, size: 30 },
    artist: { x: 289, y: 127, size: 20 },
    duration: { x: 289, y: 176, size: 18 },
    footer: { x: 289, y: 214, size: 16 }
  },
  {
    panel: { x: 36, y: 34, width: 728, height: 252, radius: 36 },
    thumbnail: { enabled: true, x: 570, y: 66, width: 150, height: 150, radius: 24 },
    progress: { x: 74, y: 232, width: 470, height: 12 },
    title: { x: 72, y: 84, size: 34 },
    artist: { x: 74, y: 134, size: 20 },
    duration: { x: 74, y: 184, size: 18 },
    footer: { x: 570, y: 232, size: 15 }
  },
  {
    panel: { x: 0, y: 0, width: 800, height: 320, radius: 0 },
    thumbnail: { enabled: false },
    progress: { x: 58, y: 246, width: 684, height: 14 },
    title: { x: 58, y: 84, size: 44 },
    artist: { x: 60, y: 150, size: 22 },
    duration: { x: 60, y: 196, size: 18 },
    footer: { x: 60, y: 278, size: 15 }
  },
  {
    panel: { x: 30, y: 40, width: 740, height: 240, radius: 22 },
    thumbnail: { enabled: true, x: 56, y: 72, width: 176, height: 176, radius: 18 },
    progress: { x: 270, y: 226, width: 430, height: 10 },
    title: { x: 270, y: 82, size: 32 },
    artist: { x: 272, y: 130, size: 20 },
    duration: { x: 272, y: 174, size: 18 },
    footer: { x: 272, y: 252, size: 15 }
  },
  {
    panel: { x: 74, y: 36, width: 652, height: 248, radius: 34 },
    thumbnail: { enabled: true, x: 94, y: 82, width: 136, height: 136, radius: 68 },
    progress: { x: 270, y: 230, width: 380, height: 10 },
    title: { x: 270, y: 86, size: 32 },
    artist: { x: 272, y: 132, size: 20 },
    duration: { x: 272, y: 174, size: 18 },
    footer: { x: 272, y: 256, size: 15 }
  },
  {
    panel: { x: 34, y: 34, width: 732, height: 252, radius: 18 },
    thumbnail: { enabled: false },
    progress: { x: 62, y: 232, width: 612, height: 12 },
    title: { x: 60, y: 90, size: 42 },
    artist: { x: 62, y: 152, size: 21 },
    duration: { x: 62, y: 194, size: 18 },
    footer: { x: 620, y: 252, size: 15 }
  },
  {
    panel: { x: 22, y: 22, width: 756, height: 276, radius: 44 },
    thumbnail: { enabled: true, x: 48, y: 52, width: 190, height: 190, radius: 30 },
    progress: { x: 272, y: 236, width: 420, height: 12 },
    title: { x: 270, y: 62, size: 36 },
    artist: { x: 272, y: 116, size: 20 },
    duration: { x: 272, y: 164, size: 18 },
    footer: { x: 272, y: 266, size: 15 }
  },
  {
    panel: { x: 42, y: 54, width: 716, height: 212, radius: 28 },
    thumbnail: { enabled: true, x: 616, y: 96, width: 108, height: 108, radius: 18 },
    progress: { x: 76, y: 220, width: 500, height: 10 },
    title: { x: 74, y: 88, size: 34 },
    artist: { x: 76, y: 136, size: 20 },
    duration: { x: 76, y: 178, size: 18 },
    footer: { x: 600, y: 230, size: 15 }
  },
  {
    panel: { x: 96, y: 28, width: 608, height: 264, radius: 34 },
    thumbnail: { enabled: true, x: 330, y: 52, width: 132, height: 132, radius: 66 },
    progress: { x: 154, y: 260, width: 490, height: 10 },
    title: { x: 154, y: 188, size: 30 },
    artist: { x: 154, y: 142, size: 20 },
    duration: { x: 154, y: 232, size: 17 },
    footer: { x: 560, y: 254, size: 14 }
  },
  {
    panel: { x: 18, y: 50, width: 764, height: 220, radius: 20 },
    thumbnail: { enabled: false },
    progress: { x: 50, y: 226, width: 570, height: 12 },
    title: { x: 46, y: 88, size: 40 },
    artist: { x: 50, y: 146, size: 21 },
    duration: { x: 50, y: 188, size: 18 },
    footer: { x: 640, y: 230, size: 15 }
  }
];

function createPreset(index, accentColor, layout) {
  const id = `music-${String(index).padStart(2, "0")}`;

  return {
    id,
    kind: "music",
    width: 800,
    height: 320,
    output: {
      format: "png",
      quality: 92,
      returnType: "file"
    },
    optimization: {
      mode: "balanced",
      stripMetadata: true,
      compressionLevel: 7,
      progressive: true
    },
    background: {
      color: "#10131a",
      imagePath: null
    },
    panel: {
      color: "#171d29",
      opacity: 0.92,
      borderColor: accentColor,
      borderWidth: index % 3 === 0 ? 2 : 0,
      ...layout.panel
    },
    accentColor,
    thumbnail: {
      path: null,
      ...layout.thumbnail
    },
    progress: {
      enabled: true,
      progress: 0.5,
      backgroundColor: "#2a3448",
      fillColor: accentColor,
      ...layout.progress
    },
    text: {
      title: {
        value: "Nome da música",
        color: "#ffffff",
        maxChars: 28,
        shadow: { enabled: true },
        ...layout.title
      },
      artist: {
        value: "Autor / Artista",
        color: accentColor,
        ...layout.artist
      },
      duration: {
        value: "00:00 / 03:45",
        color: "#d8e0ef",
        ...layout.duration
      },
      footer: {
        value: "tmxcards music",
        color: "#97a5bf",
        ...layout.footer
      }
    }
  };
}

module.exports = layouts.map((layout, index) => {
  return createPreset(index + 1, accents[index], layout);
});
