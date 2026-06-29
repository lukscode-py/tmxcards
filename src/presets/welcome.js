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
    avatar: { enabled: true, x: 42, y: 70, size: 165, shape: "circle" },
    title: { x: 245, y: 78, size: 34 },
    subtitle: { x: 247, y: 126, size: 20 },
    message: { x: 247, y: 167, size: 18, maxChars: 42 },
    footer: { x: 247, y: 228, size: 16 }
  },
  {
    panel: { x: 36, y: 34, width: 728, height: 252, radius: 38 },
    avatar: { enabled: true, x: 330, y: 34, size: 128, shape: "circle" },
    title: { x: 70, y: 170, size: 34 },
    subtitle: { x: 70, y: 112, size: 20 },
    message: { x: 70, y: 216, size: 18, maxChars: 58 },
    footer: { x: 610, y: 250, size: 15 }
  },
  {
    panel: { x: 0, y: 0, width: 800, height: 320, radius: 0 },
    avatar: { enabled: false },
    title: { x: 54, y: 72, size: 42 },
    subtitle: { x: 58, y: 132, size: 22 },
    message: { x: 58, y: 182, size: 20, maxChars: 52 },
    footer: { x: 58, y: 258, size: 16 }
  },
  {
    panel: { x: 28, y: 40, width: 744, height: 240, radius: 22 },
    avatar: { enabled: true, x: 590, y: 78, size: 142, shape: "circle" },
    title: { x: 64, y: 86, size: 36 },
    subtitle: { x: 66, y: 136, size: 20 },
    message: { x: 66, y: 178, size: 18, maxChars: 48 },
    footer: { x: 66, y: 232, size: 15 }
  },
  {
    panel: { x: 74, y: 36, width: 652, height: 248, radius: 34 },
    avatar: { enabled: true, x: 94, y: 82, size: 136, shape: "circle" },
    title: { x: 270, y: 86, size: 32 },
    subtitle: { x: 272, y: 132, size: 20 },
    message: { x: 272, y: 172, size: 18, maxChars: 38 },
    footer: { x: 272, y: 232, size: 15 }
  },
  {
    panel: { x: 34, y: 34, width: 732, height: 252, radius: 18 },
    avatar: { enabled: false },
    title: { x: 60, y: 88, size: 44 },
    subtitle: { x: 62, y: 150, size: 21 },
    message: { x: 62, y: 194, size: 19, maxChars: 56 },
    footer: { x: 620, y: 252, size: 15 }
  },
  {
    panel: { x: 22, y: 22, width: 756, height: 276, radius: 44 },
    avatar: { enabled: true, x: 48, y: 52, size: 190, shape: "circle" },
    title: { x: 270, y: 62, size: 38 },
    subtitle: { x: 272, y: 116, size: 20 },
    message: { x: 272, y: 164, size: 18, maxChars: 44 },
    footer: { x: 272, y: 238, size: 15 }
  },
  {
    panel: { x: 42, y: 54, width: 716, height: 212, radius: 28 },
    avatar: { enabled: true, x: 616, y: 96, size: 108, shape: "circle" },
    title: { x: 74, y: 88, size: 34 },
    subtitle: { x: 76, y: 136, size: 20 },
    message: { x: 76, y: 178, size: 18, maxChars: 45 },
    footer: { x: 76, y: 226, size: 15 }
  },
  {
    panel: { x: 96, y: 28, width: 608, height: 264, radius: 34 },
    avatar: { enabled: true, x: 330, y: 52, size: 132, shape: "circle" },
    title: { x: 154, y: 188, size: 32 },
    subtitle: { x: 154, y: 142, size: 20 },
    message: { x: 154, y: 232, size: 17, maxChars: 46 },
    footer: { x: 560, y: 254, size: 14 }
  },
  {
    panel: { x: 18, y: 50, width: 764, height: 220, radius: 20 },
    avatar: { enabled: false },
    title: { x: 46, y: 88, size: 40 },
    subtitle: { x: 50, y: 146, size: 21 },
    message: { x: 50, y: 190, size: 18, maxChars: 60 },
    footer: { x: 622, y: 230, size: 15 }
  }
];

function createPreset(index, accentColor, layout) {
  const id = `welcome-${String(index).padStart(2, "0")}`;

  return {
    id,
    kind: "welcome",
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
    avatar: {
      path: null,
      borderColor: accentColor,
      borderWidth: 5,
      ...layout.avatar
    },
    text: {
      title: {
        value: "Bem-vindo(a)!",
        color: "#ffffff",
        shadow: { enabled: true },
        ...layout.title
      },
      subtitle: {
        value: "Novo membro entrou",
        color: accentColor,
        ...layout.subtitle
      },
      message: {
        value: "Aproveite o grupo e leia as regras.",
        color: "#d8e0ef",
        ...layout.message
      },
      footer: {
        value: "tmxcards",
        color: "#97a5bf",
        ...layout.footer
      }
    }
  };
}

module.exports = layouts.map((layout, index) => {
  return createPreset(index + 1, accents[index], layout);
});
