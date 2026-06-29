const { createMusicCard, renderCard } = require("../src");

(async () => {
  const card = createMusicCard({
    variant: "music-01",
    thumbnail: {
      enabled: false
    },
    progress: {
      progress: 0.42
    },
    text: {
      title: {
        value: "Night Ride",
        maxChars: 28,
        shadow: {
          enabled: true
        }
      },
      artist: {
        value: "lukscode-py"
      },
      duration: {
        value: "01:12 / 03:45"
      }
    },
    output: {
      format: "jpeg",
      quality: 88,
      outputPath: "./out/music-card.jpg",
      returnType: "file"
    }
  });

  const result = await renderCard(card);
  console.log(JSON.stringify(result, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
