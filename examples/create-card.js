const { createCard, renderCard, listCards, getCardInfo } = require("../src");

async function main() {
  console.log("Cards disponíveis:");
  console.log(listCards().map((card) => `${card.id} (${card.category})`).join("\n"));

  console.log("\nInfo welcome/dark:");
  console.log(getCardInfo("welcome/dark"));

  const welcome = createCard("welcome/dark", {
    name: "Lucas",
    group: "TMX Cards",
    main: "Entrou no grupo",
    output: {
      format: "svg",
      outputPath: "./out/create-card-welcome-dark.svg",
      returnType: "file"
    }
  });

  const rank = createCard("rank/personal", {
    name: "Lucas",
    level: 12,
    xp: {
      current: 340,
      total: 1000
    },
    output: {
      format: "svg",
      outputPath: "./out/create-card-rank-personal.svg",
      returnType: "file"
    }
  });

  const music = createCard("music/player", {
    title: "Minha música",
    subtitle: "Artista",
    output: {
      format: "svg",
      outputPath: "./out/create-card-music-player.svg",
      returnType: "file"
    }
  });

  const moderation = createCard("moderation/ban", {
    name: "Usuário",
    group: "Grupo",
    title: "Banimento aplicado",
    main: "Removido por violar as regras",
    output: {
      format: "svg",
      outputPath: "./out/create-card-ban.svg",
      returnType: "file"
    }
  });

  for (const card of [welcome, rank, music, moderation]) {
    console.log(JSON.stringify(await renderCard(card), null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
