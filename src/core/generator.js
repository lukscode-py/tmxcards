const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const merge = require("../utils/merge");
const { resolveRsvgCommand } = require("./rsvg");
const { createSvg } = require("./svg");
const { createCustomSvg } = require("./custom-templates");

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
    returnType: "file",
    outputPath: null,
    overwrite: true
  }
};

const RETURN_TYPES = new Set(["file", "buffer", "base64"]);
const SUPPORTED_FORMATS = new Set(["svg", "png"]);

function exists(filePath) {
  return typeof filePath === "string" && filePath.length > 0 && fs.existsSync(filePath);
}

function normalizeFormat(format) {
  return String(format || "png").trim().toLowerCase();
}

function assertSupportedFormat(format) {
  if (SUPPORTED_FORMATS.has(format)) return;

  throw new Error(
    `Formato não suportado pelo renderer atual: ${format}. ` +
    `Use "svg" ou "png". PNG é convertido com rsvg-convert.`
  );
}

function getExtension(format) {
  if (format === "svg") return "svg";
  if (format === "png") return "png";
  return format;
}

function getMime(format) {
  if (format === "svg") return "image/svg+xml";
  if (format === "png") return "image/png";
  return "application/octet-stream";
}

function toPositiveInteger(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.max(1, Math.round(number));
}

function createTempName(tmpDir, label, extension = "tmp") {
  const id = crypto.randomBytes(8).toString("hex");
  return path.join(tmpDir, `${label}-${id}.${extension}`);
}

async function runRsvg(args) {
  const command = resolveRsvgCommand();

  try {
    await execFileAsync(command, args, {
      maxBuffer: 1024 * 1024 * 20
    });
  } catch (error) {
    const detail = [error.stderr, error.stdout, error.message].filter(Boolean).join("\n");
    throw new Error(`rsvg-convert falhou.\nComando: ${command} ${args.join(" ")}\n${detail}`);
  }
}

function resolveOutputPath(outputConfig, format) {
  const extension = getExtension(format);

  if (outputConfig.outputPath) {
    return path.resolve(outputConfig.outputPath);
  }

  if (outputConfig.path) {
    return path.resolve(outputConfig.path);
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

async function outputConvertedFile(finalPath, card, format) {
  const outputConfig = card.output || {};
  const returnType = outputConfig.returnType || "file";

  if (!RETURN_TYPES.has(returnType)) {
    throw new Error(`returnType inválido: ${returnType}. Use file, buffer ou base64.`);
  }

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

async function convertSvgToPng(svgPath, card, tmpDir) {
  const outputConfig = card.output || {};
  const returnType = outputConfig.returnType || "file";
  const finalPath = returnType === "file"
    ? resolveOutputPath(outputConfig, "png")
    : createTempName(tmpDir, "output", "png");

  if (returnType === "file" && exists(finalPath) && outputConfig.overwrite === false) {
    throw new Error(`Arquivo já existe e overwrite=false: ${finalPath}`);
  }

  await fsp.mkdir(path.dirname(finalPath), { recursive: true });

  const args = [
    "-u",
    "-f",
    "png",
    "-w",
    String(toPositiveInteger(card.width, 800)),
    "-h",
    String(toPositiveInteger(card.height, 320)),
    "-o",
    finalPath,
    svgPath
  ];

  if (outputConfig.backgroundColor) {
    args.splice(1, 0, "-b", String(outputConfig.backgroundColor));
  }

  await runRsvg(args);

  return outputConvertedFile(finalPath, card, "png");
}

async function renderCard(config = {}, options = {}) {
  const card = merge(merge(DEFAULT_CARD, config), options);
  const outputConfig = card.output || {};
  const format = normalizeFormat(outputConfig.format);

  assertSupportedFormat(format);

  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "tmxcards-"));

  try {
    const svg = createCustomSvg(card) || createSvg(card);

    if (format === "svg") {
      return await outputRawContent(svg, card, format);
    }

    const svgPath = createTempName(tmpDir, "input", "svg");
    await fsp.writeFile(svgPath, svg);

    return await convertSvgToPng(svgPath, card, tmpDir);
  } finally {
    if (!card.output || card.output.keepTemp !== true) {
      await fsp.rm(tmpDir, { recursive: true, force: true });
    }
  }
}

module.exports = {
  renderCard
};
