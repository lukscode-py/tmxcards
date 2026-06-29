const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("moderation/ban", {
    name: "Lucas",
    group: "TMX Cards",
    title: "Banimento aplicado",
    subtitle: "Ação de moderação",
    main: "Removido por violar as regras",
    footer: "Sistema de segurança",
    moderator: "Admin",
    output: {
      format: "svg",
      outputPath: "./out/crimson-authority-ban.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
