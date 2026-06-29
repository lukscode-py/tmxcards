const { execFileSync } = require("node:child_process");

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
  if (commandWorks("magick")) {
    return "magick";
  }

  if (commandWorks("convert")) {
    return "convert";
  }

  throw new Error(
    "ImageMagick não encontrado. Instale o ImageMagick e garanta que 'magick' ou 'convert' esteja disponível no PATH."
  );
}

function getSupportedFormats() {
  const command = resolveMagickCommand();
  const output = execFileSync(command, ["-list", "format"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("-") && !line.startsWith("Format"))
    .map((line) => line.split(/\s+/)[0])
    .filter(Boolean);
}

module.exports = {
  resolveMagickCommand,
  getSupportedFormats
};
