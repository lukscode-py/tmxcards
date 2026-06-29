const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("goodbye/dark", {
    name: "Lucas",
    group: "TMX Cards",
    main: "Saiu do grupo",
    output: {
      format: "svg",
      outputPath: "./out/dark-minimal-farewell.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
