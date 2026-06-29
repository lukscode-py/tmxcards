const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("welcome/premium", {
    name: "Lucas",
    group: "TMX Cards",
    title: "Bem-vindo",
    main: "Entrou no grupo",
    output: {
      format: "svg",
      outputPath: "./out/welcome-premium-01.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
