const { createWelcomeCard, renderCard } = require("../src");

(async () => {
  const card = createWelcomeCard({
    variant: "welcome-01",
    avatar: {
      enabled: false
    },
    text: {
      title: {
        value: "Bem-vindo, Lucas",
        shadow: {
          enabled: true
        }
      },
      subtitle: {
        value: "Grupo Oficial"
      },
      message: {
        value: "Leia as regras e aproveite a comunidade.",
        maxChars: 38
      }
    },
    output: {
      format: "png",
      outputPath: "./out/welcome-lucas.png",
      returnType: "file"
    }
  });

  const result = await renderCard(card);
  console.log(JSON.stringify(result, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
