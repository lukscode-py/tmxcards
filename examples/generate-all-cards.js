const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createCard, renderCard, listCards } = require("../src");

const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, "examples", "generated");
const PROFILE_IMAGE = "examples/assets/tmxcards-profile.png";
const MUSIC_IMAGE = "examples/assets/tmxcards-music-cover.png";
const RANK_IMAGE = "examples/assets/tmxcards-rank-avatar.png";

const now = new Date();
const dateTime = now.toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "medium"
});

const placeholders = {
  name: "Lucas",
  group: "Grupo do tmxcards",
  profile: PROFILE_IMAGE,
  musicImage: MUSIC_IMAGE,
  rankImage: RANK_IMAGE,
  admin: "Lukscode-py",
  dateTime,
  musicDuration: "5:00"
};

function safeId(id) {
  return String(id).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeExampleJs(filePath, id, configFileName = "./config.json") {
  fs.writeFileSync(filePath, `const config = require("${configFileName}");
const { createCard, renderCard } = require("../../../../src");

async function main() {
  const card = createCard(${JSON.stringify(id)}, config);
  const result = await renderCard(card);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`);
}

function commonOutput(category, slug) {
  const base = `examples/generated/${category}/${slug}`;

  return {
    format: "svg",
    outputPath: `${base}/card.svg`,
    returnType: "file"
  };
}

function baseMemberConfig(id, category, slug) {
  const isGoodbye = category === "goodbye";

  return {
    name: placeholders.name,
    group: placeholders.group,
    title: isGoodbye ? "Até logo" : "Bem-vindo",
    subtitle: isGoodbye ? "Membro saiu" : "Novo membro",
    main: isGoodbye ? "Saiu do grupo." : "Entrou no grupo.",
    footer: placeholders.dateTime,
    avatar: {
      imagePath: placeholders.profile
    },
    output: commonOutput(category, slug)
  };
}

function configForCard(info) {
  const slug = safeId(info.id);

  if (info.category === "welcome" || info.category === "goodbye") {
    return baseMemberConfig(info.id, info.category, slug);
  }

  if (info.id === "rank/personal") {
    return {
      name: placeholders.name,
      group: placeholders.group,
      level: 12,
      xp: {
        current: 340,
        total: 1000
      },
      footer: "Faltam 660 XP para o próximo level.",
      avatar: {
        imagePath: placeholders.profile
      },
      output: commonOutput(info.category, slug)
    };
  }

  if (info.id === "rank/list") {
    return {
      title: "Top Ranking",
      subtitle: `Atualizado em ${placeholders.dateTime}`,
      items: [
        { name: "Lucas", description: placeholders.group, sub: "Top 1", value: "100", progress: 100, icon: "1", imagePath: placeholders.rankImage },
        { name: "Lukscode-py", description: "Admin", sub: "Top 2", value: "90", progress: 90, icon: "2", imagePath: placeholders.rankImage },
        { name: "TMX Cards", description: "Sistema", sub: "Top 3", value: "80", progress: 80, icon: "3", imagePath: placeholders.rankImage }
      ],
      stats: [
        { label: "TOTAL", value: "3" },
        { label: "DATA", value: placeholders.dateTime }
      ],
      output: commonOutput(info.category, slug)
    };
  }

  if (info.category === "music") {
    return {
      title: "Música do tmxcards",
      subtitle: placeholders.name,
      footer: placeholders.musicDuration,
      cover: {
        path: placeholders.musicImage
      },
      music: {
        title: "Música do tmxcards",
        artist: placeholders.name,
        duration: placeholders.musicDuration,
        cover: {
          path: placeholders.musicImage
        },
        thumbnail: {
          path: placeholders.musicImage
        }
      },
      output: commonOutput(info.category, slug)
    };
  }

  if (info.id === "moderation/ban") {
    return {
      name: placeholders.name,
      group: placeholders.group,
      title: "Banimento aplicado",
      subtitle: "Ação de moderação",
      main: "Removido por violar as regras.",
      footer: placeholders.dateTime,
      moderator: placeholders.admin,
      avatar: {
        imagePath: placeholders.profile
      },
      moderation: {
        admin: placeholders.admin,
        dateTime: placeholders.dateTime
      },
      output: commonOutput(info.category, slug)
    };
  }

  if (info.id === "moderation/rank-change") {
    return {
      name: placeholders.name,
      group: placeholders.group,
      title: "Cargo atualizado",
      subtitle: "Alteração de rank",
      main: "O cargo do usuário foi atualizado.",
      footer: placeholders.dateTime,
      oldRole: "Membro",
      newRole: "Admin",
      moderator: placeholders.admin,
      avatar: {
        imagePath: placeholders.profile
      },
      moderation: {
        admin: placeholders.admin,
        dateTime: placeholders.dateTime
      },
      output: commonOutput(info.category, slug)
    };
  }

  return {
    name: placeholders.name,
    group: placeholders.group,
    avatar: {
      imagePath: placeholders.profile
    },
    output: commonOutput(info.category, slug)
  };
}

function dynamicExamples() {
  return [
    {
      id: "custom/canvas-simple",
      category: "custom",
      slug: "custom-canvas-simple",
      config: {
        mode: "canvas",
        width: 760,
        height: 300,
        radius: 28,
        background: {
          startColor: "#030303",
          endColor: "#18181B",
          overlayOpacity: 0.12,
          pattern: "grid"
        },
        theme: {
          accentColor: "#A855F7",
          accentEndColor: "#22D3EE"
        },
        elements: [
          {
            type: "glass",
            x: 24,
            y: 24,
            width: 712,
            height: 252,
            radius: 24
          },
          {
            type: "avatar",
            x: 52,
            y: 78,
            size: 96,
            imagePath: placeholders.profile
          },
          {
            type: "text",
            x: 180,
            y: 96,
            text: "Canvas simples",
            fontSize: 34,
            fontWeight: 900,
            fill: "#FFFFFF"
          },
          {
            type: "text",
            x: 180,
            y: 136,
            text: "Exemplo sem template fixo.",
            fontSize: 18,
            fontWeight: 700,
            fill: "#D4D4D8"
          },
          {
            type: "progress",
            x: 180,
            y: 196,
            width: 430,
            value: 65,
            max: 100,
            label: "Personalização"
          }
        ],
        output: {
          format: "svg",
          outputPath: "examples/generated/custom/custom-canvas-simple/card.svg",
          returnType: "file"
        }
      }
    },
    {
      id: "custom/profile-simple",
      category: "custom",
      slug: "custom-profile-simple",
      config: {
        mode: "profile",
        title: "Profile simples",
        subtitle: "Auto layout",
        name: placeholders.name,
        group: placeholders.group,
        main: "Exemplo dinâmico simples e estável.",
        footer: placeholders.dateTime,
        avatar: {
          imagePath: placeholders.profile
        },
        output: {
          format: "svg",
          outputPath: "examples/generated/custom/custom-profile-simple/card.svg",
          returnType: "file"
        }
      }
    }
  ];
}

function convertSvgToPng(svgPath, pngPath, width, height) {
  const result = spawnSync("rsvg-convert", [
    "-w",
    String(width),
    "-h",
    String(height),
    "-o",
    pngPath,
    svgPath
  ], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`Falha ao converter ${svgPath} para PNG`);
  }
}

async function generateOne(entry) {
  const category = entry.category;
  const slug = entry.slug || safeId(entry.id);
  const dir = path.join(GENERATED_DIR, category, slug);

  ensureDir(dir);

  const configPath = path.join(dir, "config.json");
  const examplePath = path.join(dir, "example.js");
  const infoPath = path.join(dir, "info.json");
  const svgPath = path.join(dir, "card.svg");
  const pngPath = path.join(dir, "card.png");

  const config = entry.config || configForCard(entry);

  config.output = {
    ...(config.output || {}),
    format: "svg",
    outputPath: path.relative(ROOT, svgPath),
    returnType: "file"
  };

  writeJson(configPath, config);
  writeExampleJs(examplePath, entry.id, "./config.json");

  const card = createCard(entry.id, config);
  const result = await renderCard(card);

  if (!result.ok) {
    throw new Error(`Render falhou: ${entry.id}`);
  }

  const width = Number(result.width || card.width || config.width || 900);
  const height = Number(result.height || card.height || config.height || 360);

  convertSvgToPng(svgPath, pngPath, width, height);

  const info = {
    id: entry.id,
    category,
    slug,
    svg: path.relative(ROOT, svgPath),
    png: path.relative(ROOT, pngPath),
    config: path.relative(ROOT, configPath),
    example: path.relative(ROOT, examplePath),
    width,
    height,
    bytes: result.bytes
  };

  writeJson(infoPath, info);

  console.log(`OK ${entry.id} -> ${info.png}`);

  return info;
}

async function main() {
  ensureDir(GENERATED_DIR);

  const registered = listCards().map((card) => ({
    ...card,
    slug: safeId(card.id)
  }));

  const entries = [
    ...registered,
    ...dynamicExamples()
  ];

  const generated = [];

  for (const entry of entries) {
    generated.push(await generateOne(entry));
  }

  const index = {
    generatedAt: placeholders.dateTime,
    placeholders,
    total: generated.length,
    categories: generated.reduce((acc, item) => {
      acc[item.category] ||= [];
      acc[item.category].push(item);
      return acc;
    }, {})
  };

  writeJson(path.join(GENERATED_DIR, "index.json"), index);

  console.log(`\nGerados ${generated.length} exemplos em examples/generated`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
