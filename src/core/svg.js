const fs = require("node:fs");
const path = require("node:path");

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function exists(filePath) {
  return typeof filePath === "string" && filePath.length > 0 && fs.existsSync(filePath);
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeXml(value).replaceAll('"', "&quot;");
}

function mimeFromPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";

  return "application/octet-stream";
}

function fileToDataUri(filePath) {
  const buffer = fs.readFileSync(filePath);
  return `data:${mimeFromPath(filePath)};base64,${buffer.toString("base64")}`;
}

function normalizeTextEntries(textConfig) {
  if (!textConfig) return [];
  if (Array.isArray(textConfig)) return textConfig;

  return Object.entries(textConfig).map(([name, value]) => ({
    name,
    ...value
  }));
}

function wrapText(value, maxChars) {
  const rawLines = String(value ?? "").split(/\r?\n/);

  if (!maxChars || maxChars <= 0) return rawLines;

  const lines = [];

  for (const rawLine of rawLines) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;

      if (candidate.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function svgAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(" ");
}

function rect(attrs) {
  return `<rect ${svgAttrs(attrs)} />`;
}

function circle(attrs) {
  return `<circle ${svgAttrs(attrs)} />`;
}

function image(attrs) {
  return `<image ${svgAttrs(attrs)} />`;
}

function text(attrs, value) {
  return `<text ${svgAttrs(attrs)}>${escapeXml(value)}</text>`;
}

function addBackground(parts, card) {
  const width = toNumber(card.width, 800);
  const height = toNumber(card.height, 320);
  const background = card.background || {};

  if (exists(background.imagePath)) {
    parts.body.push(image({
      href: fileToDataUri(background.imagePath),
      x: 0,
      y: 0,
      width,
      height,
      preserveAspectRatio: "xMidYMid slice"
    }));
    return;
  }

  parts.body.push(rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: background.color || "#10131a"
  }));
}

function addPanel(parts, panel) {
  if (!panel || panel.enabled === false) return;

  const x = toNumber(panel.x, 0);
  const y = toNumber(panel.y, 0);
  const width = toNumber(panel.width, 0);
  const height = toNumber(panel.height, 0);
  const radius = toNumber(panel.radius, 0);

  if (width <= 0 || height <= 0) return;

  parts.body.push(rect({
    x,
    y,
    width,
    height,
    rx: radius,
    ry: radius,
    fill: panel.color || "#000000",
    "fill-opacity": clamp(panel.opacity ?? 1, 0, 1),
    stroke: panel.borderColor || "none",
    "stroke-width": toNumber(panel.borderWidth, 0)
  }));
}

function addProgress(parts, progress) {
  if (!progress || progress.enabled === false) return;

  const x = toNumber(progress.x, 0);
  const y = toNumber(progress.y, 0);
  const width = toNumber(progress.width, 0);
  const height = toNumber(progress.height, 0);
  const radius = toNumber(progress.radius, height / 2);
  const amount = clamp(progress.progress ?? 0, 0, 1);
  const filledWidth = Math.round(width * amount);

  if (width <= 0 || height <= 0) return;

  parts.body.push(rect({
    x,
    y,
    width,
    height,
    rx: radius,
    ry: radius,
    fill: progress.backgroundColor || "#222831"
  }));

  if (filledWidth > 0) {
    parts.body.push(rect({
      x,
      y,
      width: filledWidth,
      height,
      rx: radius,
      ry: radius,
      fill: progress.fillColor || "#3b82f6"
    }));
  }
}

function addDecorations(parts, decorations) {
  if (!Array.isArray(decorations)) return;

  for (const item of decorations) {
    if (!item || item.enabled === false) continue;

    if (item.type === "circle") {
      parts.body.push(circle({
        cx: toNumber(item.cx, 0),
        cy: toNumber(item.cy, 0),
        r: toNumber(item.r, 0),
        fill: item.color || "#ffffff",
        "fill-opacity": clamp(item.opacity ?? 1, 0, 1)
      }));
      continue;
    }

    if (item.type === "rect") {
      const radius = toNumber(item.radius, 0);

      parts.body.push(rect({
        x: toNumber(item.x, 0),
        y: toNumber(item.y, 0),
        width: toNumber(item.width, 0),
        height: toNumber(item.height, 0),
        rx: radius,
        ry: radius,
        fill: item.color || "#ffffff",
        "fill-opacity": clamp(item.opacity ?? 1, 0, 1)
      }));
    }
  }
}

function addMedia(parts, media, label) {
  if (!media || media.enabled === false || !exists(media.path)) return;

  const x = toNumber(media.x, 0);
  const y = toNumber(media.y, 0);
  const width = toNumber(media.width || media.size, 160);
  const height = toNumber(media.height || media.size, width);
  const radius = toNumber(media.radius, media.shape === "circle" ? width / 2 : 0);
  const clipId = `${label}-clip-${parts.nextId()}`;

  if (width <= 0 || height <= 0) return;

  if (media.__tmxcardsPrepared === true) {
    const originalShape = media.__tmxcardsOriginalShape || media.shape;
    const originalRadius = toNumber(media.__tmxcardsOriginalRadius, radius);

    parts.body.push(image({
      href: fileToDataUri(media.path),
      x,
      y,
      width,
      height,
      preserveAspectRatio: "none"
    }));

    if (toNumber(media.borderWidth, 0) > 0) {
      if (originalShape === "circle") {
        const cx = x + width / 2;
        const cy = y + height / 2;
        const r = Math.min(width, height) / 2;

        parts.body.push(circle({
          cx,
          cy,
          r: r - toNumber(media.borderWidth, 0) / 2,
          fill: "none",
          stroke: media.borderColor || "#ffffff",
          "stroke-width": toNumber(media.borderWidth, 0)
        }));
      } else {
        parts.body.push(rect({
          x,
          y,
          width,
          height,
          rx: originalRadius,
          ry: originalRadius,
          fill: "none",
          stroke: media.borderColor || "#ffffff",
          "stroke-width": toNumber(media.borderWidth, 0)
        }));
      }
    }

    return;
  }

  if (media.shape === "circle") {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const r = Math.min(width, height) / 2;

    parts.defs.push(`<clipPath id="${clipId}">${circle({ cx, cy, r })}</clipPath>`);
    parts.body.push(image({
      href: fileToDataUri(media.path),
      x,
      y,
      width,
      height,
      preserveAspectRatio: "xMidYMid slice",
      "clip-path": `url(#${clipId})`
    }));

    if (toNumber(media.borderWidth, 0) > 0) {
      parts.body.push(circle({
        cx,
        cy,
        r: r - toNumber(media.borderWidth, 0) / 2,
        fill: "none",
        stroke: media.borderColor || "#ffffff",
        "stroke-width": toNumber(media.borderWidth, 0)
      }));
    }

    return;
  }

  if (radius > 0) {
    parts.defs.push(`<clipPath id="${clipId}">${rect({ x, y, width, height, rx: radius, ry: radius })}</clipPath>`);
  }

  parts.body.push(image({
    href: fileToDataUri(media.path),
    x,
    y,
    width,
    height,
    preserveAspectRatio: "xMidYMid slice",
    "clip-path": radius > 0 ? `url(#${clipId})` : undefined
  }));

  if (toNumber(media.borderWidth, 0) > 0) {
    parts.body.push(rect({
      x,
      y,
      width,
      height,
      rx: radius,
      ry: radius,
      fill: "none",
      stroke: media.borderColor || "#ffffff",
      "stroke-width": toNumber(media.borderWidth, 0)
    }));
  }
}

function addTexts(parts, textConfig) {
  const entries = normalizeTextEntries(textConfig).filter((entry) => {
    return entry && entry.enabled !== false && entry.value !== undefined && entry.value !== null;
  });

  for (const entry of entries) {
    const x = toNumber(entry.x, 0);
    const y = toNumber(entry.y, 0);
    const size = toNumber(entry.size, 18);
    const lineHeight = toNumber(entry.lineHeight, Math.round(size * 1.25));
    const lines = wrapText(entry.value, toNumber(entry.maxChars, 0));
    const fontFamily = entry.fontFamily || entry.font || "Arial, Helvetica, sans-serif";
    const fontWeight = entry.weight || entry.fontWeight || 600;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const lineY = y + lineIndex * lineHeight;

      if (entry.shadow && entry.shadow.enabled !== false) {
        parts.body.push(text({
          x: x + toNumber(entry.shadow.x, 2),
          y: lineY + toNumber(entry.shadow.y, 2),
          fill: entry.shadow.color || "#000000",
          "font-size": size,
          "font-family": fontFamily,
          "font-weight": fontWeight,
          "fill-opacity": clamp(entry.shadow.opacity ?? 0.55, 0, 1),
          "text-anchor": entry.anchor || undefined,
          "letter-spacing": entry.letterSpacing || undefined,
          "font-style": entry.fontStyle || undefined
        }, line));
      }

      parts.body.push(text({
        x,
        y: lineY,
        fill: entry.color || "#ffffff",
        "font-size": size,
        "font-family": fontFamily,
        "font-weight": fontWeight,
        "fill-opacity": clamp(entry.opacity ?? 1, 0, 1),
        "text-anchor": entry.anchor || undefined,
        "letter-spacing": entry.letterSpacing || undefined,
        "font-style": entry.fontStyle || undefined
      }, line));
    }
  }
}

function createParts() {
  let id = 0;

  return {
    defs: [],
    body: [],
    nextId() {
      id += 1;
      return id;
    }
  };
}

function createSvg(config = {}) {
  const width = toNumber(config.width, 800);
  const height = toNumber(config.height, 320);
  const parts = createParts();

  addBackground(parts, config);
  addDecorations(parts, config.decorations);
  addPanel(parts, config.panel);
  addMedia(parts, config.logo, "logo");
  addMedia(parts, config.avatar, "avatar");
  addMedia(parts, config.thumbnail, "thumbnail");
  addProgress(parts, config.progress);
  addTexts(parts, config.text);

  const defs = parts.defs.length > 0 ? `<defs>${parts.defs.join("")}</defs>` : "";

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    defs,
    parts.body.join(""),
    `</svg>`
  ].join("");
}

module.exports = {
  createSvg,
  escapeXml,
  escapeAttr
};
