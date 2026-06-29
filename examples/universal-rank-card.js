const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("rank/list", {
    title: "Top Rank",
    subtitle: "Ranking geral",
    items: [
      { name: "Lucas", description: "Primeiro lugar", sub: "Hoje", value: "100", progress: 100, icon: "1" },
      { name: "Maria", description: "Segundo lugar", sub: "Hoje", value: "90", progress: 90, icon: "2" },
      { name: "Pedro", description: "Terceiro lugar", sub: "Hoje", value: "80", progress: 80, icon: "3" }
    ],
    stats: [
      { label: "TOTAL", value: "3" }
    ],
    output: {
      format: "svg",
      outputPath: "./out/universal-rank-card.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
