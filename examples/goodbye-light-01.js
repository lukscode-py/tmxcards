const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("goodbye/light", {
    name: "Lucas",
    group: "TMX Cards",
    title: "Até logo",
    main: "Saiu do grupo",
    output: {
      format: "svg",
      outputPath: "./out/goodbye-light-01.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
