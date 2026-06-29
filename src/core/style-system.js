const palettes = [
  {
    name: "midnight-violet",
    mode: "dark",
    background: "#09090f",
    panel: "#17111f",
    panelOpacity: 0.94,
    accent: "#8b5cf6",
    accent2: "#ec4899",
    title: "#ffffff",
    subtitle: "#c4b5fd",
    body: "#e5e7eb",
    muted: "#a1a1aa",
    borderWidth: 2,
    style: "premium"
  },
  {
    name: "clean-light",
    mode: "light",
    background: "#f8fafc",
    panel: "#ffffff",
    panelOpacity: 1,
    accent: "#2563eb",
    accent2: "#06b6d4",
    title: "#0f172a",
    subtitle: "#2563eb",
    body: "#334155",
    muted: "#64748b",
    borderWidth: 1,
    style: "simple"
  },
  {
    name: "mint-light",
    mode: "light",
    background: "#ecfdf5",
    panel: "#ffffff",
    panelOpacity: 0.98,
    accent: "#059669",
    accent2: "#14b8a6",
    title: "#064e3b",
    subtitle: "#047857",
    body: "#065f46",
    muted: "#64748b",
    borderWidth: 1,
    style: "soft"
  },
  {
    name: "sunset",
    mode: "color",
    background: "#fff7ed",
    panel: "#ffedd5",
    panelOpacity: 0.98,
    accent: "#f97316",
    accent2: "#ef4444",
    title: "#431407",
    subtitle: "#c2410c",
    body: "#7c2d12",
    muted: "#9a3412",
    borderWidth: 1,
    style: "warm"
  },
  {
    name: "ruby-dark",
    mode: "dark",
    background: "#16070a",
    panel: "#240b12",
    panelOpacity: 0.94,
    accent: "#ef4444",
    accent2: "#fb7185",
    title: "#fff1f2",
    subtitle: "#fda4af",
    body: "#ffe4e6",
    muted: "#fecdd3",
    borderWidth: 2,
    style: "bold"
  },
  {
    name: "zinc-minimal",
    mode: "dark",
    background: "#18181b",
    panel: "#27272a",
    panelOpacity: 1,
    accent: "#e4e4e7",
    accent2: "#a1a1aa",
    title: "#fafafa",
    subtitle: "#d4d4d8",
    body: "#e4e4e7",
    muted: "#a1a1aa",
    borderWidth: 0,
    style: "simple"
  },
  {
    name: "cyan-glow",
    mode: "dark",
    background: "#06131f",
    panel: "#0f2233",
    panelOpacity: 0.94,
    accent: "#06b6d4",
    accent2: "#38bdf8",
    title: "#ecfeff",
    subtitle: "#67e8f9",
    body: "#cffafe",
    muted: "#a5f3fc",
    borderWidth: 2,
    style: "premium"
  },
  {
    name: "rose-light",
    mode: "light",
    background: "#fff1f2",
    panel: "#ffffff",
    panelOpacity: 0.98,
    accent: "#e11d48",
    accent2: "#fb7185",
    title: "#4c0519",
    subtitle: "#be123c",
    body: "#881337",
    muted: "#9f1239",
    borderWidth: 1,
    style: "soft"
  },
  {
    name: "emerald-dark",
    mode: "dark",
    background: "#02130f",
    panel: "#05251d",
    panelOpacity: 0.94,
    accent: "#10b981",
    accent2: "#84cc16",
    title: "#ecfdf5",
    subtitle: "#6ee7b7",
    body: "#d1fae5",
    muted: "#a7f3d0",
    borderWidth: 2,
    style: "premium"
  },
  {
    name: "paper-classic",
    mode: "light",
    background: "#f5f5f4",
    panel: "#ffffff",
    panelOpacity: 1,
    accent: "#57534e",
    accent2: "#a8a29e",
    title: "#1c1917",
    subtitle: "#57534e",
    body: "#44403c",
    muted: "#78716c",
    borderWidth: 1,
    style: "simple"
  }
];

function getPalette(index) {
  return palettes[(index - 1) % palettes.length];
}

function createBackground(theme) {
  return {
    color: theme.background,
    imagePath: null
  };
}

function createPanel(theme, layoutPanel, index) {
  return {
    color: theme.panel,
    opacity: theme.panelOpacity,
    borderColor: theme.accent,
    borderWidth: theme.borderWidth,
    ...layoutPanel,
    radius: layoutPanel.radius
  };
}

function createMedia(media, theme, extra = {}) {
  return {
    path: null,
    borderColor: theme.accent,
    borderWidth: media?.enabled === false ? 0 : 5,
    ...media,
    ...extra
  };
}

function createText(theme, layout, values = {}) {
  return {
    title: {
      value: values.title || "Título",
      color: theme.title,
      shadow: theme.mode === "dark" ? { enabled: true, opacity: 0.5 } : { enabled: false },
      ...layout.title
    },
    subtitle: {
      value: values.subtitle || "Subtítulo",
      color: theme.subtitle,
      ...layout.subtitle
    },
    message: {
      value: values.message || "Mensagem do card.",
      color: theme.body,
      ...layout.message
    },
    footer: {
      value: values.footer || "tmxcards",
      color: theme.muted,
      ...layout.footer
    }
  };
}

function createMusicText(theme, layout, values = {}) {
  return {
    title: {
      value: values.title || "Nome da música",
      color: theme.title,
      maxChars: 28,
      shadow: theme.mode === "dark" ? { enabled: true, opacity: 0.5 } : { enabled: false },
      ...layout.title
    },
    artist: {
      value: values.artist || "Autor / Artista",
      color: theme.subtitle,
      ...layout.artist
    },
    duration: {
      value: values.duration || "00:00 / 03:45",
      color: theme.body,
      ...layout.duration
    },
    footer: {
      value: values.footer || "tmxcards music",
      color: theme.muted,
      ...layout.footer
    }
  };
}

function createDecorations(theme, index) {
  if (theme.style === "simple") {
    return [
      {
        type: "rect",
        x: 0,
        y: 0,
        width: 800,
        height: 8,
        radius: 0,
        color: theme.accent,
        opacity: 0.9
      }
    ];
  }

  if (theme.mode === "light") {
    return [
      {
        type: "circle",
        cx: 720,
        cy: 45,
        r: 92,
        color: theme.accent,
        opacity: 0.12
      },
      {
        type: "circle",
        cx: 90,
        cy: 285,
        r: 84,
        color: theme.accent2,
        opacity: 0.12
      },
      {
        type: "rect",
        x: 620,
        y: 244,
        width: 128,
        height: 16,
        radius: 8,
        color: theme.accent,
        opacity: 0.22
      }
    ];
  }

  return [
    {
      type: "circle",
      cx: 690,
      cy: 35,
      r: 110,
      color: theme.accent,
      opacity: 0.2
    },
    {
      type: "circle",
      cx: 95,
      cy: 295,
      r: 120,
      color: theme.accent2,
      opacity: 0.16
    },
    {
      type: "rect",
      x: 540,
      y: 260,
      width: 190,
      height: 18,
      radius: 9,
      color: theme.accent,
      opacity: 0.22
    },
    {
      type: "rect",
      x: 585,
      y: 232,
      width: 112,
      height: 10,
      radius: 5,
      color: theme.accent2,
      opacity: 0.22
    }
  ];
}

module.exports = {
  palettes,
  getPalette,
  createBackground,
  createPanel,
  createMedia,
  createText,
  createMusicText,
  createDecorations
};
