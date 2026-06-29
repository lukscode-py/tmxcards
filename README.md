# tmxcards

Biblioteca CommonJS para gerar cards bonitos em **SVG** e **PNG** usando Node.js.

O pacote foi feito para bots, automações, painéis e ambientes leves como **Termux**, Linux e Windows. Ele não depende de `canvas` nem `sharp` no fluxo oficial. O SVG é gerado direto em Node.js e o PNG é renderizado com **rsvg-convert**.

## Instalação

```bash
npm install tmxcards
```

Com Yarn:

```bash
yarn add tmxcards
```

## Requisitos

### SVG

Para gerar **SVG**, nenhum binário externo é necessário.

### PNG

Para gerar **PNG**, instale o `rsvg-convert`.

Termux:

```bash
pkg install librsvg
```

Debian/Ubuntu:

```bash
sudo apt update
sudo apt install librsvg2-bin
```

Arch Linux:

```bash
sudo pacman -S librsvg
```

Fedora:

```bash
sudo dnf install librsvg2-tools
```

Verifique se está funcionando:

```bash
rsvg-convert --version
```

## Formatos suportados

| Formato | Suporte | Observação |
|---|---:|---|
| SVG | Sim | Gerado diretamente pela biblioteca |
| PNG | Sim | Requer `rsvg-convert` |

## Uso rápido

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    group: "Meu grupo",
    avatar: {
      imagePath: "./perfil.png"
    },
    output: {
      format: "png",
      returnType: "file",
      path: "./welcome.png"
    }
  });

  const result = await renderCard(card);
  console.log(result);
}

main();
```

## Gerar SVG

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("rank/personal", {
    name: "Lucas",
    level: 42,
    xp: 820,
    nextLevelXp: 1000,
    output: {
      format: "svg",
      returnType: "file",
      path: "./rank.svg"
    }
  });

  await renderCard(card);
}

main();
```

## Gerar PNG em buffer

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("music/player", {
    title: "Midnight City",
    artist: "TMX",
    duration: "03:42",
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);
  console.log(result.buffer);
}

main();
```

## API principal

```js
const {
  resolveRsvgCommand,
  getSupportedFormats,
  getRendererInfo,
  createSvg,
  renderCard,
  createCard,
  listCards,
  getCardInfo,
  clearImageCache,
  getImageCacheStats
} = require("tmxcards");
```

### `createCard(id, options)`

Cria a configuração de um card.

```js
const card = createCard("welcome/dark", {
  name: "Lucas",
  group: "Kanna Bot",
  output: {
    format: "png",
    returnType: "file",
    path: "./welcome.png"
  }
});
```

### `renderCard(card)`

Renderiza o card criado com `createCard()`.

```js
const result = await renderCard(card);
```

Tipos de retorno suportados:

| `returnType` | Retorno |
|---|---|
| `file` | salva no caminho informado e retorna metadados |
| `buffer` | retorna `Buffer` |
| `base64` | retorna string base64 |
| `dataUri` | retorna data URI |

### `createSvg(id, options)`

Gera somente o SVG em string.

```js
const { createSvg } = require("tmxcards");

const svg = await createSvg("welcome/dark", {
  name: "Lucas",
  group: "Meu grupo"
});

console.log(svg);
```

### `listCards()`

Lista todos os cards registrados.

```js
const { listCards } = require("tmxcards");

console.log(listCards());
```

### `getCardInfo(id)`

Retorna informações de um card específico.

```js
const { getCardInfo } = require("tmxcards");

console.log(getCardInfo("rank/list"));
```

### `getSupportedFormats()`

Mostra os formatos oficiais suportados.

```js
const { getSupportedFormats } = require("tmxcards");

console.log(getSupportedFormats());
// ["svg", "png"]
```

### `getRendererInfo()`

Mostra o estado do renderizador.

```js
const { getRendererInfo } = require("tmxcards");

console.log(getRendererInfo());
```

Exemplo de retorno:

```js
{
  svg: true,
  png: true,
  raster: true,
  command: "rsvg-convert",
  engine: "rsvg-convert",
  platform: "linux"
}
```

## Cards disponíveis

| ID | Categoria | Uso |
|---|---|---|
| `welcome/dark` | Welcome | Boas-vindas em tema escuro |
| `welcome/premium` | Welcome | Boas-vindas premium |
| `welcome/light` | Welcome | Boas-vindas em tema claro |
| `welcome/midnight` | Welcome | Boas-vindas em tema midnight |
| `goodbye/dark` | Goodbye | Despedida em tema escuro |
| `goodbye/premium` | Goodbye | Despedida premium |
| `goodbye/light` | Goodbye | Despedida em tema claro |
| `goodbye/midnight` | Goodbye | Despedida em tema midnight |
| `rank/personal` | Rank | Rank individual |
| `rank/list` | Rank | Lista de ranking |
| `music/player` | Music | Player de música |
| `music/orbit` | Music | Card de música orbit |
| `moderation/ban` | Moderation | Card de banimento |
| `moderation/rank-change` | Moderation | Card de alteração de rank |

## Previews

### Welcome

#### `welcome/dark`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-dark.png" width="470" alt="welcome/dark" />

#### `welcome/premium`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-premium.png" width="470" alt="welcome/premium" />

#### `welcome/light`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-light.png" width="470" alt="welcome/light" />

#### `welcome/midnight`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-midnight.png" width="470" alt="welcome/midnight" />

### Goodbye

#### `goodbye/dark`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-dark.png" width="470" alt="goodbye/dark" />

#### `goodbye/premium`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-premium.png" width="470" alt="goodbye/premium" />

#### `goodbye/light`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-light.png" width="470" alt="goodbye/light" />

#### `goodbye/midnight`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-midnight.png" width="470" alt="goodbye/midnight" />

### Rank

#### `rank/personal`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-personal.png" width="470" alt="rank/personal" />

#### `rank/list`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-list.png" width="470" alt="rank/list" />

### Music

#### `music/player`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-player.png" width="470" alt="music/player" />

#### `music/orbit`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-orbit.png" width="470" alt="music/orbit" />

### Moderation

#### `moderation/ban`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-ban.png" width="470" alt="moderation/ban" />

#### `moderation/rank-change`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-rank-change.png" width="470" alt="moderation/rank-change" />

### Custom

#### `custom/canvas-simple`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/custom-canvas-simple.png" width="470" alt="custom/canvas-simple" />

#### `custom/profile-simple`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/custom-profile-simple.png" width="470" alt="custom/profile-simple" />

## Imagens e avatar

Os cards aceitam imagem por diferentes fontes:

```js
avatar: {
  imagePath: "./avatar.png"
}
```

```js
avatar: {
  url: "https://example.com/avatar.png"
}
```

```js
avatar: {
  dataUri: "data:image/png;base64,..."
}
```

```js
avatar: {
  buffer: imageBuffer
}
```

Também são aceitos aliases como `path`, `imagePath`, `url`, `imageUrl`, `dataUri`, `base64` e `Buffer`, dependendo do campo usado pelo template.

## Card dinâmico

IDs personalizados ainda funcionam. Quando um ID não registrado é usado, a biblioteca cria um card dinâmico.

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("custom/neon-panel", {
    title: "Painel Neon",
    subtitle: "Card dinâmico",
    description: "Exemplo de card criado com ID personalizado.",
    output: {
      format: "png",
      returnType: "file",
      path: "./custom.png"
    }
  });

  await renderCard(card);
}

main();
```

## Exemplos

O pacote inclui exemplos em `examples/`.

```bash
node examples/create-card.js
node examples/dynamic-card.js
node examples/generate-all-cards.js
```

Gerar todos os previews:

```bash
npm run example:all-cards
```

## Uso em bot WhatsApp

Exemplo genérico:

```js
const { createCard, renderCard } = require("tmxcards");

async function sendWelcome(sock, jid, user) {
  const card = createCard("welcome/dark", {
    name: user.name,
    group: "Meu grupo",
    avatar: {
      imagePath: "./perfil.png"
    },
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);

  await sock.sendMessage(jid, {
    image: result.buffer,
    caption: "Bem-vindo!"
  });
}
```

## Cache de imagens

```js
const {
  clearImageCache,
  getImageCacheStats
} = require("tmxcards");

console.log(getImageCacheStats());
clearImageCache();
```

## Diagnóstico

Verificar instalação:

```js
const { getRendererInfo, getSupportedFormats } = require("tmxcards");

console.log(getSupportedFormats());
console.log(getRendererInfo());
```

Teste no terminal:

```bash
node -e "console.log(require('tmxcards').getRendererInfo())"
```

## Desenvolvimento

```bash
npm install
npm run check
npm run check:load
npm run example:all-cards
npm pack --dry-run
```


## Licença

MIT

