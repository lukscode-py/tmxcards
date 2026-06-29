const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("custom/neon-dashboard", {
    mode: "canvas",
    width: 980,
    height: 420,
    radius: 38,

    background: {
      startColor: "#030303",
      endColor: "#18181B",
      overlayOpacity: 0.18,
      pattern: "stars"
    },

    theme: {
      accentColor: "#A855F7",
      accentEndColor: "#22D3EE",
      primaryColor: "#FFFFFF",
      secondaryColor: "#E5E7EB",
      mutedColor: "#A1A1AA",
      fontFamily: "Inter, Arial, sans-serif"
    },

    elements: [
      {
        type: "glass",
        x: 28,
        y: 28,
        width: 924,
        height: 364,
        radius: 32
      },
      {
        type: "avatar",
        x: 64,
        y: 88,
        size: 116,
        text: "K"
      },
      {
        type: "text",
        x: 214,
        y: 92,
        text: "PAINEL PREMIUM",
        fontSize: 18,
        fontWeight: 900,
        fill: "url(#dynamicAccentGradient)",
        letterSpacing: 2
      },
      {
        type: "text",
        x: 214,
        y: 142,
        text: "Kanna Bot",
        fontSize: 46,
        fontWeight: 900,
        fill: "#FFFFFF"
      },
      {
        type: "text",
        x: 214,
        y: 186,
        text: "Card dinâmico criado por ID inexistente.",
        fontSize: 20,
        fontWeight: 700,
        fill: "#E5E7EB"
      },
      {
        type: "text",
        x: 214,
        y: 220,
        text: "Parecido com criador de SVG: você controla cada elemento.",
        fontSize: 17,
        fontWeight: 600,
        fill: "#A1A1AA",
        maxWidth: 520
      },
      {
        type: "progress",
        x: 214,
        y: 306,
        width: 548,
        value: 76,
        max: 100,
        label: "Personalização"
      },
      {
        type: "glass",
        x: 694,
        y: 76,
        width: 210,
        height: 84,
        radius: 24
      },
      {
        type: "text",
        x: 724,
        y: 112,
        text: "Complexo",
        fontSize: 25,
        fontWeight: 900,
        fill: "#FFFFFF"
      },
      {
        type: "text",
        x: 724,
        y: 142,
        text: "com elementos livres",
        fontSize: 15,
        fontWeight: 700,
        fill: "#A1A1AA"
      },
      {
        type: "table",
        x: 696,
        y: 220,
        columns: ["ITEM", "VALOR"],
        rows: [
          ["Cards", "14"],
          ["API", "V1"],
          ["Modo", "Canvas"]
        ],
        colWidth: 92,
        rowHeight: 34
      }
    ],

    output: {
      format: "svg",
      outputPath: "./out/dynamic-card.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
