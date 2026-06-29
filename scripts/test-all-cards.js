const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const {
  createWelcomeCard,
  createGoodbyeCard,
  createMusicCard,
  renderCard,
  createSvg,
  presets
} = require("../src");

const imagePath = path.resolve("tmp/exemplo.png");
const outputDir = path.resolve("out/test-all");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getMediaOverride(family, preset) {
  if (family === "music") {
    if (preset.thumbnail?.enabled === false) {
      return {
        thumbnail: {
          enabled: false
        }
      };
    }

    return {
      thumbnail: {
        enabled: true,
        path: imagePath
      }
    };
  }

  if (preset.avatar?.enabled === false) {
    return {
      avatar: {
        enabled: false
      }
    };
  }

  return {
    avatar: {
      enabled: true,
      path: imagePath
    }
  };
}

function getFactory(family) {
  if (family === "welcome") return createWelcomeCard;
  if (family === "goodbye") return createGoodbyeCard;
  if (family === "music") return createMusicCard;
  throw new Error(`Família inválida: ${family}`);
}

function getTextOverride(family, index) {
  if (family === "music") {
    return {
      title: {
        value: `Música teste ${index}`,
        color: "#ffffff",
        shadow: {
          enabled: true
        }
      },
      artist: {
        value: "lukscode-py"
      },
      duration: {
        value: "01:23 / 04:56"
      },
      footer: {
        value: `music preset ${index}`
      }
    };
  }

  if (family === "goodbye") {
    return {
      title: {
        value: `Até logo ${index}`,
        color: "#ffffff",
        shadow: {
          enabled: true
        }
      },
      subtitle: {
        value: "Saiu do grupo"
      },
      message: {
        value: "Card goodbye personalizado com foto.",
        maxChars: 42
      },
      footer: {
        value: `goodbye preset ${index}`
      }
    };
  }

  return {
    title: {
      value: `Bem-vindo ${index}`,
      color: "#ffffff",
      shadow: {
        enabled: true
      }
    },
    subtitle: {
      value: "Entrou no grupo"
    },
    message: {
      value: "Card welcome personalizado com foto.",
      maxChars: 42
    },
    footer: {
      value: `welcome preset ${index}`
    }
  };
}

async function renderPresetFamily(family) {
  const factory = getFactory(family);
  const list = presets[family];
  const results = [];

  assert(Array.isArray(list), `Presets ausentes para ${family}.`);
  assert(list.length === 10, `Esperado 10 presets em ${family}, recebido ${list.length}.`);

  for (let index = 0; index < list.length; index += 1) {
    const preset = list[index];
    const number = String(index + 1).padStart(2, "0");
    const format = index % 2 === 0 ? "png" : "jpeg";
    const extension = format === "jpeg" ? "jpg" : format;
    const outputPath = path.join(outputDir, family, `${preset.id}.${extension}`);

    const card = factory({
      variant: preset.id,
      background: {
        color: index % 2 === 0 ? "#0f172a" : "#111827"
      },
      panel: {
        opacity: 0.9
      },
      progress: family === "music"
        ? {
            progress: 0.15 + index * 0.08
          }
        : undefined,
      ...getMediaOverride(family, preset),
      text: getTextOverride(family, number),
      output: {
        format,
        quality: 88,
        outputPath,
        returnType: "file"
      }
    });

    const svg = createSvg(card);
    assert(svg.includes("<svg"), `${family}/${preset.id} não gerou SVG.`);

    if (preset.avatar?.enabled !== false && preset.thumbnail?.enabled !== false) {
      assert(svg.includes("data:image/"), `${family}/${preset.id} não embutiu tmp/exemplo.png.`);
    }

    const result = await renderCard(card);
    assert(result.ok, `${family}/${preset.id} não retornou ok.`);
    assert(result.bytes > 0, `${family}/${preset.id} gerou arquivo vazio.`);

    results.push({
      family,
      id: preset.id,
      format,
      path: result.path,
      bytes: result.bytes
    });
  }

  return results;
}

async function renderCustomCases() {
  const cases = [
    {
      name: "welcome-custom-svg",
      card: createWelcomeCard({
        variant: "welcome-07",
        width: 900,
        height: 360,
        background: {
          color: "#050816"
        },
        panel: {
          color: "#111827",
          opacity: 0.82,
          borderColor: "#8b5cf6",
          borderWidth: 3
        },
        avatar: {
          enabled: true,
          path: imagePath,
          borderColor: "#8b5cf6",
          borderWidth: 6
        },
        text: {
          title: {
            value: "Welcome SVG personalizado",
            color: "#ffffff",
            shadow: {
              enabled: true,
              opacity: 0.65
            }
          },
          subtitle: {
            value: "Usando tmp/exemplo.png"
          },
          message: {
            value: "Teste de avatar, borda, opacidade, cor e SVG direto.",
            maxChars: 44
          }
        },
        output: {
          format: "svg",
          outputPath: path.join(outputDir, "custom", "welcome-custom.svg"),
          returnType: "file"
        }
      })
    },
    {
      name: "goodbye-custom-png",
      card: createGoodbyeCard({
        variant: "goodbye-04",
        background: {
          color: "#130f1f"
        },
        avatar: {
          enabled: true,
          path: imagePath,
          borderColor: "#ef4444",
          borderWidth: 6
        },
        text: {
          title: {
            value: "Goodbye personalizado"
          },
          subtitle: {
            value: "Foto de perfil aplicada"
          },
          message: {
            value: "Teste de template goodbye com imagem local.",
            maxChars: 42
          }
        },
        output: {
          format: "png",
          outputPath: path.join(outputDir, "custom", "goodbye-custom.png"),
          returnType: "file"
        }
      })
    },
    {
      name: "music-custom-jpeg",
      card: createMusicCard({
        variant: "music-05",
        background: {
          color: "#07111f"
        },
        thumbnail: {
          enabled: true,
          path: imagePath,
          borderColor: "#06b6d4",
          borderWidth: 4
        },
        progress: {
          progress: 0.74,
          fillColor: "#06b6d4"
        },
        text: {
          title: {
            value: "Music player personalizado"
          },
          artist: {
            value: "thumbnail via tmp/exemplo.png"
          },
          duration: {
            value: "02:44 / 03:31"
          }
        },
        output: {
          format: "jpeg",
          quality: 90,
          outputPath: path.join(outputDir, "custom", "music-custom.jpg"),
          returnType: "file"
        }
      })
    }
  ];

  const results = [];

  for (const item of cases) {
    const result = await renderCard(item.card);
    assert(result.ok, `${item.name} falhou.`);
    assert(result.bytes > 0, `${item.name} gerou saída vazia.`);
    results.push({
      name: item.name,
      format: result.format,
      path: result.path,
      bytes: result.bytes
    });
  }

  return results;
}

async function renderReturnTypes() {
  const baseCard = createWelcomeCard({
    variant: "welcome-01",
    width: 360,
    height: 144,
    avatar: {
      enabled: true,
      path: imagePath
    },
    text: {
      title: {
        value: "Return types",
        x: 128,
        y: 48,
        size: 22
      },
      subtitle: {
        value: "buffer/base64",
        x: 130,
        y: 82,
        size: 15
      },
      message: {
        enabled: false
      },
      footer: {
        enabled: false
      }
    }
  });

  const bufferResult = await renderCard({
    ...baseCard,
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  assert(bufferResult.ok, "bufferResult não retornou ok.");
  assert(Buffer.isBuffer(bufferResult.buffer), "returnType buffer não retornou Buffer.");
  assert(bufferResult.bytes > 0, "bufferResult vazio.");

  const base64Result = await renderCard({
    ...baseCard,
    output: {
      format: "svg",
      returnType: "base64"
    }
  });

  assert(base64Result.ok, "base64Result não retornou ok.");
  assert(typeof base64Result.base64 === "string", "returnType base64 não retornou string.");
  assert(base64Result.base64.length > 0, "base64Result vazio.");

  return {
    buffer: {
      format: bufferResult.format,
      bytes: bufferResult.bytes
    },
    base64: {
      format: base64Result.format,
      bytes: base64Result.bytes
    }
  };
}

async function main() {
  assert(fs.existsSync(imagePath), `Imagem de teste não encontrada: ${imagePath}`);

  await fsp.rm(outputDir, {
    recursive: true,
    force: true
  });

  await fsp.mkdir(outputDir, {
    recursive: true
  });

  const all = [];
  all.push(...await renderPresetFamily("welcome"));
  all.push(...await renderPresetFamily("goodbye"));
  all.push(...await renderPresetFamily("music"));

  const custom = await renderCustomCases();
  const returnTypes = await renderReturnTypes();

  const manifest = {
    ok: true,
    imagePath,
    outputDir,
    totals: {
      presetCards: all.length,
      customCards: custom.length,
      files: all.length + custom.length
    },
    returnTypes,
    presets: all,
    custom
  };

  await fsp.writeFile(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(JSON.stringify({
    ok: true,
    imagePath,
    outputDir,
    presetCards: all.length,
    customCards: custom.length,
    returnTypes,
    manifest: path.join(outputDir, "manifest.json")
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
