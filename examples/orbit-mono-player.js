const { createCard, renderCard } = require("../src");

async function main() {
  const card = createCard("music/orbit", {
    title: "Minha música",
    subtitle: "Artista",
    footer: "03:20",
    output: {
      format: "svg",
      outputPath: "./out/orbit-mono-player.svg",
      returnType: "file"
    }
  });

  console.log(JSON.stringify(await renderCard(card), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
