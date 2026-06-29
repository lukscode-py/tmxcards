const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("goodbye/midnight", {
    name: "Lucas",
    group: "TMX Cards",
    title: "Membro saiu",
    output: {
      format: "svg",
      outputPath: "./out/goodbye-midnight-focus.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
