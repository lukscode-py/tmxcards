const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("moderation/rank-change", {
    name: "Lucas",
    group: "TMX Cards",
    title: "Cargo atualizado",
    subtitle: "Alteração de rank",
    main: "O cargo do usuário foi atualizado",
    oldRole: "Membro",
    newRole: "Admin",
    moderator: "Dono",
    output: {
      format: "svg",
      outputPath: "./out/rank-shift-notice.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
