// Gera a versão estática da página para o GitHub Pages.
//
// Uso (dentro de app/):  node scripts/gerar-pages.mjs
// Saída: app/pages-dist/  (index.html já renderizado + assets), pronta para a branch gh-pages.
//
// Como funciona: compila o site com a base /ccme11-landing-page/, sobe o `vite preview`,
// baixa o HTML já renderizado pelo servidor e junta com os arquivos de dist/client.
// No navegador o React assume a página (carrosséis, navbar, scroll suave).
import { spawn, execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const BASE = process.env.GH_PAGES_BASE ?? "/ccme11-landing-page/";
const PORTA = 4317;
const SAIDA = "pages-dist";

console.log(`compilando com base ${BASE} ...`);
execSync("bunx vite build", { stdio: "inherit", env: { ...process.env, GH_PAGES_BASE: BASE } });

const prev = spawn("bunx", ["vite", "preview", "--port", String(PORTA), "--host", "127.0.0.1", "--strictPort"], {
  env: { ...process.env, GH_PAGES_BASE: BASE },
  stdio: "ignore",
});

try {
  const url = `http://127.0.0.1:${PORTA}${BASE}`;
  let html = "";
  for (let i = 0; i < 60 && !html; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) html = await r.text();
    } catch {}
    if (!html) await new Promise((r) => setTimeout(r, 1000));
  }
  if (!html.includes("MATERIAL PUBLICITÁRIO")) throw new Error("HTML renderizado não veio completo");

  rmSync(SAIDA, { recursive: true, force: true });
  mkdirSync(SAIDA, { recursive: true });
  cpSync("dist/client", SAIDA, { recursive: true });
  writeFileSync(`${SAIDA}/index.html`, html);
  writeFileSync(`${SAIDA}/404.html`, html);
  writeFileSync(`${SAIDA}/.nojekyll`, "");
  console.log(`pronto: ${SAIDA}/ (${html.length} bytes de HTML)`);
} finally {
  prev.kill();
}
