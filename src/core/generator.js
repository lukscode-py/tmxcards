const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const merge = require("../utils/merge");
const { resolveMagickCommand } = require("./imagemagick");
const { createSvg } = require("./svg");

const execFileAsync = promisify(execFile);

const DEFAULT_CARD = {
  width: 800,
  height: 320,
  background: {
    color: "#10131a",
    imagePath: null
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
  if (format === "jpeg") return "jpg";
  if (format === "svg") return "svg";
  return format;
}

function getMime(format) {
  if (format === "svg") return "image/svg+xml";
  if (format === "jpeg") return "image/jpeg";
  return `image/${format}`;
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

function createTempName(tmpDir, label, extension = "tmp") {
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

async function prepareMediaForSvg(media, tmpDir, label) {
  if (!media || media.enabled === false || !exists(media.path)) return media;

  const width = toNumber(media.width || media.size, 160);
  const height = toNumber(media.height || media.size, width);
  const shape = media.shape;
  const radius = toNumber(media.radius, shape === "circle" ? Math.min(width, height) / 2 : 0);

  if (width <= 0 || height <= 0) return media;

  const resized = createTempName(tmpDir, `${label}-resized`, "png");
  const prepared = createTempName(tmpDir, `${label}-prepared`, "png");

  await runMagick([
    media.path,
    "-auto-orient",
    "-resize",
    `${width}x${height}^`,
    "-gravity",
    "center",
    "-extent",
    `${width}x${height}`,
    `PNG32:${resized}`
  ]);

  if (shape !== "circle" && radius <= 0) {
    return {
      ...media,
      width,
      height,
      path: resized,
      __tmxcardsPrepared: true,
      __tmxcardsOriginalShape: shape,
      __tmxcardsOriginalRadius: radius
    };
  }

  const mask = createTempName(tmpDir, `${label}-mask`, "png");

  if (shape === "circle") {
    const cx = Math.round(width / 2);
    const cy = Math.round(height / 2);
    const edgeY = Math.max(0, cy - Math.round(Math.min(width, height) / 2));

    await runMagick([
      "-size",
      `${width}x${height}`,
      "xc:none",
      "-fill",
      "white",
      "-draw",
      `circle ${cx},${cy} ${cx},${edgeY}`,
      `PNG32:${mask}`
    ]);
  } else {
    await runMagick([
      "-size",
      `${width}x${height}`,
      "xc:none",
      "-fill",
      "white",
      "-draw",
      `roundrectangle 0,0 ${width - 1},${height - 1} ${radius},${radius}`,
      `PNG32:${mask}`
    ]);
  }

  await runMagick([
    resized,
    mask,
    "-alpha",
    "Off",
    "-compose",
    "CopyOpacity",
    "-composite",
    `PNG32:${prepared}`
  ]);

  return {
    ...media,
    width,
    height,
    path: prepared,
    __tmxcardsPrepared: true,
    __tmxcardsOriginalShape: shape,
    __tmxcardsOriginalRadius: radius
  };
}

async function prepareCardMedia(card, tmpDir) {
  return {
    ...card,
    avatar: await prepareMediaForSvg(card.avatar, tmpDir, "avatar"),
    thumbnail: await prepareMediaForSvg(card.thumbnail, tmpDir, "thumbnail")
  };
}

function resolveOutputPath(outputConfig, format) {
  const extension = getExtension(format);

  if (outputConfig.outputPath) {
    return path.resolve(outputConfig.outputPath);
  }

  return path.resolve(process.cwd(), "out", `tmxcards-${Date.now()}.${extension}`);
}

async function outputRawContent(content, card, format) {
  const outputConfig = card.output || {};
  const returnType = outputConfig.returnType || "file";
  const buffer = Buffer.from(content);

  if (!RETURN_TYPES.has(returnType)) {
    throw new Error(`returnType inválido: ${returnType}. Use file, buffer ou base64.`);
  }

  if (returnType === "buffer") {
    return {
      ok: true,
      returnType,
      format,
      mime: getMime(format),
      width: card.width,
      height: card.height,
      buffer,
      bytes: buffer.length
    };
  }

  if (returnType === "base64") {
    return {
      ok: true,
      returnType,
      format,
      mime: getMime(format),
      width: card.width,
      height: card.height,
      base64: buffer.toString("base64"),
      bytes: buffer.length
    };
  }

  const finalPath = resolveOutputPath(outputConfig, format);

  if (exists(finalPath) && outputConfig.overwrite === false) {
    throw new Error(`Arquivo já existe e overwrite=false: ${finalPath}`);
  }

  await fsp.mkdir(path.dirname(finalPath), { recursive: true });
  await fsp.writeFile(finalPath, buffer);

  return {
    ok: true,
    returnType,
    path: finalPath,
    format,
    mime: getMime(format),
    width: card.width,
    height: card.height,
    bytes: buffer.length
  };
}

async function convertSvg(svgPath, card, tmpDir, format) {
  const outputConfig = card.output || {};
  const optimization = card.optimization || {};
  const returnType = outputConfig.returnType || "file";

  if (!RETURN_TYPES.has(returnType)) {
    throw new Error(`returnType inválido: ${returnType}. Use file, buffer ou base64.`);
  }

  const finalPath = returnType === "file"
    ? resolveOutputPath(outputConfig, format)
    : createTempName(tmpDir, "output", getExtension(format));

  if (returnType === "file" && exists(finalPath) && outputConfig.overwrite === false) {
    throw new Error(`Arquivo já existe e overwrite=false: ${finalPath}`);
  }

  await fsp.mkdir(path.dirname(finalPath), { recursive: true });

  const args = [svgPath];

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
      mime: getMime(format),
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
      mime: getMime(format),
      width: card.width,
      height: card.height,
      base64: buffer.toString("base64"),
      bytes: buffer.length
    };
  }

  return {
    ok: true,
    returnType,
    format,
    mime: getMime(format),
    width: card.width,
    height: card.height,
    buffer,
    bytes: buffer.length
  };
}

async function renderCard(config = {}, options = {}) {
  const card = merge(merge(DEFAULT_CARD, config), options);
  const outputConfig = card.output || {};
  const format = normalizeFormat(outputConfig.format);
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "tmxcards-"));

  try {
    const svgCard = await prepareCardMedia(card, tmpDir);
    const svg = createSvg(svgCard);

    if (format === "svg") {
      return await outputRawContent(svg, svgCard, format);
    }

    const svgPath = createTempName(tmpDir, "input", "svg");
    await fsp.writeFile(svgPath, svg);
    return await convertSvg(svgPath, svgCard, tmpDir, format);
  } finally {
    if (!card.output || card.output.keepTemp !== true) {
      await fsp.rm(tmpDir, { recursive: true, force: true });
    }
  }
}

module.exports = {
  renderCard
};
