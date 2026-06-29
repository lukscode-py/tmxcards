const {
  createWelcomeCard,
  createMusicCard,
  renderCardsFromCsv
} = require("../src");

(async () => {
  const results = await renderCardsFromCsv({
    csv: "./examples/cards.csv",
    mapRow(row) {
      if (row.type === "music") {
        return createMusicCard({
          variant: row.variant || "music-01",
          thumbnail: {
            enabled: false
          },
          text: {
            title: {
              value: row.title || "Música",
              maxChars: 28
            },
            artist: {
              value: row.artist || "Desconhecido"
            },
            duration: {
              value: row.duration || "00:00 / 00:00"
            }
          },
          output: {
            format: "jpeg",
            quality: 88,
            outputPath: row.output || "./out/music-from-csv.jpg",
            returnType: "file"
          }
        });
      }

      return createWelcomeCard({
        variant: row.variant || "welcome-01",
        avatar: {
          enabled: false
        },
        text: {
          title: {
            value: `Bem-vindo, ${row.name || "membro"}`
          },
          subtitle: {
            value: row.group || "Grupo"
          },
          message: {
            value: "Card gerado via CSV pelo tmxcards."
          }
        },
        output: {
          format: "png",
          outputPath: row.output || "./out/welcome-from-csv.png",
          returnType: "file"
        }
      });
    }
  });

  console.log(JSON.stringify(results, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
