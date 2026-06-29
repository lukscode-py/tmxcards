# tmxcards

`tmxcards` é um pacote Node.js para criar cards de imagem de forma simples, leve e flexível, com foco em ambientes limitados como Termux.

## Ideia do projeto

O objetivo principal do pacote é gerar cards usando um fluxo leve baseado em SVG e ImageMagick, sem depender de bibliotecas pesadas como `canvas` ou `sharp`.

Fluxo desejado:

```txt
configuração JS / dados opcionais em CSV
        ↓
template do card
        ↓
SVG gerado internamente
        ↓
ImageMagick converte para PNG/JPEG/WebP
        ↓
arquivo, buffer ou base64
```

Atualmente o pacote já possui renderização funcional via ImageMagick e presets prontos. O próximo passo técnico é separar melhor o motor SVG interno para deixar os layouts mais fáceis de manter e personalizar.

## Por que SVG?

SVG combina bem com cards porque permite descrever o visual de forma parecida com HTML/XML:

- textos, formas e posições bem organizados
- layouts mais fáceis de ajustar
- bom suporte a vetores, caixas, bordas e imagens
- conversão simples para PNG/JPEG/WebP com ImageMagick
- melhor compatibilidade com Termux do que `canvas` ou `sharp`

## Papel do CSV

CSV não é o motor visual do pacote.

CSV é apenas uma entrada opcional para gerar vários cards em lote.

Exemplo:

```txt
1 linha do CSV = 1 card gerado
```

Isso é útil para bots, listas de membros, playlists, rankings, catálogos ou qualquer automação que precise criar muitas imagens com dados diferentes.

## Recursos atuais

- geração de welcome cards
- geração de goodbye cards
- geração de music cards
- 10 presets para cada família
- suporte a dados via CSV
- saída em arquivo, buffer ou base64
- exportação em PNG, JPEG e outros formatos suportados pelo ImageMagick
- foco em Termux, Linux e Windows

## Instalação

```bash
npm install tmxcards
```

Também é necessário ter o ImageMagick instalado no sistema.

No Termux:

```bash
pkg install imagemagick
```

No Linux:

```bash
sudo apt install imagemagick
```

## Uso básico

```js
const { createWelcomeCard, renderCard } = require("tmxcards");

async function main() {
  const card = createWelcomeCard({
    variant: "welcome-01",
    avatar: {
      enabled: false
    },
    text: {
      title: {
        value: "Bem-vindo, Lucas"
      },
      subtitle: {
        value: "Grupo Oficial"
      },
      message: {
        value: "Leia as regras e aproveite a comunidade."
      }
    },
    output: {
      format: "png",
      outputPath: "./welcome.png",
      returnType: "file"
    }
  });

  const result = await renderCard(card);
  console.log(result);
}

main();
```

## Uso com CSV

```js
const {
  createWelcomeCard,
  renderCardsFromCsv
} = require("tmxcards");

async function main() {
  const results = await renderCardsFromCsv({
    csv: "./members.csv",
    mapRow(row) {
      return createWelcomeCard({
        avatar: {
          enabled: false
        },
        text: {
          title: {
            value: `Bem-vindo, ${row.name}`
          },
          subtitle: {
            value: row.group
          }
        },
        output: {
          format: "png",
          outputPath: `./out/${row.name}.png`,
          returnType: "file"
        }
      });
    }
  });

  console.log(results);
}

main();
```

## Estrutura

- `src/core`: núcleo de renderização, CSV, output e integração com ImageMagick
- `src/templates`: funções de alto nível para templates prontos
- `src/presets`: presets visuais
- `src/utils`: helpers internos
- `examples`: exemplos de uso
- `scripts/check.js`: validação real do pacote

## Famílias de cards

### Welcome

- 10 presets
- layouts com e sem avatar
- suporte a título, subtítulo, mensagem, rodapé e fundo customizável

### Goodbye

- 10 presets equivalentes aos layouts de welcome
- textos ajustados para saída de membro
- mesma lógica de personalização

### Music

- 10 presets
- suporte a título, artista, duração, progresso, thumbnail e fundo customizável

## Saída

Configurações principais:

- `format`: `png`, `jpeg`, `jpg`, `webp` e outros formatos suportados pelo ImageMagick
- `quality`
- `compressionLevel`
- `stripMetadata`
- `progressive`
- `width`
- `height`
- `outputPath`
- `returnType`: `file`, `buffer`, `base64`

## Status

Base funcional:

- renderização validada com ImageMagick
- geração em arquivo validada
- geração em buffer validada
- geração em lote via CSV validada
- pacote testado com `npm pack --dry-run`

Próximo passo planejado:

- adicionar um núcleo SVG explícito em `src/core/svg.js`
- permitir salvar SVG diretamente com `output.format = "svg"`
- manter PNG/JPEG/WebP via conversão do SVG pelo ImageMagick
