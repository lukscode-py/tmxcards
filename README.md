# tmxcards

`tmxcards` é uma biblioteca CommonJS para gerar cards em **SVG** e **PNG** a partir de objetos JavaScript.

O pacote trabalha com dois caminhos:

1. **Templates oficiais prontos**, registrados em `listCards()`, para welcome, goodbye, rank, música e moderação.
2. **Cards customizados dinâmicos**, usados quando o ID não existe no registry oficial.

O fluxo real da biblioteca é:

```txt
createCard(id, config)
        ↓
normalização de campos comuns
        ↓
merge com o template oficial ou com o card dinâmico
        ↓
createSvg() / renderCard()
        ↓
SVG direto ou PNG via rsvg-convert
```

## Instalação

```bash
npm install tmxcards
```

Com Yarn:

```bash
yarn add tmxcards
```

## Requisitos

### Node.js

O pacote declara suporte para Node.js `>=18`.

### SVG

SVG é gerado diretamente pela biblioteca e não precisa de binário externo.

### PNG

PNG é gerado convertendo o SVG com `rsvg-convert`.

Instale o `rsvg-convert` no ambiente onde o PNG será gerado:

```bash
# Termux
pkg install librsvg

# Debian / Ubuntu
sudo apt update
sudo apt install librsvg2-bin

# Arch Linux
sudo pacman -S librsvg

# Fedora
sudo dnf install librsvg2-tools
```

Verifique:

```bash
rsvg-convert --version
```

## Guia rápido

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    group: "Grupo do tmxcards",
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

main().catch(console.error);
```

## Importação

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

## API pública

### `createCard(id, config)`

Cria um objeto de card a partir de um ID.

```js
const card = createCard("rank/personal", {
  name: "Lucas",
  level: 12,
  xp: {
    current: 340,
    total: 1000
  }
});
```

`id` pode ser:

- o ID oficial, como `welcome/dark`;
- o nome interno do template, como `dark_minimal_welcome`;
- um alias registrado, como `welcome-dark`;
- um ID inexistente, como `custom/meu-card`, que vira card customizado dinâmico.

### `renderCard(card)`

Renderiza um card criado com `createCard()` ou um objeto de card compatível.

```js
const result = await renderCard(card);
```

O retorno depende de `output.returnType`.

### `createSvg(idOrCard, config?)`

Gera somente o SVG.

Uso com ID e configuração:

```js
const svg = await createSvg("music/player", {
  title: "Minha música",
  subtitle: "Meu artista"
});
```

Uso com card já criado:

```js
const card = createCard("music/player", {
  title: "Minha música"
});

const svg = await createSvg(card);
```

### `listCards(filter?)`

Lista os templates oficiais registrados.

```js
console.log(listCards());
console.log(listCards({ category: "welcome" }));
```

### `getCardInfo(id)`

Retorna metadados de um template oficial.

```js
console.log(getCardInfo("welcome/dark"));
```

Retorna `null` quando o ID não pertence ao registry oficial.

### `getSupportedFormats()`

Retorna os formatos de saída oficiais.

```js
console.log(getSupportedFormats());
// ["svg", "png"]
```

### `getRendererInfo()`

Retorna o estado do renderizador.

```js
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

### `resolveRsvgCommand()`

Resolve o comando `rsvg-convert` disponível no ambiente.

```js
const command = resolveRsvgCommand();
console.log(command);
```

### `clearImageCache()` e `getImageCacheStats()`

Controlam o cache interno usado ao transformar arquivos locais em data URI.

```js
console.log(getImageCacheStats());
clearImageCache();
```

## Formatos de saída

| `output.format` | Resultado | Requisito |
|---|---|---|
| `svg` | SVG direto | nenhum binário externo |
| `png` | PNG convertido do SVG | `rsvg-convert` instalado |

Outros formatos de saída não fazem parte da API oficial atual.

## Tipos de retorno

Todos os templates usam `output`.

```js
output: {
  format: "png",
  returnType: "file",
  path: "./card.png",
  overwrite: true
}
```

| Campo | Tipo | Efeito |
|---|---|---|
| `output.format` | `"svg"` ou `"png"` | define o formato gerado |
| `output.returnType` | `"file"`, `"buffer"` ou `"base64"` | define como o resultado será entregue |
| `output.path` | string | caminho de saída quando `returnType` é `"file"` |
| `output.outputPath` | string | alias de `output.path` |
| `output.overwrite` | boolean | se `false`, falha quando o arquivo já existe |

### Resultado com `returnType: "file"`

```js
{
  ok: true,
  returnType: "file",
  path: "/caminho/card.png",
  format: "png",
  mime: "image/png",
  width: 470,
  height: 120,
  bytes: 12707
}
```

### Resultado com `returnType: "buffer"`

```js
{
  ok: true,
  returnType: "buffer",
  format: "png",
  mime: "image/png",
  width: 470,
  height: 120,
  buffer: Buffer,
  bytes: 12707
}
```

### Resultado com `returnType: "base64"`

```js
{
  ok: true,
  returnType: "base64",
  format: "png",
  mime: "image/png",
  width: 470,
  height: 120,
  base64: "...",
  bytes: 12707
}
```

## Imagens de entrada

Campos como `avatar`, `cover`, `background` e itens de lista podem receber imagens.

A biblioteca aceita:

```js
avatar: {
  imagePath: "./perfil.png"
}
```

```js
avatar: {
  path: "./perfil.png"
}
```

```js
avatar: {
  url: "https://example.com/perfil.png"
}
```

```js
avatar: {
  imageUrl: "https://example.com/perfil.png"
}
```

```js
avatar: {
  dataUri: "data:image/png;base64,..."
}
```

```js
avatar: {
  base64: "...",
  mimeType: "image/png"
}
```

```js
avatar: {
  buffer: imageBuffer,
  mimeType: "image/png"
}
```

Também são aceitos `href`, `data`, `bytes` e o próprio valor direto como string ou `Buffer`.

Arquivos locais existentes são convertidos para data URI e podem ser reutilizados pelo cache interno.

## Campos comuns normalizados pelo `createCard()`

`createCard()` aceita atalhos no topo da configuração e converte para a estrutura esperada pelo template.

| Atalho | Também pode vir de | Usado para |
|---|---|---|
| `name` | `user.name`, `text.name`, `text.userName` | nome do usuário |
| `group` | `groupName`, `group.name`, `group.title`, `text.group`, `text.groupName` | grupo/comunidade |
| `title` | `music.title`, `text.title` | título principal |
| `subtitle` | `music.artist`, `music.subtitle`, `text.subtitle` | texto secundário |
| `main` | `text.main`, `text.greeting`, `text.subtext`, `text.xp` | mensagem principal |
| `footer` | `text.footer`, `text.nextLevel` | texto inferior ou auxiliar |
| `items` | `rank.items` | lista usada por `rank/list` |

Campos comuns também aceitos:

| Campo | Efeito |
|---|---|
| `width` / `layout.width` | largura do SVG |
| `height` / `layout.height` | altura do SVG |
| `radius` / `layout.radius` | raio base quando o template usa esse valor |
| `background` | imagem, cores e overlay de fundo |
| `avatar` | imagem, opacidade e estado do avatar |
| `cover` | imagem de capa para cards de música |
| `theme` | cores, fonte e variações visuais adaptadas para cada template |
| `output` | formato, retorno e caminho do resultado |

## Templates oficiais

A lista abaixo é a lista oficial retornada por `listCards()`.

| ID oficial | Template interno | Categoria | Obrigatório | Aliases |
|---|---|---|---|---|
| `welcome/dark` | `dark_minimal_welcome` | `welcome` | `name` | `dark_minimal_welcome`, `dark-welcome`, `welcome-dark` |
| `welcome/premium` | `welcome-premium-01` | `welcome` | `name` | `welcome-premium-01`, `premium-welcome`, `welcome-premium` |
| `welcome/light` | `welcome-light-01` | `welcome` | `name` | `welcome-light-01`, `light-welcome`, `welcome-light` |
| `welcome/midnight` | `welcome-midnight-focus` | `welcome` | `name` | `welcome-midnight-focus`, `midnight-welcome`, `welcome-midnight` |
| `goodbye/dark` | `dark_minimal_farewell` | `goodbye` | `name` | `dark_minimal_farewell`, `dark-goodbye`, `goodbye-dark`, `farewell/dark` |
| `goodbye/premium` | `welcome-premium-01` | `goodbye` | `name` | `goodbye-premium-01`, `premium-goodbye`, `goodbye-premium` |
| `goodbye/light` | `welcome-light-01` | `goodbye` | `name` | `goodbye-light-01`, `light-goodbye`, `goodbye-light` |
| `goodbye/midnight` | `welcome-midnight-focus` | `goodbye` | `name` | `goodbye-midnight-focus`, `midnight-goodbye`, `goodbye-midnight` |
| `rank/personal` | `dark_minimal_xp_rank` | `rank` | `name` | `dark_minimal_xp_rank`, `personal-rank`, `rank-xp`, `xp-rank` |
| `rank/list` | `universal_rank_card` | `rank` | `items` | `universal_rank_card`, `rank-list`, `leaderboard` |
| `music/player` | `music-midnight-mono-player` | `music` | `title` | `music-midnight-mono-player`, `music-player`, `player/music` |
| `music/orbit` | `orbit_mono_player` | `music` | `title` | `orbit_mono_player`, `orbit-music`, `music-orbit` |
| `moderation/ban` | `crimson_authority_ban` | `moderation` | `name` | `crimson_authority_ban`, `ban-notice`, `ban` |
| `moderation/rank-change` | `rank_shift_notice` | `moderation` | `name` | `rank_shift_notice`, `rank-change`, `role-change`, `promotion` |

## Exemplos visuais

Essas imagens servem apenas para mostrar o resultado visual esperado. A lista oficial de templates continua sendo a lista retornada por `listCards()`.

### Exemplos oficiais

As imagens desta seção mostram somente templates oficiais registrados em `listCards()`.

<table>
  <tr>
    <td width="50%">
      <strong>welcome/dark</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-dark.png" width="390" alt="Resultado visual do template welcome/dark">
    </td>
    <td width="50%">
      <strong>welcome/premium</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-premium.png" width="390" alt="Resultado visual do template welcome/premium">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>welcome/light</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-light.png" width="390" alt="Resultado visual do template welcome/light">
    </td>
    <td width="50%">
      <strong>welcome/midnight</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/welcome-midnight.png" width="390" alt="Resultado visual do template welcome/midnight">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>goodbye/dark</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-dark.png" width="390" alt="Resultado visual do template goodbye/dark">
    </td>
    <td width="50%">
      <strong>goodbye/premium</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-premium.png" width="390" alt="Resultado visual do template goodbye/premium">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>goodbye/light</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-light.png" width="390" alt="Resultado visual do template goodbye/light">
    </td>
    <td width="50%">
      <strong>goodbye/midnight</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/goodbye-midnight.png" width="390" alt="Resultado visual do template goodbye/midnight">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>rank/personal</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-personal.png" width="390" alt="Resultado visual do template rank/personal">
    </td>
    <td width="50%">
      <strong>rank/list</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/rank-list.png" width="390" alt="Resultado visual do template rank/list">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>music/player</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-player.png" width="390" alt="Resultado visual do template music/player">
    </td>
    <td width="50%">
      <strong>music/orbit</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/music-orbit.png" width="390" alt="Resultado visual do template music/orbit">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>moderation/ban</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-ban.png" width="390" alt="Resultado visual do template moderation/ban">
    </td>
    <td width="50%">
      <strong>moderation/rank-change</strong><br>
      <img src="https://github.com/lukscode-py/tmxcards/raw/master/docs/previews/moderation-rank-change.png" width="390" alt="Resultado visual do template moderation/rank-change">
    </td>
  </tr>
</table>

## Diferença entre templates oficiais e cards customizados

Templates oficiais são os IDs retornados por `listCards()`.

Cards customizados são IDs que não existem no registry. Exemplo:

```js
const card = createCard("custom/neon-dashboard", {
  title: "Painel",
  elements: []
});
```

Nesse caso o card recebe:

```js
{
  template: "dynamic_custom_card",
  category: "custom",
  kind: "custom",
  isDynamic: true
}
```


## Template `welcome/dark`

Template oficial:

```txt
ID: welcome/dark
Template interno: dark_minimal_welcome
Categoria: welcome
Obrigatório: name
Tamanho padrão: 470x120
```

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | nome exibido no card |
| `group` | nome do grupo |
| `main` | mensagem central; por padrão representa entrada no grupo |
| `avatar` | imagem e posição do perfil |
| `background` | imagem, gradiente e desfoque do fundo |
| `overlay` | camada escura sobre o fundo |
| `accent` | cores do detalhe visual |
| `squares` | quadrados decorativos |
| `icon` | ícone pequeno do card |
| `text` | cores e valores textuais |
| `border` | borda e destaque externo |
| `shadow` | sombra do card |
| `glass` | camada translúcida |
| `fonts` | fonte base |
| `output` | formato e retorno |

### Opções detalhadas

| Caminho | Efeito |
|---|---|
| `background.imagePath` | imagem de fundo |
| `background.startColor` / `background.endColor` | gradiente de fundo quando não há imagem |
| `background.opacity` | opacidade da imagem de fundo |
| `background.blur` | desfoque aplicado ao fundo |
| `overlay.startColor` / `overlay.endColor` | cores da camada de overlay |
| `overlay.startOpacity` / `overlay.endOpacity` | opacidade da camada de overlay |
| `accent.startColor` / `accent.endColor` | cores do destaque |
| `squares.enabled` | liga/desliga quadrados decorativos |
| `squares.stroke` | cor dos quadrados |
| `squares.mainOpacity` / `squares.secondaryOpacity` | intensidade dos quadrados |
| `avatar.enabled` | liga/desliga avatar |
| `avatar.path` / `avatar.imagePath` | imagem do avatar |
| `avatar.x`, `avatar.y`, `avatar.cx`, `avatar.cy` | posição do avatar |
| `avatar.size`, `avatar.radius`, `avatar.outerRadius` | tamanho e recorte do avatar |
| `avatar.opacity` | opacidade da imagem do avatar |
| `avatar.placeholderText` | texto mostrado quando não há avatar |
| `icon.type` | tipo do ícone; o template usa `plus` por padrão |
| `icon.customPath` | caminho SVG customizado para o ícone, quando usado pelo renderer |
| `icon.text` | texto no lugar do ícone, quando usado pelo renderer |
| `text.primaryColor` | cor principal dos textos |
| `text.secondaryColor` | cor secundária |
| `text.name.value` | nome renderizado |
| `text.main.value` | mensagem principal |
| `text.group.value` | grupo renderizado |
| `border.color`, `border.opacity`, `border.width` | borda principal |
| `border.highlightColor`, `border.highlightOpacity`, `border.highlightWidth` | linha de destaque |
| `shadow.dx`, `shadow.dy`, `shadow.blur`, `shadow.color`, `shadow.opacity` | sombra |
| `glass.color`, `glass.opacity` | camada translúcida |
| `fonts.base` | fonte base |

### Exemplo

```js
const { createCard, renderCard } = require("tmxcards");

async function main() {
  const card = createCard("welcome/dark", {
    name: "Lucas",
    group: "Grupo do tmxcards",
    main: "Entrou no grupo",
    avatar: {
      imagePath: "./perfil.png",
      opacity: 1
    },
    background: {
      imagePath: "./fundo.png",
      opacity: 0.42,
      blur: 3.5
    },
    accent: {
      startColor: "#FFFFFF",
      endColor: "#D4D4D4"
    },
    output: {
      format: "png",
      returnType: "file",
      path: "./welcome-dark.png"
    }
  });

  console.log(await renderCard(card));
}

main().catch(console.error);
```

## Template `goodbye/dark`

Template oficial:

```txt
ID: goodbye/dark
Template interno: dark_minimal_farewell
Categoria: goodbye
Obrigatório: name
Tamanho padrão: 470x120
```

Esse template usa a mesma família visual do `welcome/dark`, mas com padrão de despedida.

Diferenças principais:

| Campo | Valor padrão |
|---|---|
| `kind` | `goodbye` |
| `text.main.value` | `Saiu do grupo` |
| `icon.type` | `x` |
| `overlay.startOpacity` | mais forte que o welcome |
| `accent.endColor` | `#CFCFCF` |

Exemplo:

```js
const card = createCard("goodbye/dark", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  main: "Saiu do grupo",
  avatar: {
    imagePath: "./perfil.png"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./goodbye-dark.png"
  }
});

const result = await renderCard(card);
```

## Templates `welcome/premium` e `goodbye/premium`

Templates oficiais:

```txt
ID: welcome/premium
Template interno: welcome-premium-01
Categoria: welcome
Obrigatório: name
Tamanho padrão: 800x400

ID: goodbye/premium
Template interno: welcome-premium-01
Categoria: goodbye
Obrigatório: name
Tamanho padrão: 800x400
```

`goodbye/premium` reutiliza a estrutura visual do template premium, mas troca os textos padrão para despedida.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | preenche `text.name.value` |
| `group` | preenche `text.group.value` |
| `title` | preenche `text.greeting.value` |
| `main` | preenche `text.subtext.value` |
| `background.imagePath` | fundo personalizado |
| `avatar.enabled` | liga/desliga avatar |
| `avatar.path` / `avatar.imagePath` | imagem do avatar |
| `avatar.opacity` | opacidade do avatar |
| `text.badge.value` | texto da etiqueta superior |
| `text.greeting.value` | chamada principal |
| `text.name.value` | nome grande |
| `text.group.value` | grupo |
| `text.subtext.value` | texto auxiliar |
| `progress.value` | largura da linha de progresso, aceita 0-100 ou 0-1 |
| `progress.baseColor` | cor da base da linha |
| `progress.baseOpacity` | opacidade da base |
| `progress.fillColor` | cor do preenchimento |
| `progress.fillOpacity` | opacidade do preenchimento |
| `output` | saída |

### Exemplo `welcome/premium`

```js
const card = createCard("welcome/premium", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  title: "Bem-vindo(a)!",
  main: "Leia as regras e aproveite.",
  avatar: {
    imagePath: "./perfil.png"
  },
  progress: {
    value: 72,
    fillColor: "#FFFFFF"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./welcome-premium.png"
  }
});

const result = await renderCard(card);
```

### Exemplo `goodbye/premium`

```js
const card = createCard("goodbye/premium", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  title: "Adeus!",
  main: "Esperamos você de volta em breve.",
  output: {
    format: "png",
    returnType: "file",
    path: "./goodbye-premium.png"
  }
});

const result = await renderCard(card);
```

## Templates `welcome/light` e `goodbye/light`

Templates oficiais:

```txt
ID: welcome/light
Template interno: welcome-light-01
Categoria: welcome
Obrigatório: name
Tamanho padrão: 800x400

ID: goodbye/light
Template interno: welcome-light-01
Categoria: goodbye
Obrigatório: name
Tamanho padrão: 800x400
```

São variações claras da família premium.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name`, `group`, `title`, `main` | atalhos textuais normalizados |
| `background.imagePath` | fundo personalizado |
| `avatar.enabled` | liga/desliga avatar |
| `avatar.path` / `avatar.imagePath` | imagem do avatar |
| `avatar.opacity` | opacidade do avatar |
| `text.badge.value` | etiqueta |
| `text.greeting.value` | chamada |
| `text.name.value` | nome |
| `text.group.value` | grupo |
| `text.subtext.value` | texto auxiliar |
| `progress.value` | linha de progresso |
| `output` | saída |

Exemplo:

```js
const card = createCard("welcome/light", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  text: {
    badge: { value: "NOVO MEMBRO" },
    greeting: { value: "Bem-vindo(a)!" },
    subtext: { value: "Use /menu para começar." }
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./welcome-light.png"
  }
});

const result = await renderCard(card);
```

## Templates `welcome/midnight` e `goodbye/midnight`

Templates oficiais:

```txt
ID: welcome/midnight
Template interno: welcome-midnight-focus
Categoria: welcome
Obrigatório: name
Tamanho padrão: 1024x420

ID: goodbye/midnight
Template interno: welcome-midnight-focus
Categoria: goodbye
Obrigatório: name
Tamanho padrão: 1024x420
```

São cards com foco central no usuário.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | nome central |
| `group` | grupo abaixo do nome |
| `title` | título superior |
| `background.imagePath` | imagem de fundo |
| `background.overlayOpacity` | intensidade da camada sobre o fundo |
| `avatar.enabled` | liga/desliga avatar |
| `avatar.path` / `avatar.imagePath` | imagem do avatar |
| `avatar.opacity` | opacidade do avatar |
| `avatar.borderColor` | cor única da borda, quando usada |
| `avatar.borderStartColor` | cor inicial da borda em gradiente |
| `avatar.borderEndColor` | cor final da borda em gradiente |
| `text.title.value` | título |
| `text.name.value` | nome |
| `text.group.value` | grupo |
| `output` | saída |

Exemplo:

```js
const card = createCard("welcome/midnight", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  title: "BEM-VINDO(A)",
  avatar: {
    imagePath: "./perfil.png",
    borderStartColor: "#FFFFFF",
    borderEndColor: "#A1A1AA"
  },
  background: {
    imagePath: "./fundo.png",
    overlayOpacity: 0.35
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./welcome-midnight.png"
  }
});

const result = await renderCard(card);
```

## Template `rank/personal`

Template oficial:

```txt
ID: rank/personal
Template interno: dark_minimal_xp_rank
Categoria: rank
Obrigatório: name
Tamanho padrão: 470x120
```

Card individual de XP/level.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | nome do usuário |
| `level` | level atual; pode ser número ou objeto |
| `xp` | configuração de XP |
| `progress` | atalho para `xp.progress` |
| `avatar` | imagem e posição do perfil |
| `background` | fundo |
| `overlay` | camada sobre o fundo |
| `bar` | barra de XP |
| `marker` | marcador circular da barra |
| `squares` | decoração |
| `text` | textos e cores |
| `border`, `shadow`, `glass`, `fonts` | estilo |
| `output` | saída |

### Opções de XP

| Caminho | Efeito |
|---|---|
| `xp.current` | XP atual |
| `xp.total` | XP necessário |
| `xp.progress` | progresso manual; quando definido, controla a barra |
| `xp.startColor` / `xp.endColor` | cores do preenchimento |
| `bar.x`, `bar.y` | posição da barra |
| `bar.width`, `bar.height` | tamanho da barra |
| `bar.radius` | arredondamento |
| `bar.bgColor`, `bar.bgOpacity` | fundo da barra |
| `bar.progressWidth` | largura manual do preenchimento |
| `marker.cx`, `marker.cy`, `marker.radius` | marcador |
| `level.value` | level exibido |
| `text.xp.value` | texto de XP |
| `text.nextLevel.value` | texto auxiliar |

Exemplo:

```js
const card = createCard("rank/personal", {
  name: "Lucas",
  level: 12,
  xp: {
    current: 340,
    total: 1000,
    progress: 34,
    startColor: "#FFFFFF",
    endColor: "#BDBDBD"
  },
  footer: "Faltam 660 XP",
  avatar: {
    imagePath: "./perfil.png"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./rank-personal.png"
  }
});

const result = await renderCard(card);
```

## Template `rank/list`

Template oficial:

```txt
ID: rank/list
Template interno: universal_rank_card
Categoria: rank
Obrigatório: items
Largura padrão: 1000
Altura: calculada de acordo com conteúdo
```

Card de ranking/lista com itens, estatísticas e tabelas extras.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `items` | lista principal; obrigatório |
| `title` | título do card |
| `subtitle` | subtítulo |
| `type` | etiqueta/metrica no cabeçalho |
| `info` | informação auxiliar no cabeçalho |
| `stats` | cards pequenos de estatísticas |
| `extraTables` | tabelas adicionais abaixo da lista |
| `theme` | tema visual |
| `options` | liga/desliga partes do layout |
| `columns` | posições internas de coluna |
| `background` | fundo |
| `card` | área principal |
| `output` | saída |

### `items[]`

Cada item pode usar:

| Campo | Efeito |
|---|---|
| `position` | posição exibida; se ausente usa índice + 1 |
| `id` | ID SVG da linha |
| `name` | nome principal |
| `description` | descrição abaixo do nome |
| `sub` | texto da coluna secundária |
| `value` | valor à direita |
| `icon` | texto fallback quando não há imagem |
| `progress` | barra de progresso de 0 a 100 |
| `imagePath`, `path`, `url`, `imageUrl`, `dataUri`, `buffer` | imagem do item |

### `stats[]`

```js
stats: [
  { label: "Total", value: "10 usuários" },
  { label: "Semana", value: "+2.3k XP" }
]
```

### `extraTables[]`

```js
extraTables: [
  {
    title: "Prêmios",
    rows: [
      { label: "#1", value: "VIP 7 dias" },
      { label: "#2", value: "VIP 3 dias" }
    ]
  }
]
```

### `options`

| Campo | Efeito |
|---|---|
| `options.compact` | reduz altura das linhas |
| `options.showImages` | mostra imagens dos itens quando disponíveis |
| `options.showProgress` | mostra barra de progresso |
| `options.showDescription` | mostra descrição |
| `options.showSub` | mostra texto secundário |
| `options.showValue` | mostra valor à direita |
| `options.showStats` | mostra estatísticas |
| `options.showExtraTables` | mostra tabelas extras |

### `theme`

| Campo | Efeito |
|---|---|
| `theme.bgStart` / `theme.bgEnd` | fundo geral |
| `theme.cardStart` / `theme.cardEnd` | fundo do painel |
| `theme.accentStart` / `theme.accentEnd` | destaque padrão |
| `theme.top1Start` / `theme.top1End` | destaque do primeiro lugar |
| `theme.top2Start` / `theme.top2End` | destaque do segundo lugar |
| `theme.top3Start` / `theme.top3End` | destaque do terceiro lugar |
| `theme.text` | texto principal |
| `theme.muted` | texto secundário |
| `theme.border` | bordas |
| `theme.rowRadius` | raio das linhas |
| `theme.cardRadius` | raio do painel |
| `theme.font` | fonte |

Exemplo:

```js
const card = createCard("rank/list", {
  title: "Top XP",
  subtitle: "Ranking semanal",
  type: "XP",
  info: "Atualizado hoje",
  items: [
    {
      name: "Lucas",
      description: "Level 12",
      sub: "Mensagens",
      value: "12.450 XP",
      progress: 100,
      imagePath: "./perfil-1.png"
    },
    {
      name: "Kanna",
      description: "Level 10",
      sub: "Mensagens",
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
        { label: "#1", value: "VIP 7 dias" },
        { label: "#2", value: "VIP 3 dias" }
      ]
    }
  ],
  options: {
    compact: false,
    showImages: true,
    showProgress: true
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./rank-list.png"
  }
});

const result = await renderCard(card);
```

## Template `music/player`

Template oficial:

```txt
ID: music/player
Template interno: music-midnight-mono-player
Categoria: music
Obrigatório: title
Tamanho padrão: 900x340
```

Card de música com capa quadrada, título, artista, tempos e barra.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `title` | título da música |
| `subtitle` | subtítulo/artista |
| `music.title` | alias para título |
| `music.artist` | alias para subtítulo |
| `music.duration` | pode ser usado como texto auxiliar via configuração |
| `cover` | capa |
| `background` | fundo |
| `card` | painel principal |
| `text` | textos |
| `progress` | barra |
| `shadow`, `fonts` | estilo |
| `output` | saída |

### `cover`

| Campo | Efeito |
|---|---|
| `cover.enabled` | liga/desliga capa |
| `cover.path` / `cover.imagePath` | imagem da capa |
| `cover.opacity` | opacidade da imagem |
| `cover.frameX`, `frameY`, `frameWidth`, `frameHeight` | posição e tamanho do frame |
| `cover.frameRadius` | arredondamento do frame |
| `cover.frameFill` | cor do frame |
| `cover.frameBorderColor`, `frameBorderOpacity`, `frameBorderWidth` | borda do frame |
| `cover.x`, `cover.y`, `cover.width`, `cover.height` | imagem interna |
| `cover.radius` | arredondamento da imagem |
| `cover.overlayColor`, `cover.overlayOpacity` | overlay na capa |
| `cover.placeholderText` | texto quando não há capa |
| `cover.placeholderColor`, `cover.placeholderOpacity` | estilo do placeholder |

### `text`

| Campo | Efeito |
|---|---|
| `text.badge.value` | etiqueta superior |
| `text.title.value` | título |
| `text.subtitle.value` | subtítulo |
| `text.timeStart.value` | tempo inicial |
| `text.timeEnd.value` | tempo final |
| `text.timeOpacity` | opacidade dos tempos |

### `progress`

| Campo | Efeito |
|---|---|
| `progress.value` | progresso de 0 a 100 |
| `progress.x`, `progress.y` | posição |
| `progress.width`, `progress.height` | tamanho |
| `progress.radius` | arredondamento |
| `progress.startColor`, `progress.endColor` | gradiente do progresso |
| `progress.trackColor`, `progress.trackOpacity` | trilha |
| `progress.handleColor`, `progress.handleRadius` | bolinha do progresso |

Exemplo:

```js
const card = createCard("music/player", {
  title: "Minha música",
  subtitle: "Meu artista",
  cover: {
    imagePath: "./cover.png"
  },
  text: {
    timeStart: { value: "0:00" },
    timeEnd: { value: "5:00" }
  },
  progress: {
    value: 38
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./music-player.png"
  }
});

const result = await renderCard(card);
```

## Template `music/orbit`

Template oficial:

```txt
ID: music/orbit
Template interno: orbit_mono_player
Categoria: music
Obrigatório: title
Tamanho padrão: 960x340
```

Card de música com capa circular/orbital.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `title` | título |
| `subtitle` | artista/subtítulo |
| `cover` | capa circular |
| `background` | fundo |
| `card` | painel principal |
| `textColors` | cores globais de texto |
| `text` | textos |
| `tag` | etiqueta superior |
| `progress` | barra |
| `bottomBlock` | bloco inferior |
| `shadow`, `fonts` | estilo |
| `output` | saída |

### `cover`

| Campo | Efeito |
|---|---|
| `cover.enabled` | liga/desliga capa |
| `cover.path` / `cover.imagePath` | imagem |
| `cover.cx`, `cover.cy` | centro |
| `cover.radius`, `cover.size` | tamanho do recorte |
| `cover.outerRadius`, `decorRadius`, `backgroundRadius` | anéis externos |
| `cover.backgroundColor` | fundo da capa |
| `cover.borderColor`, `borderOpacity`, `borderWidth` | borda |
| `cover.innerBorderColor`, `innerBorderOpacity`, `innerBorderWidth` | borda interna |
| `cover.outerRingColor`, `outerRingOpacity`, `outerRingWidth` | anel externo |
| `cover.decorColor`, `decorOpacity`, `decorBackOpacity`, `decorWidth` | detalhes orbitais |
| `cover.centerDotRadius`, `centerDotColor`, `centerDotOpacity` | ponto central |
| `cover.placeholderText`, `placeholderColor`, `placeholderOpacity`, `placeholderSize` | placeholder |

### `tag`, `progress` e `bottomBlock`

| Campo | Efeito |
|---|---|
| `tag.text` | texto da tag |
| `tag.x`, `tag.y`, `tag.width`, `tag.height`, `tag.radius` | caixa da tag |
| `tag.color`, `tag.opacity`, `tag.fontSize`, `tag.fontWeight` | texto da tag |
| `progress.value` | progresso |
| `progress.fillWidth` | largura manual do progresso |
| `progress.indicatorX`, `indicatorY`, `indicatorRadius` | indicador |
| `bottomBlock.enabled` | mostra/esconde bloco inferior |
| `bottomBlock.text` | texto inferior |
| `bottomBlock.x`, `bottomBlock.y`, `bottomBlock.width`, `bottomBlock.height` | caixa inferior |

Exemplo:

```js
const card = createCard("music/orbit", {
  title: "Minha música",
  subtitle: "Meu artista",
  cover: {
    imagePath: "./cover.png"
  },
  tag: {
    text: "MUSIC CARD"
  },
  progress: {
    value: 42
  },
  bottomBlock: {
    enabled: true,
    text: "MIDNIGHT SESSION"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./music-orbit.png"
  }
});

const result = await renderCard(card);
```

## Template `moderation/ban`

Template oficial:

```txt
ID: moderation/ban
Template interno: crimson_authority_ban
Categoria: moderation
Obrigatório: name
Tamanho padrão: 960x360
```

Card de aviso administrativo ou banimento.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | nome do usuário |
| `group` | grupo |
| `main` | texto principal |
| `moderator` | responsável pela ação |
| `moderation` | objeto extra mesclado no card |
| `avatar` | perfil do usuário |
| `background` | fundo |
| `panel` | painel principal |
| `sideBand` | faixa lateral |
| `alert` | cores do alerta |
| `icon` | ícone de alerta |
| `text` | textos principais |
| `status` | etiqueta de status |
| `reason` | motivo |
| `date` | data |
| `time` | hora |
| `sidePanel` | painel lateral |
| `watermark` | marca d'água |
| `progress` | barra decorativa |
| `shadow`, `fonts` | estilo |
| `output` | saída |

### Opções principais

| Caminho | Efeito |
|---|---|
| `text.title.value` | título do card |
| `text.userName.value` | nome renderizado |
| `text.groupName.value` | grupo renderizado |
| `status.value` | texto do status |
| `reason.value` | motivo |
| `moderator.value` | moderador |
| `date.value` | data |
| `time.value` | horário |
| `watermark.enabled` | liga/desliga marca d'água |
| `watermark.value` | texto da marca |
| `alert.color`, `alert.startColor`, `alert.endColor` | cor do alerta |
| `sideBand.width`, `sideBand.opacity` | faixa lateral |
| `icon.enabled` | liga/desliga ícone |
| `progress.value` | barra decorativa |

Exemplo:

```js
const card = createCard("moderation/ban", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  title: "Usuário banido",
  main: "Violação das regras",
  moderator: "Admin",
  avatar: {
    imagePath: "./perfil.png"
  },
  reason: {
    value: "Divulgação proibida"
  },
  date: {
    value: "29/06/2026"
  },
  time: {
    value: "20:30"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./ban.png"
  }
});

const result = await renderCard(card);
```

## Template `moderation/rank-change`

Template oficial:

```txt
ID: moderation/rank-change
Template interno: rank_shift_notice
Categoria: moderation
Obrigatório: name
Tamanho padrão: 960x360
```

Card para promoção, rebaixamento ou alteração de cargo.

### Campos aceitos

| Campo | Efeito |
|---|---|
| `name` | usuário |
| `group` | grupo |
| `oldRole` | cargo antigo |
| `newRole` | cargo novo |
| `moderator` | responsável |
| `mode` | modo da ação |
| `action.mode` | modo da ação, com prioridade sobre `mode` |
| `action.startColor`, `action.endColor` | cores da ação |
| `action.icon` | ícone da ação |
| `avatar` | perfil |
| `background` | fundo |
| `card` | painel principal |
| `sideBand` | faixa lateral |
| `actionIcon` | ícone próximo ao avatar |
| `text` | textos |
| `status` | etiqueta de status |
| `oldRoleBlock` | caixa do cargo antigo |
| `newRoleBlock` | caixa do cargo novo |
| `arrow` | seta entre cargos |
| `date`, `time` | data/hora |
| `sidePanel`, `watermark`, `progress`, `shadow`, `fonts` | estilo |
| `output` | saída |

### Modos

O template possui modo padrão `promote`. O código aceita `mode` e `action.mode`. Os exemplos do pacote usam `promote`; outros valores podem cair no comportamento padrão do renderer se não tiverem tratamento visual específico.

Exemplo:

```js
const card = createCard("moderation/rank-change", {
  name: "Lucas",
  group: "Grupo do tmxcards",
  mode: "promote",
  oldRole: "Membro",
  newRole: "Admin",
  moderator: "Dono",
  avatar: {
    imagePath: "./perfil.png"
  },
  output: {
    format: "png",
    returnType: "file",
    path: "./rank-change.png"
  }
});

const result = await renderCard(card);
```

## Criador de cards customizados

Quando o ID não existe no registry oficial, `createCard()` cria um card dinâmico.

```js
const card = createCard("custom/neon-dashboard", {
  width: 980,
  height: 420,
  radius: 38,
  title: "Painel",
  subtitle: "Card customizado",
  elements: []
});
```

### Configuração base do card dinâmico

| Campo | Efeito |
|---|---|
| `width` | largura |
| `height` | altura |
| `radius` | raio base |
| `background` | fundo e padrão |
| `panel` | painel automático |
| `theme` | cores e fonte |
| `avatar` | avatar automático |
| `text` | textos padrão |
| `badges` | etiquetas |
| `stats` | estatísticas |
| `elements` | elementos SVG manuais |
| `progress` | barra automática |
| `output` | saída |

### `background`

| Campo | Efeito |
|---|---|
| `background.startColor` / `background.endColor` | gradiente de fundo |
| `background.overlayColor` | cor do overlay |
| `background.overlayOpacity` | intensidade do overlay |
| `background.opacity` | opacidade da imagem de fundo |
| `background.pattern` | padrão de fundo: `grid`, `stars`, `dots`, `lines` ou `none` |
| `background.gridSize` | tamanho da grade quando usa `grid` |
| `background.blur` | blur do fundo, quando há imagem |
| `background.imagePath`, `path`, `url`, `imageUrl`, `dataUri`, `buffer` | imagem de fundo |

### `theme`

| Campo | Efeito |
|---|---|
| `theme.accentColor` | cor inicial do destaque |
| `theme.accentEndColor` | cor final do destaque |
| `theme.primaryColor` | texto principal |
| `theme.secondaryColor` | texto secundário |
| `theme.mutedColor` | texto discreto |
| `theme.borderColor` | bordas |
| `theme.fontFamily` | fonte |

### `panel`

| Campo | Efeito |
|---|---|
| `panel.enabled` | liga/desliga painel |
| `panel.x`, `panel.y` | posição |
| `panel.width`, `panel.height` | tamanho |
| `panel.radius` | arredondamento |
| `panel.color`, `panel.opacity` | preenchimento |
| `panel.borderColor`, `panel.borderOpacity` | borda |

### `avatar`

| Campo | Efeito |
|---|---|
| `avatar.enabled` | liga/desliga avatar |
| `avatar.imagePath` / `avatar.path` | imagem |
| `avatar.x`, `avatar.y` | posição |
| `avatar.size` | tamanho |
| `avatar.radius` | recorte circular |
| `avatar.placeholderText` | letra/texto quando não há imagem |
| `avatar.opacity` | opacidade |

### `progress`

| Campo | Efeito |
|---|---|
| `progress.enabled` | liga/desliga barra automática |
| `progress.value` | valor atual |
| `progress.max` | valor máximo |
| `progress.x`, `progress.y` | posição |
| `progress.width`, `progress.height` | tamanho |
| `progress.radius` | arredondamento |
| `progress.backgroundColor`, `progress.backgroundOpacity` | fundo |
| `progress.startColor`, `progress.endColor` | cores |
| `progress.label` | texto acima da barra |

### `elements[]`

`elements` permite desenhar manualmente partes do card. Cada elemento tem `type`.

Tipos suportados:

| `type` | Efeito |
|---|---|
| `text` | texto SVG |
| `group` ou `g` | grupo com `children` |
| `rect` | retângulo |
| `panel` | retângulo de painel |
| `glass` | painel translúcido |
| `circle` | círculo |
| `line` ou `divider` | linha |
| `path` | caminho SVG |
| `image` | imagem |
| `avatar` | avatar circular |
| `progress` | barra |
| `list` | lista de textos |
| `table` | tabela simples |

Campos comuns de elemento:

| Campo | Efeito |
|---|---|
| `x`, `y`, `width`, `height` | posição e tamanho |
| `opacity` | opacidade |
| `fill` / `color` | preenchimento |
| `stroke` | borda |
| `strokeWidth` | largura da borda |
| `strokeOpacity` | opacidade da borda |
| `filter` | filtro SVG |
| `transform` | transformação SVG |
| `className` / `class` | classe |
| `id` | ID |
| `fontFamily` / `font` | fonte |
| `fontSize` | tamanho da fonte |
| `fontWeight` / `weight` | peso da fonte |
| `letterSpacing` | espaçamento |
| `textAnchor` / `anchor` | alinhamento de texto |

### Exemplo customizado com `elements`

```js
const card = createCard("custom/neon-dashboard", {
  width: 980,
  height: 420,
  radius: 38,
  background: {
    startColor: "#030303",
    endColor: "#18181B",
    overlayOpacity: 0.18,
    pattern: "stars"
  },
  theme: {
    accentColor: "#A855F7",
    accentEndColor: "#22D3EE",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D4D4D8"
  },
  elements: [
    {
      type: "glass",
      x: 32,
      y: 32,
      width: 916,
      height: 356,
      radius: 32
    },
    {
      type: "avatar",
      x: 64,
      y: 90,
      size: 120,
      imagePath: "./perfil.png"
    },
    {
      type: "text",
      x: 220,
      y: 118,
      text: "Dashboard custom",
      fontSize: 38,
      fontWeight: 900,
      fill: "#FFFFFF"
    },
    {
      type: "progress",
      x: 220,
      y: 250,
      width: 600,
      value: 72,
      max: 100,
      label: "Progresso"
    }
  ],
  output: {
    format: "png",
    returnType: "file",
    path: "./custom-dashboard.png"
  }
});

const result = await renderCard(card);
```

## Estrutura recomendada de uso

### 1. Escolha um template oficial

```js
const info = getCardInfo("welcome/dark");

if (!info) {
  throw new Error("Template não encontrado.");
}
```

### 2. Monte a configuração

```js
const config = {
  name: "Lucas",
  group: "Meu grupo",
  avatar: {
    imagePath: "./perfil.png"
  },
  output: {
    format: "png",
    returnType: "buffer"
  }
};
```

### 3. Crie e renderize

```js
const card = createCard("welcome/dark", config);
const result = await renderCard(card);
```

### 4. Envie ou salve

```js
await sock.sendMessage(jid, {
  image: result.buffer,
  caption: "Bem-vindo!"
});
```

## Uso em bot WhatsApp

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

## Erros comuns

### `rsvg-convert não encontrado`

Instale o pacote do `rsvg-convert` no sistema e confirme com:

```bash
rsvg-convert --version
```

### `Formato não suportado`

Use somente:

```js
output: {
  format: "svg"
}
```

ou:

```js
output: {
  format: "png"
}
```

### `returnType inválido`

Use somente:

```js
returnType: "file"
returnType: "buffer"
returnType: "base64"
```

### Campos obrigatórios ausentes

Cada template oficial possui campos obrigatórios. Exemplo:

```js
createCard("rank/list", {
  items: []
});
```

`rank/list` exige `items` com pelo menos um item.

## Limitações e observações

- A API pública atual não exporta factories individuais dos templates.
- Use `createCard(id, config)` para todos os templates oficiais.
- IDs não encontrados viram cards customizados dinâmicos.
- A saída oficial atual é `svg` ou `png`.
- PNG depende do `rsvg-convert`.
- O renderizador de PNG usa o tamanho real do SVG gerado.
- `listCards()` lista somente templates oficiais.
- `getCardInfo(id)` retorna `null` para IDs customizados que não estão no registry.
- Caminhos locais de imagem são lidos e convertidos para data URI.
- Imagens locais entram no cache interno até `clearImageCache()` ser chamado.

## Desenvolvimento local

Com o repositório clonado:

```bash
npm install
npm run check
npm run check:load
npm run example:all-cards
npm pack --dry-run
```

Esses comandos são para validar o pacote localmente.

## Licença

MIT