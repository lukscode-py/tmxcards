const {
  resolveMagickCommand,
  getSupportedFormats,
  createSvg,
  renderCard,
  createCard,
  listCards,
  getCardInfo,
  clearImageCache,
  getImageCacheStats
} = require("../src");

const REQUIRED_PUBLIC_API = [
  "resolveMagickCommand",
  "getSupportedFormats",
  "getRendererInfo",
  "createSvg",
  "renderCard",
  "createCard",
  "listCards",
  "getCardInfo",
  "clearImageCache",
  "getImageCacheStats"
];

const FORBIDDEN_PUBLIC_API = [
  "createWelcomePremium01",
  "createWelcomeLight01",
  "createWelcomeMidnightFocus",
  "createGoodbyePremium01",
  "createGoodbyeLight01",
  "createGoodbyeMidnightFocus",
  "createDarkMinimalWelcome",
  "createDarkMinimalFarewell",
  "createDarkMinimalXpRank",
  "createUniversalRankCard",
  "createMusicMidnightMonoPlayer",
  "createOrbitMonoPlayer",
  "createCrimsonAuthorityBan",
  "createRankShiftNotice"
];

const MINIMAL_CONFIG = {
  "welcome/dark": { name: "Lucas" },
  "welcome/premium": { name: "Lucas" },
  "welcome/light": { name: "Lucas" },
  "welcome/midnight": { name: "Lucas" },

  "goodbye/dark": { name: "Lucas" },
  "goodbye/premium": { name: "Lucas" },
  "goodbye/light": { name: "Lucas" },
  "goodbye/midnight": { name: "Lucas" },

  "rank/personal": { name: "Lucas" },
  "rank/list": {
    items: [
      { name: "Lucas", value: "100", progress: 100, icon: "L" }
    ]
  },

  "music/player": { title: "Minha música" },
  "music/orbit": { title: "Minha música" },

  "moderation/ban": { name: "Lucas" },
  "moderation/rank-change": { name: "Lucas" }
};

const REQUIRED_ERROR_CASES = [
  ["welcome/dark", {}, "name"],
  ["goodbye/dark", {}, "name"],
  ["rank/personal", {}, "name"],
  ["rank/list", {}, "items"],
  ["music/player", {}, "title"],
  ["moderation/ban", {}, "name"]
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function requirePublicApi() {
  const api = require("../src");

  for (const key of REQUIRED_PUBLIC_API) {
    assert(typeof api[key] === "function", `API pública ausente: ${key}`);
  }

  for (const key of FORBIDDEN_PUBLIC_API) {
    assert(api[key] === undefined, `Factory antiga ainda está pública: ${key}`);
  }
}

async function testMinimalCards() {
  const cards = listCards();

  assert(cards.length === 14, `Esperado 14 cards registrados, recebeu ${cards.length}`);

  const results = [];

  for (const info of cards) {
    const config = MINIMAL_CONFIG[info.id];

    assert(config, `Sem config mínima para ${info.id}`);

    const card = createCard(info.id, {
      ...config,
      output: {
        format: "svg",
        returnType: "buffer"
      }
    });

    const result = await renderCard(card);

    assert(result.ok, `Render SVG falhou: ${info.id}`);
    assert(result.bytes > 0, `Render SVG sem bytes: ${info.id}`);

    results.push({
      id: info.id,
      bytes: result.bytes
    });
  }

  return results;
}

function testRequiredErrors() {
  for (const [id, config, expected] of REQUIRED_ERROR_CASES) {
    try {
      createCard(id, config);
      throw new Error(`${id} aceitou config inválida.`);
    } catch (error) {
      assert(
        String(error.message).includes(expected),
        `${id} retornou erro incorreto: ${error.message}`
      );
    }
  }
}

async function testPngRender() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);

  assert(result.ok, "Render PNG falhou.");
  assert(result.bytes > 0, "Render PNG sem bytes.");

  return {
    format: result.format,
    bytes: result.bytes
  };
}

async function testDynamicCard() {
  const card = createCard("custom/neon-panel", {
    title: "Card dinâmico",
    subtitle: "Criado por ID inexistente",
    name: "Lucas",
    main: "Layout automático com tema, elementos, estatísticas e barra.",
    badges: [
      { text: "CUSTOM" },
      { text: "SVG" }
    ],
    stats: [
      { label: "LVL", value: "12" },
      { label: "XP", value: "340" }
    ],
    progress: {
      enabled: true,
      value: 68,
      label: "Progresso"
    },
    output: {
      format: "svg",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);

  assert(result.ok, "Render dinâmico falhou.");
  assert(result.bytes > 0, "Render dinâmico sem bytes.");
  assert(card.template === "dynamic_custom_card", "Card dinâmico não recebeu template correto.");
  assert(card.cardId === "custom/neon-panel", "Card dinâmico não preservou ID custom.");

  return {
    id: card.cardId,
    template: card.template,
    bytes: result.bytes
  };
}

async function main() {
  requirePublicApi();

  const magick = await Promise.resolve(resolveMagickCommand());
  const formats = await Promise.resolve(getSupportedFormats());
  const cards = listCards();

  assert(getCardInfo("welcome/dark")?.id === "welcome/dark", "getCardInfo falhou para welcome/dark");
  assert(getCardInfo("id/inexistente") === null, "getCardInfo deveria retornar null para ID inexistente");

  const svg = createSvg({
    width: 120,
    height: 60,
    elements: [
      {
        type: "text",
        x: 12,
        y: 35,
        text: "OK",
        fill: "#FFFFFF"
      }
    ]
  });

  assert(String(svg).includes("<svg"), "createSvg não gerou SVG.");

  const minimalCards = await testMinimalCards();
  const png = await testPngRender();
  const dynamic = await testDynamicCard();

  testRequiredErrors();

  console.log(JSON.stringify({
    ok: true,
    publicApi: REQUIRED_PUBLIC_API,
    forbiddenFactoriesHidden: true,
    magick,
    formats,
    cards: cards.length,
    minimalCards,
    dynamic,
    png,
    svg: {
      bytes: Buffer.byteLength(String(svg))
    }
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
