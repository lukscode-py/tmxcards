const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("rank/personal", {
    name: "Lucas",
    level: 12,
    xp: {
      current: 340,
      total: 1000
    },
    footer: "Faltam 660 XP para o próximo level",
    output: {
      format: "svg",
      outputPath: "./out/dark-minimal-xp-rank.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
