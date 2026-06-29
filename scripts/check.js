const {
  parseCsvInput,
  renderCard,
  createSvg,
  createWelcomeCard,
  presets,
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

  if (!presets || presets.welcome.length !== 11 || presets.goodbye.length !== 11 || presets.music.length !== 11) {
    throw new Error("Presets esperados: 11 welcome, 11 goodbye e 11 music.");
  }

  const rows = parseCsvInput("name,group\nLucas,Grupo Oficial\n", {
    fromFile: false
  });

  if (rows.length !== 1 || rows[0].name !== "Lucas") {
    throw new Error("parseCsvInput falhou ao ler CSV em memória.");
  }

  const card = createWelcomeCard({
    width: 320,
    height: 128,
    avatar: {
      enabled: false
    },
    panel: {
      x: 8,
      y: 8,
      width: 304,
      height: 112,
      radius: 14
    },
    text: {
      title: {
        value: "tmxcards check",
        x: 24,
        y: 30,
        size: 22
      },
      subtitle: {
        value: "render ok",
        x: 24,
        y: 66,
        size: 16
      },
      message: {
        enabled: false
      },
      footer: {
        enabled: false
      }
    },
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  const svg = createSvg(card);

  if (!svg.includes("<svg") || !svg.includes("tmxcards check")) {
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
    throw new Error("renderCard não retornou buffer válido.");
  }

  console.log(JSON.stringify({
    ok: true,
    magick,
    presets: {
      welcome: presets.welcome.length,
      goodbye: presets.goodbye.length,
      music: presets.music.length
    },
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
