const {
  getPalette,
  createBackground,
  createPanel,
  createMedia,
  createMusicText,
  createDecorations
} = require("../core/style-system");

const layouts = [
  {
    panel: { x: 24, y: 24, width: 752, height: 272, radius: 30 },
    thumbnail: { enabled: true, x: 52, y: 58, width: 204, height: 204, radius: 24 },
    progress: { x: 290, y: 242, width: 410, height: 10 },
    title: { x: 290, y: 84, size: 30 },
    artist: { x: 292, y: 130, size: 20 },
    duration: { x: 292, y: 176, size: 18 },
    footer: { x: 292, y: 214, size: 16 }
  },
  {
    panel: { x: 42, y: 40, width: 716, height: 240, radius: 36 },
    thumbnail: { enabled: true, x: 574, y: 70, width: 144, height: 144, radius: 26 },
    progress: { x: 78, y: 230, width: 464, height: 12 },
    title: { x: 76, y: 86, size: 34 },
    artist: { x: 78, y: 136, size: 20 },
    duration: { x: 78, y: 184, size: 18 },
    footer: { x: 574, y: 232, size: 15 }
  },
  {
    panel: { x: 0, y: 0, width: 800, height: 320, radius: 0 },
    thumbnail: { enabled: false },
    progress: { x: 58, y: 246, width: 684, height: 14 },
    title: { x: 58, y: 86, size: 44 },
    artist: { x: 60, y: 152, size: 22 },
    duration: { x: 60, y: 198, size: 18 },
    footer: { x: 60, y: 280, size: 15 }
  },
  {
    panel: { x: 34, y: 42, width: 732, height: 236, radius: 22 },
    thumbnail: { enabled: true, x: 62, y: 76, width: 168, height: 168, radius: 20 },
    progress: { x: 270, y: 226, width: 430, height: 10 },
    title: { x: 270, y: 86, size: 32 },
    artist: { x: 272, y: 134, size: 20 },
    duration: { x: 272, y: 178, size: 18 },
    footer: { x: 272, y: 252, size: 15 }
  },
  {
    panel: { x: 82, y: 38, width: 636, height: 244, radius: 38 },
    thumbnail: { enabled: true, x: 98, y: 84, width: 136, height: 136, radius: 68 },
    progress: { x: 270, y: 230, width: 380, height: 10 },
    title: { x: 270, y: 88, size: 32 },
    artist: { x: 272, y: 134, size: 20 },
    duration: { x: 272, y: 176, size: 18 },
    footer: { x: 272, y: 256, size: 15 }
  },
  {
    panel: { x: 38, y: 36, width: 724, height: 248, radius: 18 },
    thumbnail: { enabled: false },
    progress: { x: 64, y: 232, width: 610, height: 12 },
    title: { x: 64, y: 92, size: 42 },
    artist: { x: 66, y: 154, size: 21 },
    duration: { x: 66, y: 196, size: 18 },
    footer: { x: 620, y: 252, size: 15 }
  },
  {
    panel: { x: 24, y: 24, width: 752, height: 272, radius: 46 },
    thumbnail: { enabled: true, x: 52, y: 56, width: 184, height: 184, radius: 30 },
    progress: { x: 272, y: 236, width: 420, height: 12 },
    title: { x: 270, y: 70, size: 36 },
    artist: { x: 272, y: 124, size: 20 },
    duration: { x: 272, y: 168, size: 18 },
    footer: { x: 272, y: 266, size: 15 }
  },
  {
    panel: { x: 48, y: 54, width: 704, height: 212, radius: 28 },
    thumbnail: { enabled: true, x: 618, y: 96, width: 108, height: 108, radius: 20 },
    progress: { x: 80, y: 220, width: 500, height: 10 },
    title: { x: 78, y: 92, size: 34 },
    artist: { x: 80, y: 140, size: 20 },
    duration: { x: 80, y: 182, size: 18 },
    footer: { x: 600, y: 230, size: 15 }
  },
  {
    panel: { x: 98, y: 30, width: 604, height: 260, radius: 34 },
    thumbnail: { enabled: true, x: 334, y: 52, width: 128, height: 128, radius: 64 },
    progress: { x: 154, y: 260, width: 490, height: 10 },
    title: { x: 154, y: 188, size: 30 },
    artist: { x: 154, y: 142, size: 20 },
    duration: { x: 154, y: 232, size: 17 },
    footer: { x: 560, y: 254, size: 14 }
  },
  {
    panel: { x: 22, y: 50, width: 756, height: 220, radius: 18 },
    thumbnail: { enabled: false },
    progress: { x: 50, y: 226, width: 570, height: 12 },
    title: { x: 48, y: 92, size: 40 },
    artist: { x: 50, y: 150, size: 21 },
    duration: { x: 50, y: 192, size: 18 },
    footer: { x: 640, y: 232, size: 15 }
  },
  {
    panel: { x: 108, y: 58, width: 584, height: 206, radius: 36 },
    thumbnail: { enabled: true, x: 130, y: 80, width: 158, height: 158, radius: 28 },
    progress: { x: 334, y: 202, width: 266, height: 10 },
    title: { x: 334, y: 118, size: 30 },
    artist: { x: 372, y: 156, size: 22 },
    duration: { enabled: false, x: 0, y: 0, size: 0 },
    footer: { enabled: false, x: 0, y: 0, size: 0 }
  }
];

function createPreset(index, layout) {
  const theme = getPalette(index);
  const id = `music-${String(index).padStart(2, "0")}`;

  if (index === 11) {
    return {
      id,
      kind: "music",
      theme: "bloom",
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
        color: "#151515",
        imagePath: null
      },
      decorations: [
        {
          type: "rect",
          x: 334,
          y: 136,
          width: 28,
          height: 28,
          radius: 8,
          color: "#000000",
          opacity: 1
        }
      ],
      panel: {
        x: 108,
        y: 58,
        width: 584,
        height: 206,
        radius: 36,
        color: "#f7f7f7",
        opacity: 1,
        borderColor: "none",
        borderWidth: 0
      },
      accentColor: "#000000",
      thumbnail: {
        enabled: true,
        path: null,
        x: 130,
        y: 80,
        width: 158,
        height: 158,
        radius: 28,
        borderWidth: 0
      },
      progress: {
        enabled: true,
        progress: 0.34,
        x: 334,
        y: 202,
        width: 266,
        height: 10,
        backgroundColor: "#dddddd",
        fillColor: "#000000"
      },
      text: {
        title: {
          value: "Blinding Lights",
          x: 334,
          y: 118,
          size: 30,
          color: "#111111",
          weight: 700
        },
        artist: {
          value: "The Weeknd",
          x: 372,
          y: 156,
          size: 22,
          color: "#222222"
        },
        duration: {
          enabled: false
        },
        footer: {
          enabled: false
        },
        explicitBadge: {
          value: "E",
          x: 348,
          y: 156,
          size: 16,
          anchor: "middle",
          color: "#ffffff",
          weight: 800
        },
        timeStart: {
          value: "0:00",
          x: 334,
          y: 242,
          size: 18,
          color: "#222222"
        },
        timeEnd: {
          value: "2:54",
          x: 604,
          y: 242,
          size: 18,
          anchor: "end",
          color: "#222222"
        },
        themeLabel: {
          value: "[theme]",
          x: 32,
          y: 264,
          size: 20,
          color: "#6b7280"
        },
        themeName: {
          value: "bloom",
          x: 32,
          y: 300,
          size: 34,
          color: "#ffffff",
          weight: 800
        }
      }
    };
  }

  return {
    id,
    kind: "music",
    theme: theme.name,
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
    background: createBackground(theme),
    decorations: createDecorations(theme, index),
    panel: createPanel(theme, layout.panel, index),
    accentColor: theme.accent,
    thumbnail: createMedia(layout.thumbnail, theme, {
      borderWidth: layout.thumbnail.enabled === false ? 0 : 4
    }),
    progress: {
      enabled: true,
      progress: 0.5,
      backgroundColor: theme.mode === "light" ? "#e2e8f0" : "#263244",
      fillColor: theme.accent,
      ...layout.progress
    },
    text: createMusicText(theme, layout, {
      title: "Nome da música",
      artist: "Autor / Artista",
      duration: "00:00 / 03:45",
      footer: theme.style === "simple" ? "tmxcards music" : `${theme.name} • music`
    })
  };
}

module.exports = layouts.map((layout, index) => {
  return createPreset(index + 1, layout);
});
