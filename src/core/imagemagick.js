const { execFileSync } = require("node:child_process");

let cachedMagickCommand = null;
let cachedSupportedFormats = null;
let cachedRendererInfo = null;

function commandWorks(command, args = ["-version"]) {
  try {
    execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return true;
  } catch {
    return false;
  }
}

function resolveMagickCommand() {
  if (cachedMagickCommand) {
    return cachedMagickCommand;
  }

  if (commandWorks("magick")) {
    cachedMagickCommand = "magick";
    return cachedMagickCommand;
  }

  if (commandWorks("convert")) {
    cachedMagickCommand = "convert";
    return cachedMagickCommand;
  }

  throw new Error(
    "ImageMagick não encontrado. Instale o ImageMagick e garanta que 'magick' ou 'convert' esteja disponível no PATH."
  );
}

function getSupportedFormats() {
  if (cachedSupportedFormats) {
    return [...cachedSupportedFormats];
  }

  const command = resolveMagickCommand();
  const output = execFileSync(command, ["-list", "format"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  cachedSupportedFormats = output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("-") && !line.startsWith("Format"))
    .map((line) => line.split(/\s+/)[0])
    .filter(Boolean);

  return [...cachedSupportedFormats];
}

function getRendererInfo() {
  if (cachedRendererInfo) {
    return { ...cachedRendererInfo };
  }

  try {
    const command = resolveMagickCommand();

    cachedRendererInfo = {
      svg: true,
      png: true,
      jpeg: true,
      webp: true,
      raster: true,
      command,
      platform: process.platform
    };
  } catch (error) {
    cachedRendererInfo = {
      svg: true,
      png: false,
      jpeg: false,
      webp: false,
      raster: false,
      command: null,
      platform: process.platform,
      error: error.message
    };
  }

  return { ...cachedRendererInfo };
}

module.exports = {
  resolveMagickCommand,
  getSupportedFormats,
  getRendererInfo
};
