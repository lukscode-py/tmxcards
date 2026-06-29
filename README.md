# tmxcards

Biblioteca CommonJS para gerar cards em **SVG**, **PNG**, **JPEG** e **WEBP** usando Node.js. O foco do pacote é criar cards bonitos e leves para bots, painéis, automações, Termux e servidores Linux/Windows sem depender de `canvas` ou `sharp`.

O fluxo principal é:

1. Escolher um card pelo ID.
2. Passar uma configuração simples.
3. Renderizar como arquivo, buffer ou base64.

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

## Recursos

- Cards prontos para boas-vindas, despedida, rank, level, música e moderação.
- Card dinâmico para IDs personalizados.
- SVG nativo e leve.
- PNG/JPEG/WEBP via ImageMagick.
- Suporte a imagem por `path`, `imagePath`, `url`, `imageUrl`, `dataUri`, `base64` e `Buffer`.
- Cache interno de imagens para evitar reler o mesmo arquivo várias vezes.
- API única com `createCard()`, `renderCard()`, `listCards()` e `getCardInfo()`.
- Exemplos prontos em `examples/`.

## Instalação

```bash
npm install tmxcards
```

Com Yarn:

```bash
yarn add tmxcards
```

Uso local durante desenvolvimento:

```bash
npm install
npm run check
npm run example:all-cards
```

## Requisitos

Para gerar **SVG**, nenhum binário externo é necessário.

Para gerar **PNG**, **JPEG** ou **WEBP**, instale ImageMagick.

### Linux / Termux

```bash
pkg install imagemagick
```

ou em distros Debian/Ubuntu:

```bash
sudo apt install imagemagick
```

### Windows

Instale o ImageMagick e deixe o comando `magick` disponível no PATH.

Você pode verificar o suporte do ambiente com:

```js
const { getRendererInfo } = require("tmxcards");

console.log(getRendererInfo());
```

Exemplo de retorno:

```js
{
  svg: true,
  png: true,
  jpeg: true,
  webp: true,
  raster: true,
  command: "convert",
  platform: "linux"
}
```

## Começo rápido

### Renderizar PNG em arquivo

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("rank/personal", {
    name: "Lucas",
    level: 12,
    xp: {
      current: 340,
      total: 1000
    },
    avatar: {
      imagePath: "./perfil.png"
    },
    output: {
      format: "png",
      returnType: "file",
      path: "./rank.png"
    }
  });

  const result = await renderCard(card);

  console.log(result.path);
}

main();
```

### Renderizar SVG como buffer

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("music/player", {
    title: "Minha música",
    artist: "Meu artista",
    cover: {
      imagePath: "./cover.png"
    },
    output: {
      format: "svg",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);

  console.log(result.mime);       // image/svg+xml
  console.log(result.buffer);     // Buffer
  console.log(result.bytes);      // tamanho em bytes
}

main();
```

### Renderizar base64

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    output: {
      format: "png",
      returnType: "base64"
    }
  });

  const result = await renderCard(card);

  console.log(result.base64);
}

main();
```

## API pública

```js
const {
  createCard,
  renderCard,
  createSvg,
  listCards,
  getCardInfo,
  getRendererInfo,
  resolveMagickCommand,
  getSupportedFormats,
  clearImageCache,
  getImageCacheStats
} = require("tmxcards");
```

### `createCard(id, config)`

Cria uma configuração normalizada para um card registrado.

```js
const card = createCard("welcome/dark", {
  name: "Lucas"
});
```

Se o ID não existir, a biblioteca cria um card dinâmico com o ID informado.

```js
const card = createCard("custom/meu-card", {
  title: "Meu card",
  name: "Lucas"
});
```

### `renderCard(card, options?)`

Renderiza o card.

```js
const result = await renderCard(card);
```

Retorno comum:

```js
{
  ok: true,
  returnType: "file",
  path: "./card.png",
  format: "png",
  mime: "image/png",
  width: 470,
  height: 120,
  bytes: 12345
}
```

### `listCards()`

Lista todos os cards registrados.

```js
const { listCards } = require("tmxcards");

console.log(listCards());
```

### `getCardInfo(id)`

Busca informações de um card específico.

```js
const { getCardInfo } = require("tmxcards");

console.log(getCardInfo("rank/list"));
```

### `getRendererInfo()`

Mostra se o ambiente consegue gerar SVG e raster.

```js
const { getRendererInfo } = require("tmxcards");

console.log(getRendererInfo());
```

### `clearImageCache()` e `getImageCacheStats()`

Controlam o cache interno de imagens.

```js
const {
  clearImageCache,
  getImageCacheStats
} = require("tmxcards");

clearImageCache();

console.log(getImageCacheStats());
```

## Configuração de saída

Todo card pode receber `output`.

```js
output: {
  format: "png",
  returnType: "file",
  path: "./card.png"
}
```

### `format`

Formatos comuns:

```txt
svg
png
jpeg
webp
```

`svg` é o mais leve e não precisa de ImageMagick.

`png`, `jpeg` e `webp` precisam de ImageMagick.

### `returnType`

Tipos comuns:

```txt
file
buffer
base64
```

## Usando imagens

Campos de imagem aceitam várias formas.

### Caminho local

```js
avatar: {
  imagePath: "./perfil.png"
}
```

ou:

```js
avatar: {
  path: "./perfil.png"
}
```

### URL

```js
avatar: {
  imageUrl: "https://example.com/perfil.png"
}
```

ou:

```js
avatar: {
  url: "https://example.com/perfil.png"
}
```

### Data URI

```js
avatar: {
  dataUri: "data:image/png;base64,..."
}
```

### Buffer

```js
const fs = require("node:fs");

const buffer = fs.readFileSync("./perfil.png");

const card = createCard("welcome/dark", {
  name: "Lucas",
  avatar: {
    buffer,
    mimeType: "image/png"
  }
});
```

## Cards disponíveis

### Resumo dos IDs

| Categoria | ID | Uso |
|---|---|---|
| Welcome | `welcome/dark` | Boas-vindas escuro minimalista |
| Welcome | `welcome/premium` | Boas-vindas premium |
| Welcome | `welcome/light` | Boas-vindas tema claro |
| Welcome | `welcome/midnight` | Boas-vindas destaque central |
| Goodbye | `goodbye/dark` | Despedida escuro minimalista |
| Goodbye | `goodbye/premium` | Despedida premium |
| Goodbye | `goodbye/light` | Despedida tema claro |
| Goodbye | `goodbye/midnight` | Despedida destaque central |
| Rank | `rank/personal` | Level, XP e barra de progresso |
| Rank | `rank/list` | Lista de ranking top 1, top 10 etc. |
| Music | `music/player` | Card de música estilo player |
| Music | `music/orbit` | Card de música com capa circular/orbital |
| Moderation | `moderation/ban` | Card de banimento |
| Moderation | `moderation/rank-change` | Card de promoção/rebaixamento |
| Dynamic | `custom/*` | Card dinâmico para ID personalizado |

---

## Welcome cards

### `welcome/dark`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-dark.png" width="470" alt="welcome/dark" />

Card escuro minimalista para entrada de usuário em grupo. Ideal para bot de WhatsApp, Discord ou painel de comunidade.

Configuração mínima:

```js
const card = createCard("welcome/dark", {
  name: "Lucas"
});
```

Exemplo completo:

```js
const card = createCard("welcome/dark", {
  name: "Lucas",
  group: "Kanna Group",
  memberCount: 128,
  avatar: {
    imagePath: "./perfil.png"
  },
  background: {
    imagePath: "./background.png",
    opacity: 0.42,
    blur: true
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./welcome-dark.png"
  }
});
```

Campos úteis:

| Campo | Descrição |
|---|---|
| `name` | Nome do usuário |
| `group` | Nome do grupo |
| `memberCount` | Total de membros |
| `avatar` | Foto de perfil |
| `background` | Imagem de fundo opcional |
| `squares` | Quadrados decorativos do fundo |
| `text` | Personalização de textos |
| `colors` / `theme` | Ajustes visuais |

---

### `welcome/premium`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-premium.png" width="470" alt="welcome/premium" />

Card de boas-vindas em layout premium, maior e mais detalhado.

Configuração mínima:

```js
const card = createCard("welcome/premium", {
  name: "Lucas"
});
```

Exemplo:

```js
const card = createCard("welcome/premium", {
  name: "Lucas",
  group: "Meu grupo",
  subtext: "Seja bem-vindo ao servidor",
  avatar: {
    imagePath: "./perfil.png"
  },
  background: {
    imagePath: "./background.png"
  }
});
```

---

### `welcome/light`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-light.png" width="470" alt="welcome/light" />

Variação clara do card de boas-vindas, útil quando o bot usa identidade visual limpa.

Configuração mínima:

```js
const card = createCard("welcome/light", {
  name: "Lucas"
});
```

---

### `welcome/midnight`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-midnight.png" width="470" alt="welcome/midnight" />

Card de boas-vindas com foco central, avatar grande e visual noturno.

Configuração mínima:

```js
const card = createCard("welcome/midnight", {
  name: "Lucas"
});
```

Exemplo:

```js
const card = createCard("welcome/midnight", {
  name: "Lucas",
  group: "Grupo oficial",
  avatar: {
    path: "./perfil.png"
  },
  background: {
    imagePath: "./background.png",
    overlayOpacity: 0.45
  }
});
```

## Goodbye cards

### `goodbye/dark`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-dark.png" width="470" alt="goodbye/dark" />

Versão de despedida do card escuro minimalista.

```js
const card = createCard("goodbye/dark", {
  name: "Lucas"
});
```

### `goodbye/premium`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-premium.png" width="470" alt="goodbye/premium" />

Card premium para saída de usuário.

```js
const card = createCard("goodbye/premium", {
  name: "Lucas"
});
```

### `goodbye/light`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-light.png" width="470" alt="goodbye/light" />

Variação clara para despedida.

```js
const card = createCard("goodbye/light", {
  name: "Lucas"
});
```

### `goodbye/midnight`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-midnight.png" width="470" alt="goodbye/midnight" />

Card noturno centralizado para despedida.

```js
const card = createCard("goodbye/midnight", {
  name: "Lucas"
});
```

## Rank cards

### `rank/personal`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-personal.png" width="470" alt="rank/personal" />

Card pessoal de level e XP. Mostra nome, perfil, level, XP e barra de progresso.

```js
const card = createCard("rank/personal", {
  name: "Lucas",
  level: 12,
  xp: {
    current: 340,
    total: 1000,
    progress: 34
  },
  avatar: {
    imagePath: "./perfil.png"
  }
});
```

Campos úteis:

| Campo | Descrição |
|---|---|
| `name` | Nome do usuário |
| `level` | Level atual |
| `xp.current` | XP atual |
| `xp.total` | XP necessário |
| `xp.progress` | Progresso em porcentagem |
| `avatar` | Foto de perfil |
| `bar` | Barra de XP |
| `background` | Fundo personalizado |

### `rank/list`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-list.png" width="470" alt="rank/list" />

Card universal de ranking. Serve para top 3, top 10, placares, economia, mensagens, XP, level, staff, ranking de grupos e listas customizadas.

```js
const card = createCard("rank/list", {
  title: "Top XP",
  subtitle: "Ranking semanal",
  items: [
    {
      name: "Lucas",
      sub: "Level 12",
      value: "12.450 XP",
      progress: 100,
      imagePath: "./perfil-1.png"
    },
    {
      name: "Kanna",
      sub: "Level 10",
      value: "9.800 XP",
      progress: 78,
      imagePath: "./perfil-2.png"
    }
  ],
  stats: [
    { label: "Total", value: "10 usuários" },
    { label: "Semana", value: "+2.3k XP" }
  ],
  extraTables: [
    {
      title: "Prêmios",
      rows: [
        ["#1", "VIP 7 dias"],
        ["#2", "VIP 3 dias"]
      ]
    }
  ]
});
```

Campos úteis:

| Campo | Descrição |
|---|---|
| `title` | Título do rank |
| `subtitle` | Subtítulo |
| `items` | Lista principal |
| `items[].name` | Nome da linha |
| `items[].sub` | Texto secundário |
| `items[].value` | Valor à direita |
| `items[].progress` | Barra da linha |
| `items[].imagePath` | Avatar da linha |
| `items[].icon` | Ícone/fallback |
| `stats` | Cards de estatísticas |
| `extraTables` | Tabelas extras |
| `theme` | Cores, fontes e espaçamentos |
| `options.compact` | Layout compacto |

## Music cards

### `music/player`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-player.png" width="470" alt="music/player" />

Card de música com capa, título, subtítulo, duração e barra de progresso.

```js
const card = createCard("music/player", {
  title: "Nome da música",
  artist: "Nome do artista",
  duration: "3:45",
  cover: {
    imagePath: "./cover.png"
  },
  progress: {
    value: 38
  }
});
```

### `music/orbit`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-orbit.png" width="470" alt="music/orbit" />

Card de música com capa circular/orbital e visual mais estilizado.

```js
const card = createCard("music/orbit", {
  title: "Minha música",
  subtitle: "Meu artista",
  cover: {
    imagePath: "./cover.png"
  },
  progress: {
    value: 42
  }
});
```

## Moderation cards

### `moderation/ban`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-ban.png" width="470" alt="moderation/ban" />

Card para banimento, punição ou alerta administrativo.

```js
const card = createCard("moderation/ban", {
  name: "Lucas",
  group: "Meu grupo",
  reason: "Divulgação proibida",
  moderator: "Admin",
  date: "29/06/2026",
  time: "19:00",
  avatar: {
    imagePath: "./perfil.png"
  }
});
```

### `moderation/rank-change`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-rank-change.png" width="470" alt="moderation/rank-change" />

Card para promoção, rebaixamento ou alteração de cargo.

```js
const card = createCard("moderation/rank-change", {
  name: "Lucas",
  group: "Meu grupo",
  action: {
    mode: "promote"
  },
  oldRole: "Membro",
  newRole: "Admin",
  moderator: "Dono",
  avatar: {
    imagePath: "./perfil.png"
  }
});
```

Modos comuns:

```txt
promote
demote
neutral
```

## Cards dinâmicos

Se você chamar `createCard()` com um ID que não está registrado, o pacote cria um card dinâmico automaticamente.

### `custom/canvas-simple`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/custom-canvas-simple.png" width="470" alt="custom/canvas-simple" />

```js
const card = createCard("custom/canvas-simple", {
  title: "Meu card",
  subtitle: "Gerado com ID personalizado",
  main: "Texto principal do card",
  badges: [
    { text: "CUSTOM" },
    { text: "SVG" }
  ],
  stats: [
    { label: "API", value: "OK" },
    { label: "Cards", value: "14+" }
  ],
  progress: {
    enabled: true,
    value: 72,
    label: "Progresso"
  }
});
```

### `custom/profile-simple`

<img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/custom-profile-simple.png" width="470" alt="custom/profile-simple" />

```js
const card = createCard("custom/profile-simple", {
  title: "Perfil",
  name: "Lucas",
  group: "Kanna Group",
  avatar: {
    imagePath: "./perfil.png"
  },
  stats: [
    { label: "Level", value: "12" },
    { label: "XP", value: "340" }
  ]
});
```

Campos úteis para card dinâmico:

| Campo | Descrição |
|---|---|
| `title` | Título |
| `subtitle` | Subtítulo |
| `name` | Nome do usuário |
| `group` | Grupo |
| `main` | Texto principal |
| `footer` | Rodapé |
| `avatar` | Foto |
| `background` | Fundo |
| `badges` | Tags |
| `stats` | Estatísticas |
| `progress` | Barra de progresso |
| `theme` | Tema visual |
| `elements` | Elementos extras |

## Personalização geral

A maioria dos cards aceita objetos como:

```js
{
  name: "Lucas",
  group: "Meu grupo",
  avatar: {
    imagePath: "./perfil.png",
    opacity: 1
  },
  background: {
    imagePath: "./bg.png",
    overlayOpacity: 0.45
  },
  text: {
    title: {
      value: "Bem-vindo(a)",
      color: "#FFFFFF"
    },
    subtitle: {
      value: "Sub texto",
      opacity: 0.72
    }
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./card.png"
  }
}
```

### Texto

Muitos cards aceitam texto direto:

```js
createCard("welcome/dark", {
  name: "Lucas",
  group: "Meu grupo"
});
```

E também texto avançado:

```js
createCard("welcome/dark", {
  text: {
    name: {
      value: "Lucas",
      color: "#FFFFFF"
    },
    group: {
      value: "Meu grupo",
      opacity: 0.72
    }
  }
});
```

### Tema

Cards como `rank/list` e dinâmicos aceitam `theme`.

```js
createCard("rank/list", {
  title: "Top moedas",
  items: [
    { name: "Lucas", value: "10.000", progress: 100 }
  ],
  theme: {
    bgStart: "#050505",
    bgEnd: "#111111",
    accentStart: "#FFFFFF",
    accentEnd: "#9CA3AF",
    text: "#FFFFFF",
    muted: "#A3A3A3"
  }
});
```

## Exemplos do pacote

Gerar todos os exemplos:

```bash
npm run example:all-cards
```

Rodar exemplo específico:

```bash
npm run example:welcome-premium-01
npm run example:music-midnight-mono-player
npm run example:dynamic-card
```

Os arquivos gerados ficam em:

```txt
examples/generated/
```

Essa pasta é ignorada pelo Git.

## Uso em bot

Exemplo genérico para enviar o buffer em um bot:

```js
const { createCard, renderCard } = require("tmxcards");

async function createWelcomeBuffer(user) {
  const card = createCard("welcome/dark", {
    name: user.name,
    group: "Meu grupo",
    avatar: {
      imageUrl: user.avatarUrl
    },
    output: {
      format: "png",
      returnType: "buffer"
    }
  });

  const result = await renderCard(card);

  if (!result.ok) {
    throw new Error("Falha ao gerar card");
  }

  return result.buffer;
}
```

## Dicas de performance

Use `format: "svg"` quando a plataforma aceitar SVG. É mais rápido e não precisa converter imagem.

Para WhatsApp e plataformas que exigem imagem raster, use `png`.

Quando for gerar vários cards com a mesma foto/capa, o cache interno evita reler o mesmo arquivo repetidas vezes.

```js
const {
  clearImageCache,
  getImageCacheStats
} = require("tmxcards");

clearImageCache();

// renderize vários cards...

console.log(getImageCacheStats());
```

## Validação

Durante desenvolvimento:

```bash
npm run check
npm run check:load
npm run example:all-cards
npm pack --dry-run
```

## Compatibilidade

- Node.js com CommonJS.
- Linux, Termux e Windows.
- SVG sem dependência externa.
- PNG/JPEG/WEBP com ImageMagick.

## Licença

MIT
