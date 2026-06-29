const {
  renderCard,
  createSvg,
  resolveMagickCommand
} = require("../src");

async function main() {
  const magick = resolveMagickCommand();

  if (typeof renderCard !== "function") {
    throw new Error("renderCard não foi exportado corretamente.");
  }

  if (typeof createSvg !== "function") {
    throw new Error("createSvg não foi exportado corretamente.");
  }

  const card = {
    width: 420,
    height: 180,
    background: {
      color: "#10131a"
    },
    panel: {
      enabled: true,
      x: 16,
      y: 16,
      width: 388,
      height: 148,
      radius: 18,
      color: "#171d29",
      opacity: 0.92
    },
    text: {
      title: {
        value: "tmxcards core",
        x: 36,
        y: 54,
        size: 28,
        color: "#ffffff"
      },
      subtitle: {
        value: "sem templates antigos",
        x: 38,
        y: 94,
        size: 18,
        color: "#cbd5e1"
      }
    },
    output: {
      format: "png",
      returnType: "buffer"
    }
  };

  const svg = createSvg(card);

  if (!svg.includes("<svg") || !svg.includes("tmxcards core")) {
    throw new Error("createSvg não gerou SVG válido.");
  }

  const svgRendered = await renderCard({
    ...card,
    output: {
      format: "svg",
      returnType: "buffer"
    }
  });

  if (!svgRendered.ok || svgRendered.format !== "svg" || !svgRendered.buffer.toString("utf8").includes("<svg")) {
    throw new Error("renderCard não retornou SVG válido.");
  }

  const rendered = await renderCard(card);

  if (!rendered.ok || rendered.returnType !== "buffer" || !Buffer.isBuffer(rendered.buffer) || rendered.bytes <= 0) {
    throw new Error("renderCard não retornou buffer PNG válido.");
  }

  console.log(JSON.stringify({
    ok: true,
    magick,
    templates: 0,
    render: {
      format: rendered.format,
      bytes: rendered.bytes
    },
    svg: {
      bytes: svgRendered.bytes
    }
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
