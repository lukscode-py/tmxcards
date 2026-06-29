const welcomePresets = require("./welcome");

module.exports = welcomePresets.map((preset) => {
  const isCenterStage = preset.theme === "center-stage";
  const number = preset.id.split("-")[1];

  return {
    ...preset,
    id: `goodbye-${number}`,
    kind: "goodbye",
    text: {
      ...preset.text,
      title: {
        ...preset.text.title,
        value: isCenterStage ? "ATÉ LOGO [A]" : "Até logo!"
      },
      subtitle: {
        ...preset.text.subtitle,
        value: isCenterStage ? "Nome do membro" : "Um membro saiu",
        color: preset.accentColor
      },
      message: {
        ...preset.text.message,
        value: isCenterStage
          ? ""
          : "Volte quando quiser. Obrigado por ter participado."
      }
    }
  };
});
