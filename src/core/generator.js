const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const merge = require("../utils/merge");
const { resolveMagickCommand } = require("./imagemagick");

const execFileAsync = promisify(execFile);

const DEFAULT_CARD = {
  width: 800,
  height: 320,
  background: {
    color: "#10131a",
    imagePath: null,
    blur: 0
  },
  output: {
    format: "png",
    quality: 92,
    returnType: "file",
    outputPath: null,
    overwrite: true
  },
  optimization: {
    stripMetadata: true,
    compressionLevel: 7,
    progressive: true
  }
};

const RETURN_TYPES = new Set(["file", "buffer", "base64"]);

function exists(filePath) {
  return typeof filePath === "string" && filePath.length > 0 && fs.existsSync(filePath);
}

function normalizeFormat(format) {
  const value = String(format || "png").trim().toLowerCase();
  return value === "jpg" ? "jpeg" : value;
}

function getExtension(format) {
  return format === "jpeg" ? "jpg" : format;
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function colorWithOpacity(color, opacity = 1) {
  const value = String(color || "#000000").trim();
  const safeOpacity = clamp(opacity, 0, 1);

  if (!value.startsWith("#")) {
    return value;
  }

  let hex = value.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    return value;
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${safeOpacity})`;
}

function createTempName(tmpDir, label, extension = "png") {
  const id = crypto.randomBytes(8).toString("hex");
  return path.join(tmpDir, `${label}-${id}.${extension}`);
}

async function runMagick(args) {
  const command = resolveMagickCommand();

  try {
    await execFileAsync(command, args, {
      maxBuffer: 1024 * 1024 * 20
    });
  } catch (error) {
    const detail = [error.stderr, error.stdout, error.message].filter(Boolean).join("\n");
    throw new Error(`ImageMagick falhou.\nComando: ${command} ${args.join(" ")}\n${detail}`);
  }
}

function addPanel(args, panel) {
  if (!panel || panel.enabled === false) return;

  const x = toNumber(panel.x, 0);
  const y = toNumber(panel.y, 0);
  const width = toNumber(panel.width, 0);
  const height = toNumber(panel.height, 0);
  const radius = toNumber(panel.radius, 0);

  if (width <= 0 || height <= 0) return;

  args.push(
    "-fill",
    colorWithOpacity(panel.color || "#000000", panel.opacity ?? 1),
    "-stroke",
    panel.borderColor || "none",
    "-strokewidth",
    String(toNumber(panel.borderWidth, 0)),
    "-draw",
    `roundrectangle ${x},${y} ${x + width},${y + height} ${radius},${radius}`
  );
}

function addProgress(args, progress) {
  if (!progress || progress.enabled === false) return;

  const x = toNumber(progress.x, 0);
  const y = toNumber(progress.y, 0);
  const width = toNumber(progress.width, 0);
  const height = toNumber(progress.height, 0);
  const radius = toNumber(progress.radius, height / 2);
  const amount = clamp(progress.progress ?? 0, 0, 1);
  const filledWidth = Math.round(width * amount);

  if (width <= 0 || height <= 0) return;

  args.push(
    "-fill",
    progress.backgroundColor || "#222831",
    "-stroke",
    "none",
    "-draw",
    `roundrectangle ${x},${y} ${x + width},${y + height} ${radius},${radius}`
  );

  if (filledWidth > 0) {
    args.push(
      "-fill",
      progress.fillColor || "#3b82f6",
      "-draw",
      `roundrectangle ${x},${y} ${x + filledWidth},${y + height} ${radius},${radius}`
    );
  }
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

function addTexts(args, textConfig) {
  const entries = normalizeTextEntries(textConfig).filter((entry) => {
    return entry && entry.enabled !== false && entry.value !== undefined && entry.value !== null;
  });

  for (const entry of entries) {
    const x = toNumber(entry.x, 0);
    const y = toNumber(entry.y, 0);
    const size = toNumber(entry.size, 18);
    const lineHeight = toNumber(entry.lineHeight, Math.round(size * 1.25));
    const lines = wrapText(entry.value, toNumber(entry.maxChars, 0));

    if (entry.font) {
      args.push("-font", entry.font);
    }

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const lineY = y + lineIndex * lineHeight;

      if (entry.shadow && entry.shadow.enabled !== false) {
        args.push(
          "-fill",
          entry.shadow.color || "#000000",
          "-pointsize",
          String(size),
          "-gravity",
          entry.gravity || "northwest",
          "-annotate",
          `+${x + toNumber(entry.shadow.x, 2)}+${lineY + toNumber(entry.shadow.y, 2)}`,
          line
        );
      }

      args.push(
        "-fill",
        entry.color || "#ffffff",
        "-pointsize",
        String(size),
        "-gravity",
        entry.gravity || "northwest",
        "-annotate",
        `+${x}+${lineY}`,
        line
      );
    }
  }
}

async function createBase(card, tmpDir) {
  const width = toNumber(card.width, DEFAULT_CARD.width);
  const height = toNumber(card.height, DEFAULT_CARD.height);
  const output = createTempName(tmpDir, "base");
  const background = card.background || {};
  const args = [];

  if (exists(background.imagePath)) {
    args.push(
      background.imagePath,
      "-auto-orient",
      "-resize",
      `${width}x${height}^`,
      "-gravity",
      "center",
      "-extent",
      `${width}x${height}`
    );

    if (toNumber(background.blur, 0) > 0) {
      args.push("-blur", `0x${toNumber(background.blur, 0)}`);
    }
  } else {
    args.push("-size", `${width}x${height}`, `xc:${background.color || "#10131a"}`);
  }

  addPanel(args, card.panel);
  addProgress(args, card.progress);
  addTexts(args, card.text);

  args.push(output);
  await runMagick(args);
  return output;
}

async function compositeMedia(basePath, media, tmpDir, label) {
  if (!media || media.enabled === false || !exists(media.path)) return basePath;

  const x = toNumber(media.x, 0);
  const y = toNumber(media.y, 0);
  const width = toNumber(media.width || media.size, 160);
  const height = toNumber(media.height || media.size, width);
  const resized = createTempName(tmpDir, `${label}-resized`);
  const output = createTempName(tmpDir, `${label}-composite`);

  await runMagick([
    media.path,
    "-auto-orient",
    "-resize",
    `${width}x${height}^`,
    "-gravity",
    "center",
    "-extent",
    `${width}x${height}`,
    resized
  ]);

  await runMagick([
    basePath,
    resized,
    "-geometry",
    `+${x}+${y}`,
    "-composite",
    output
  ]);

  return output;
}

async function writeOutput(inputPath, card, tmpDir) {
  const outputConfig = card.output || {};
  const optimization = card.optimization || {};
  const format = normalizeFormat(outputConfig.format);
  const extension = getExtension(format);
  const returnType = outputConfig.returnType || "file";

  if (!RETURN_TYPES.has(returnType)) {
    throw new Error(`returnType inválido: ${returnType}. Use file, buffer ou base64.`);
  }

  const targetPath = outputConfig.outputPath
    ? path.resolve(outputConfig.outputPath)
    : path.resolve(process.cwd(), "out", `tmxcards-${Date.now()}.${extension}`);

  const finalPath = returnType === "file"
    ? targetPath
    : createTempName(tmpDir, "output", extension);

  if (returnType === "file" && exists(finalPath) && outputConfig.overwrite === false) {
    throw new Error(`Arquivo já existe e overwrite=false: ${finalPath}`);
  }

  await fsp.mkdir(path.dirname(finalPath), { recursive: true });

  const args = [inputPath];

  if (optimization.stripMetadata !== false) {
    args.push("-strip");
  }

  if (format === "png" && optimization.compressionLevel !== undefined) {
    args.push("-define", `png:compression-level=${clamp(optimization.compressionLevel, 0, 9)}`);
  }

  if (format === "jpeg" && optimization.progressive !== false) {
    args.push("-interlace", "Plane");
  }

  if (outputConfig.quality !== undefined) {
    args.push("-quality", String(clamp(outputConfig.quality, 1, 100)));
  }

  args.push(`${format}:${finalPath}`);
  await runMagick(args);

  if (returnType === "file") {
    const stat = await fsp.stat(finalPath);

    return {
      ok: true,
      returnType,
      path: finalPath,
      format,
      width: card.width,
      height: card.height,
      bytes: stat.size
    };
  }

  const buffer = await fsp.readFile(finalPath);

  if (returnType === "base64") {
    return {
      ok: true,
      returnType,
      format,
      mime: `image/${format}`,
      base64: buffer.toString("base64"),
      bytes: buffer.length
    };
  }

  return {
    ok: true,
    returnType,
    format,
    buffer,
    bytes: buffer.length
  };
}

async function renderCard(config = {}, options = {}) {
  const card = merge(merge(DEFAULT_CARD, config), options);
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "tmxcards-"));

  try {
    let current = await createBase(card, tmpDir);
    current = await compositeMedia(current, card.avatar, tmpDir, "avatar");
    current = await compositeMedia(current, card.thumbnail, tmpDir, "thumbnail");
    return await writeOutput(current, card, tmpDir);
  } finally {
    if (!card.output || card.output.keepTemp !== true) {
      await fsp.rm(tmpDir, { recursive: true, force: true });
    }
  }
}

module.exports = {
  renderCard
};
