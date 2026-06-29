const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    group: "TMX Cards",
    main: "Entrou no grupo",
    output: {
      format: "svg",
      outputPath: "./out/dark-minimal-welcome.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
