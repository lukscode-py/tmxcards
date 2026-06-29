const welcomePresets = require("./welcome");

module.exports = welcomePresets.map((preset) => {
  const number = preset.id.split("-")[1];

  return {
    ...preset,
    id: `goodbye-${number}`,
    kind: "goodbye",
    text: {
      ...preset.text,
      title: {
        ...preset.text.title,
        value: "Até logo!"
      },
      subtitle: {
        ...preset.text.subtitle,
        value: "Um membro saiu",
        color: preset.accentColor
      },
      message: {
        ...preset.text.message,
        value: "Volte quando quiser. Obrigado por ter participado."
      }
    }
  };
});
