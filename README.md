# Fredo — site institucional

Landing page do Fredo (IoT + Hardware as a Service para restaurantes).
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Motion.

## Rodar localmente

Requer Node.js 20.9 ou superior.

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # inicia em modo desenvolvimento
```

Abra http://localhost:3000.

## Outros comandos

| Comando         | O que faz                                  |
| --------------- | ------------------------------------------ |
| `npm run build` | Gera a versão de produção                  |
| `npm start`     | Serve a versão de produção (após o build)  |
| `npm run lint`  | Verifica o código com ESLint               |
| `npx tsc --noEmit` | Verifica os tipos TypeScript            |

## Onde editar

- **Textos**: `src/content/site.ts`. Todo o conteúdo fica aqui. Os trechos marcados como
  PROVISÓRIO são genéricos e devem ser revisados pela equipe antes de publicar.
- **Cores, fontes e animações base**: `src/app/globals.css` (bloco `@theme`).
- **Seções**: `src/components/sections/`.
- **SEO**: `src/app/layout.tsx` (metadados), `robots.ts`, `sitemap.ts`.

## Antes de publicar

1. **URL do site**: defina a variável `NEXT_PUBLIC_SITE_URL` (ex.: `https://fredo.com.br`)
   para que canonical, sitemap e Open Graph usem o domínio correto.
2. **WhatsApp comercial**: número e mensagens ficam em `src/lib/whatsapp.ts`. O formulário
   valida os campos no navegador e abre o WhatsApp com os dados; nada é salvo no site.
3. **Conteúdo**: revise os textos provisórios e, se quiser, adicione uma imagem de
   compartilhamento (`src/app/opengraph-image.png`).

## Imagens do Fredo

- **Originais (não editar):** `images/fredo/original/`
- **Versões tratadas:** `public/fredo/`
  - `fredo-hero-escuro.jpg/.webp`: Versão A, cenário escuro 16:9 (1920×1080)
  - `fredo-isolado.png/.webp`: Versão B, fundo transparente
  - `fredo-estudio-claro.jpg/.webp`: Versão C, estúdio claro (1600×1200)
- **Prévia de compartilhamento:** `src/app/opengraph-image.png` (1200×630)

As versões são geradas por `npm run images:fredo` (script `scripts/fredo-images.mjs`).
O script só recorta o fundo, ajusta levemente contraste e nitidez e monta os cenários:
nenhuma IA generativa é usada, então o produto fica idêntico à foto original.

A animação do topo está em `src/components/fredo-product-hero.tsx` (componente `FredoProductHero`).

## Vídeo

- Original: `images/fredo_hero.mp4` (não editar).
- Usado no site: `public/fredo/video/fredo-em-acao.mp4` + capa `fredo-em-acao-poster.jpg`.
- Seção: `src/components/sections/video-showcase.tsx`. Textos e caminhos em `videoShowcase` (`src/content/site.ts`).
- O vídeo só é baixado quando a seção se aproxima, toca sem som enquanto está visível e pausa fora da tela.

## Fred.o animado (topo do site)

O robô do topo é um trecho do vídeo (6,0 s a 12,6 s, em loop) com o fundo azul removido:

- `public/fredo/animacao/fredo-animado.webm`: Chrome, Edge, Firefox e Android (897 KB, com transparência)
- `public/fredo/animacao/fredo-animado.webp`: Safari e iPhone (WebP animado, 1,1 MB)
- `public/fredo/animacao/fredo-animado-poster.png`: capa estática, aparece na hora e com "reduzir movimento"

Componente: `src/components/fredo-animated.tsx`. Cada navegador baixa só um dos formatos,
depois que a página termina de carregar. A animação pausa quando sai da tela.

Para refazer (precisa do Microsoft Edge instalado), use os scripts em `scripts/fredo-animacao/`:
1. `node scripts/fredo-animacao/1-recortar-quadros.mjs images/fredo_hero.mp4 <pasta> 6.0 13.6 15`
2. `node scripts/fredo-animacao/2-gravar-webm.mjs <pasta> public/fredo/animacao/fredo-animado.webm "video/webm;codecs=vp9" 2500000`
3. `node scripts/fredo-animacao/3-gerar-webp-e-capa.mjs <pasta> public/fredo/animacao`

## Telas reais do Fred.o

- Fotos originais (não editar): `images/telas/`
- Versões tratadas usadas no site: `public/fredo/telas/` (balança, comanda, processando, concluído e o detalhe peso + total)
- Para refazer: `node scripts/telas-fredo.mjs`. O script endireita a tela, uniformiza a luz e limpa o moiré
  do fundo branco, sem alterar textos, números ou desenhos. A foto usada para cada estado fica no início do script.
