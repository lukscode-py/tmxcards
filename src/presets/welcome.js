const {
  getPalette,
  createBackground,
  createPanel,
  createMedia,
  createText,
  createDecorations
} = require("../core/style-system");

const layouts = [
  {
    panel: { x: 24, y: 24, width: 752, height: 272, radius: 30 },
    avatar: { enabled: true, x: 48, y: 72, size: 160, shape: "circle" },
    title: { x: 248, y: 82, size: 34 },
    subtitle: { x: 250, y: 130, size: 20 },
    message: { x: 250, y: 172, size: 18, maxChars: 40 },
    footer: { x: 250, y: 238, size: 15 }
  },
  {
    panel: { x: 42, y: 40, width: 716, height: 240, radius: 36 },
    avatar: { enabled: true, x: 588, y: 82, size: 138, shape: "circle" },
    title: { x: 76, y: 86, size: 36 },
    subtitle: { x: 78, y: 136, size: 20 },
    message: { x: 78, y: 178, size: 18, maxChars: 44 },
    footer: { x: 78, y: 236, size: 15 }
  },
  {
    panel: { x: 0, y: 0, width: 800, height: 320, radius: 0 },
    avatar: { enabled: false },
    title: { x: 56, y: 82, size: 42 },
    subtitle: { x: 58, y: 142, size: 22 },
    message: { x: 58, y: 190, size: 19, maxChars: 54 },
    footer: { x: 58, y: 262, size: 15 }
  },
  {
    panel: { x: 34, y: 42, width: 732, height: 236, radius: 22 },
    avatar: { enabled: true, x: 72, y: 82, size: 150, shape: "circle" },
    title: { x: 260, y: 84, size: 34 },
    subtitle: { x: 262, y: 132, size: 20 },
    message: { x: 262, y: 176, size: 18, maxChars: 40 },
    footer: { x: 262, y: 232, size: 15 }
  },
  {
    panel: { x: 82, y: 38, width: 636, height: 244, radius: 38 },
    avatar: { enabled: true, x: 332, y: 54, size: 126, shape: "circle" },
    title: { x: 138, y: 184, size: 32 },
    subtitle: { x: 138, y: 136, size: 19 },
    message: { x: 138, y: 226, size: 16, maxChars: 44 },
    footer: { x: 566, y: 252, size: 14 }
  },
  {
    panel: { x: 38, y: 36, width: 724, height: 248, radius: 18 },
    avatar: { enabled: false },
    title: { x: 64, y: 92, size: 44 },
    subtitle: { x: 66, y: 154, size: 21 },
    message: { x: 66, y: 198, size: 18, maxChars: 56 },
    footer: { x: 620, y: 252, size: 15 }
  },
  {
    panel: { x: 24, y: 24, width: 752, height: 272, radius: 46 },
    avatar: { enabled: true, x: 52, y: 56, size: 184, shape: "circle" },
    title: { x: 270, y: 70, size: 38 },
    subtitle: { x: 272, y: 124, size: 20 },
    message: { x: 272, y: 168, size: 18, maxChars: 42 },
    footer: { x: 272, y: 242, size: 15 }
  },
  {
    panel: { x: 48, y: 54, width: 704, height: 212, radius: 28 },
    avatar: { enabled: true, x: 618, y: 94, size: 108, shape: "circle" },
    title: { x: 78, y: 92, size: 34 },
    subtitle: { x: 80, y: 140, size: 20 },
    message: { x: 80, y: 182, size: 18, maxChars: 44 },
    footer: { x: 80, y: 230, size: 15 }
  },
  {
    panel: { x: 98, y: 30, width: 604, height: 260, radius: 34 },
    avatar: { enabled: true, x: 334, y: 52, size: 128, shape: "circle" },
    title: { x: 154, y: 188, size: 32 },
    subtitle: { x: 154, y: 142, size: 20 },
    message: { x: 154, y: 232, size: 17, maxChars: 44 },
    footer: { x: 560, y: 254, size: 14 }
  },
  {
    panel: { x: 22, y: 50, width: 756, height: 220, radius: 18 },
    avatar: { enabled: false },
    title: { x: 48, y: 92, size: 40 },
    subtitle: { x: 50, y: 150, size: 21 },
    message: { x: 50, y: 194, size: 18, maxChars: 60 },
    footer: { x: 624, y: 232, size: 15 }
  },
  {
    panel: { enabled: false, x: 0, y: 0, width: 800, height: 320, radius: 0 },
    avatar: { enabled: true, x: 290, y: 20, size: 220, shape: "circle", borderWidth: 0 },
    title: { x: 400, y: 266, size: 34, anchor: "middle", letterSpacing: 1 },
    subtitle: { x: 400, y: 306, size: 20, anchor: "middle" },
    message: { enabled: false, x: 0, y: 0, size: 0 },
    footer: { x: 780, y: 298, size: 20, anchor: "end", letterSpacing: 1 }
  }
];

function createPreset(index, layout) {
  const theme = getPalette(index);
  const id = `welcome-${String(index).padStart(2, "0")}`;

  if (index === 11) {
    return {
      id,
      kind: "welcome",
      theme: "center-stage",
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
        color: "#0b1020",
        imagePath: null
      },
      decorations: [],
      panel: {
        enabled: false
      },
      accentColor: "#ffffff",
      logo: {
        enabled: false,
        path: null,
        x: 22,
        y: 16,
        width: 90,
        height: 64,
        radius: 0
      },
      avatar: {
        enabled: true,
        path: null,
        x: 290,
        y: 20,
        size: 220,
        shape: "circle",
        borderWidth: 0
      },
      text: {
        title: {
          value: "BEM-VINDO [A]",
          x: 400,
          y: 266,
          size: 34,
          anchor: "middle",
          color: "#ffffff",
          weight: 800,
          letterSpacing: 1,
          shadow: {
            enabled: true,
            opacity: 0.65
          }
        },
        subtitle: {
          value: "Nome do membro",
          x: 400,
          y: 304,
          size: 20,
          anchor: "middle",
          color: "#f3f4f6"
        },
        message: {
          enabled: false
        },
        footer: {
          value: "#SEUGRUPO",
          x: 780,
          y: 298,
          size: 20,
          anchor: "end",
          color: "#ffffff",
          weight: 800,
          letterSpacing: 1,
          shadow: {
            enabled: true,
            opacity: 0.65
          }
        },
        brand: {
          value: "SEU LOGO / MARCA",
          x: 28,
          y: 40,
          size: 18,
          color: "#ffffff",
          weight: 700,
          shadow: {
            enabled: true,
            opacity: 0.5
          }
        }
      }
    };
  }

  return {
    id,
    kind: "welcome",
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
    avatar: createMedia(layout.avatar, theme),
    text: createText(theme, layout, {
      title: "Bem-vindo(a)!",
      subtitle: "Novo membro entrou",
      message: "Aproveite o grupo e leia as regras.",
      footer: theme.style === "simple" ? "tmxcards" : `${theme.name} • tmxcards`
    })
  };
}

module.exports = layouts.map((layout, index) => {
  return createPreset(index + 1, layout);
});
