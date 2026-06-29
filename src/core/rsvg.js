const { execFileSync } = require("node:child_process");

let cachedRsvgCommand = null;
let cachedRendererInfo = null;

function commandWorks(command, args = ["--version"]) {
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

function resolveRsvgCommand() {
  if (cachedRsvgCommand) {
    return cachedRsvgCommand;
  }

  if (commandWorks("rsvg-convert")) {
    cachedRsvgCommand = "rsvg-convert";
    return cachedRsvgCommand;
  }

  throw new Error(
    "rsvg-convert não encontrado. Instale librsvg/rsvg-convert e garanta que 'rsvg-convert' esteja disponível no PATH."
  );
}

function getSupportedFormats() {
  return ["svg", "png"];
}

function getRendererInfo() {
  if (cachedRendererInfo) {
    return { ...cachedRendererInfo };
  }

  try {
    const command = resolveRsvgCommand();

    cachedRendererInfo = {
      svg: true,
      png: true,
      jpeg: false,
      webp: false,
      raster: true,
      command,
      engine: "rsvg-convert",
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
      engine: "rsvg-convert",
      platform: process.platform,
      error: error.message
    };
  }

  return { ...cachedRendererInfo };
}

module.exports = {
  resolveRsvgCommand,
  getSupportedFormats,
  getRendererInfo
};
