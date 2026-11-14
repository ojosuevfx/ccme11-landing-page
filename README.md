# CCME11 · Página Always On

Landing page do CCME11 (FII Canuma Capital Multiestratégia). É material publicitário: a estrutura e os textos seguem o documento `CCME11_Pagina_AlwaysOn.docx`, a paleta e o logo vêm do site oficial (ccme11.com.br) e o estilo visual veio do modelo em vídeo (LP KEEPIT).

O site é publicado pelo Higgsfield em https://ccme11-alwayson.higgsfield.app (privado, só abre com login no Higgsfield).

## Estrutura

```
app/
  src/routes/index.tsx   a página inteira (8 dobras + disclaimer)
  src/landing.css        todo o visual da página (cores, layout, animações)
  src/routes/__root.tsx  <head>: título, fontes (Sora + IBM Plex Mono), favicon, OG
  src/app-meta.json      título e imagem de compartilhamento
  public/assets/         imagens usadas na página (geradas no Higgsfield) e logo Canuma
  design-brief.md        decisões de design (v1 e v2)
  packages/              pacotes do Higgsfield que vêm com o projeto (não mexer)
refs/                    referências de design e imagens que não entram no site
```

## Rodar localmente

Precisa de [Bun](https://bun.sh).

```bash
cd app
bun install
bun run dev
```

## GitHub Pages

Versão pública: https://ojosuevfx.github.io/ccme11-landing-page/ (servida pela branch `gh-pages`).

Para atualizar depois de uma mudança:

```bash
cd app
node scripts/gerar-pages.mjs     # gera app/pages-dist com a base /ccme11-landing-page/
```

Depois envie o conteúdo de `app/pages-dist/` para a branch `gh-pages` (substituindo tudo).

## Publicar uma alteração no Higgsfield

O deploy é feito pelo Higgsfield, a partir do repositório dele. Depois de alterar aqui, as mudanças precisam ser levadas para o projeto `ccme11-alwayson` no Higgsfield e publicadas de novo (o Claude faz isso).

## Pendências

- Destino de todos os botões "Clique aqui para ter mais informações" (hoje apontam para `#`, com `data-link="a definir"`).
- Série mensal do gráfico CCME11 x IFIX desde 13/04/2022 (hoje mostra só o retorno total desde o IPO, 28/10/2022).

## Fontes dos dados

- Cotistas e patrimônio líquido: informes mensais do CCME11 à CVM (abr/2022 a set/2026).
- Retorno x IFIX, carteira, setores, rendimento: Relatório Gerencial CCME11, Outubro/2026.
