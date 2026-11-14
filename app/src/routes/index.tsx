import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

// Destino dos botões: a definir (documento CCME11_Pagina_AlwaysOn).
const LINK = "#";
const CTA = "Clique aqui para ter mais informações";
const vi = (i: number) => ({ "--i": i }) as CSSProperties;
// Base do endereço: "/" no Higgsfield, "/ccme11-landing-page/" no GitHub Pages.
const BASE = import.meta.env.BASE_URL;
const a = (p: string) => `${BASE}${p}`;

// Informes mensais do CCME11 à CVM, de abr/2022 a set/2026 (54 meses).
const INICIO = { ano: 2022, mes: 4 };
const PL_MI = [49.9, 50.2, 126.3, 126.6, 128.3, 254.8, 254.3, 252.1, 251.3, 251.7, 251.2, 251.4, 251.2, 304.6, 306.2, 306.4, 556.1, 555.2, 560.4, 564.1, 590.2, 593.6, 587.2, 587.1, 580.3, 721.7, 714.1, 720.7, 722.6, 715.9, 710.2, 702.1, 682.1, 684.9, 689.0, 696.6, 705.4, 707.9, 708.6, 700.8, 705.6, 710.9, 708.0, 711.7, 715.6, 719.7, 718.4, 720.8, 721.1, 723.9, 717.0, 716.5, 712.9, 714.4];
const COTISTAS = [1, 1, 4, 4, 4, 4, 4, 66, 77, 79, 79, 76, 75, 77, 146, 148, 148, 148, 155, 155, 158, 163, 233, 441, 576, 4598, 4591, 4574, 4371, 4536, 4830, 4924, 5511, 7444, 7727, 7879, 7999, 8268, 8253, 8265, 8150, 8926, 9102, 9175, 9197, 9305, 9284, 9459, 9646, 9617, 9516, 9423, 9295, 9268];

function LinhaGrafico({ dados, max, rotulo, formato }: { dados: number[]; max: number; rotulo: string; formato: (n: number) => string }) {
  const W = 520, H = 220, pl = 46, pr = 14, pt = 18, pb = 30;
  const x = (i: number) => pl + (i / (dados.length - 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - v / max) * (H - pt - pb);
  const d = dados.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${d} L${x(dados.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const anos = [2023, 2024, 2025, 2026].map((a) => ({ a, i: (a - INICIO.ano) * 12 + (1 - INICIO.mes) }));
  const ult = dados.length - 1;
  return (
    <svg className="linha-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={rotulo} style={{ width: "100%", height: "auto", display: "block" }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="rgba(13,35,63,.08)" />
          <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="#6B7C8F">{formato(t)}</text>
        </g>
      ))}
      {anos.map(({ a, i }) => (
        <text key={a} x={x(i)} y={H - 10} textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="#6B7C8F">jan/{String(a).slice(2)}</text>
      ))}
      <path d={area} fill="rgba(55,135,189,.10)" />
      <path className="l" d={d} pathLength={1} fill="none" stroke="#1B4185" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx={x(ult)} cy={y(dados[ult])} r="5" fill="#3787BD" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

const FATIAS = [
  { nome: "CRIs (crédito imobiliário)", v: 61, tam: "R$ 439 milhões", c: "#0D233F", ic: "cris" },
  { nome: "Imóveis", v: 18, tam: "R$ 126 milhões", c: "#1B4185", ic: "residencial" },
  { nome: "Outros FIIs", v: 13, tam: "R$ 93 milhões", c: "#3787BD", ic: "grafico" },
  { nome: "Caixa e renda fixa", v: 7, tam: "Cerca de 7% da carteira", c: "#A9CBEA", ic: "reserva" },
];

function Donut() {
  const total = FATIAS.reduce((s, f) => s + f.v, 0);
  let acc = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 200 200" role="img" aria-label="Alocação da carteira: CRIs 61%, imóveis 18%, outros FIIs 13%, caixa e renda fixa 7%">
        {FATIAS.map((f) => {
          const el = (
            <circle key={f.c} className="f" cx="100" cy="100" r="76" fill="none" stroke={f.c} strokeWidth="30" pathLength={total} strokeDasharray={`${f.v - 0.6} ${total - f.v + 0.6}`} strokeDashoffset={-acc} transform="rotate(-90 100 100)" />
          );
          acc += f.v;
          return el;
        })}
      </svg>
      <div className="donut-c"><b>CCME11</b><span>alocação da carteira</span></div>
    </div>
  );
}

const SETORES = [
  { nome: "Residencial", v: 55, txt: "55% da carteira de CRIs", img: "residencial", ic: "residencial" },
  { nome: "Shopping centers", v: 24, txt: "24%", img: "shopping", ic: "shopping" },
  { nome: "Escritórios (lajes corporativas)", v: 18, txt: "18%", img: "escritorios", ic: "escritorios" },
  { nome: "Logística", v: 1, txt: "1%", img: "logistica", ic: "logistica" },
];

function rolarPara(pista: HTMLElement, item: HTMLElement, centro: boolean) {
  const rp = pista.getBoundingClientRect();
  const ri = item.getBoundingClientRect();
  const alvo = pista.scrollLeft + (ri.left - rp.left) - (centro ? (rp.width - ri.width) / 2 : 0);
  const max = pista.scrollWidth - pista.clientWidth;
  pista.scrollTo({ left: Math.max(0, Math.min(max, alvo)), behavior: "smooth" });
}

function useIndiceAtivo(ref: RefObject<HTMLDivElement | null>, centro: boolean) {
  const [estado, setEstado] = useState({ ativo: 0, inicio: true, fim: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const medir = () => {
      const rp = el.getBoundingClientRect();
      const ref0 = centro ? rp.left + rp.width / 2 : rp.left;
      let melhor = 0, dist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const r = (c as HTMLElement).getBoundingClientRect();
        const d = Math.abs((centro ? r.left + r.width / 2 : r.left) - ref0);
        if (d < dist) { dist = d; melhor = i; }
      });
      const max = el.scrollWidth - el.clientWidth;
      setEstado({ ativo: melhor, inicio: el.scrollLeft <= 2, fim: el.scrollLeft >= max - 2 });
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(medir); };
    medir();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [ref, centro]);
  return estado;
}

function CarrosselSetores() {
  const pista = useRef<HTMLDivElement>(null);
  const { ativo, inicio, fim } = useIndiceAtivo(pista, true);
  const ir = (i: number) => {
    const el = pista.current;
    if (!el) return;
    const n = Math.max(0, Math.min(SETORES.length - 1, i));
    const card = el.children[n] as HTMLElement | undefined;
    if (card) rolarPara(el, card, true);
  };
  return (
    <div className="carrossel" role="region" aria-roledescription="carrossel" aria-label="Divisão setorial da carteira de CRIs">
      <div className="c-pista" ref={pista}>
        {SETORES.map((s, i) => (
          <article className="c-card" key={s.nome} data-ativo={String(i === ativo)} aria-label={`${s.nome}: ${s.v}%`}>
            <img src={`${BASE}assets/setor-${s.img}.webp`} alt="" loading="lazy" />
            <div className="c-corpo">
              <img className="ic" src={`${BASE}assets/icones/${s.ic}.png`} alt="" />
              <h3>{s.nome}</h3>
              <b>{s.v}%</b>
              <div className="bar"><i style={{ width: `${Math.max((s.v / 55) * 100, 2)}%` }} /></div>
              <p>{s.nome}: {s.txt}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="c-ctrl">
        <button className="s" type="button" onClick={() => ir(ativo - 1)} disabled={inicio} aria-label="Setor anterior">←</button>
        <div className="pontos">
          {SETORES.map((s, i) => (
            <button key={s.nome} type="button" aria-label={`Ir para ${s.nome}`} aria-current={i === ativo} onClick={() => ir(i)} />
          ))}
        </div>
        <button className="s" type="button" onClick={() => ir(ativo + 1)} disabled={fim} aria-label="Próximo setor">→</button>
      </div>
    </div>
  );
}

function TrilhoFotos() {
  const ref = useRef<HTMLDivElement>(null);
  const { ativo, inicio, fim } = useIndiceAtivo(ref, false);
  const mover = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const n = Math.max(0, Math.min(el.children.length - 1, ativo + dir));
    rolarPara(el, el.children[n] as HTMLElement, false);
  };
  return (
    <div className="trilho-wrap">
      <div className="trilho" ref={ref}>
        <figure><img src={a("assets/setor-residencial.webp")} alt="Edifício residencial" loading="lazy" /><figcaption>Residencial</figcaption></figure>
        <figure><img src={a("assets/setor-shopping.webp")} alt="Interior de shopping center" loading="lazy" /><figcaption>Shoppings</figcaption></figure>
        <figure><img src={a("assets/setor-escritorios.webp")} alt="Torres de escritórios" loading="lazy" /><figcaption>Escritórios</figcaption></figure>
        <figure><img src={a("assets/setor-logistica.webp")} alt="Galpão logístico" loading="lazy" /><figcaption>Logística</figcaption></figure>
      </div>
      <button className="seta-nav esq" type="button" onClick={() => mover(-1)} disabled={inicio} aria-label="Fotos anteriores">←</button>
      <button className="seta-nav dir" type="button" onClick={() => mover(1)} disabled={fim} aria-label="Próximas fotos">→</button>
    </div>
  );
}

// Uma âncora para cada dobra do documento (a abertura é o próprio logo).
const SECOES = [
  { id: "tese", nome: "A tese" },
  { id: "performance", nome: "Performance" },
  { id: "carteira", nome: "Carteira" },
  { id: "setores", nome: "Setores" },
  { id: "como-funciona", nome: "Como funciona" },
  { id: "diferenciais", nome: "Diferenciais" },
  { id: "faq", nome: "Perguntas" },
];

function Navbar() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);
  return (
    <header className="topo" data-aberto={aberto}>
      <div className="wrap">
        <a href="#abertura" className="topo-logo" aria-label="Canuma Capital, voltar ao início" onClick={() => setAberto(false)}>
          <img src={a("assets/logo-canuma.png")} alt="" width={900} height={175} />
        </a>
        <nav className="nav" id="menu-secoes" aria-label="Seções da página">
          {SECOES.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-secao={s.id} onClick={() => setAberto(false)}>{s.nome}</a>
          ))}
        </nav>
        <span className="topo-tk">CCME11 · B3</span>
        <button className="menu-bt" type="button" aria-expanded={aberto} aria-controls="menu-secoes" aria-label={aberto ? "Fechar menu" : "Abrir menu"} onClick={() => setAberto((v) => !v)}>
          <i /><i />
        </button>
      </div>
    </header>
  );
}

function Index() {
  const raiz = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = raiz.current;
    if (!root) return;
    const hero = root.querySelector<HTMLElement>("[data-hero]");
    const alvos = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll]"));
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".nav a[data-secao]"));
    let raf = 0;
    const tick = () => {
      const vh = window.innerHeight;
      if (hero) {
        const r = hero.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        hero.style.setProperty("--h", p.toFixed(4));
      }
      for (const el of alvos) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.6)));
        el.style.setProperty("--p", p.toFixed(4));
      }
      // Marca na navbar a seção que está na tela.
      let atual = "";
      for (const s of SECOES) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= vh * 0.4) atual = s.id;
      }
      for (const a of links) {
        if (a.dataset.secao === atual) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Scroll suave (Lenis). Carregado só no navegador, para não quebrar o SSR.
    // Os efeitos de rolagem são recalculados dentro do próprio quadro do Lenis.
    let vivo = true;
    let loop = 0;
    let lenis: import("lenis").default | null = null;
    void import("lenis").then(({ default: Lenis }) => {
      if (!vivo) return;
      // anchors: os links da navbar rolam suave; o espaço do cabeçalho fixo vem do scroll-margin-top das seções.
      const l = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95, anchors: true });
      l.on("scroll", tick);
      const quadro = (t: number) => {
        l.raf(t);
        loop = requestAnimationFrame(quadro);
      };
      loop = requestAnimationFrame(quadro);
      lenis = l;
    });

    return () => {
      vivo = false;
      cancelAnimationFrame(loop);
      lenis?.destroy();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const brl = (n: number) => `R$ ${Math.round(n)}`;
  const mil = (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : String(Math.round(n)));

  return (
    <div className="lp" ref={raiz}>
      <div className="tarja" role="note">MATERIAL PUBLICITÁRIO</div>
      <Navbar />

      <main>
        {/* DOBRA 1 - ABERTURA */}
        <section className="hero" data-hero id="abertura">
          <div className="palco">
            <div className="hero-txt">
              <span className="selo"><b>CCME11</b>FII Canuma Capital Multiestratégia</span>
              <h1>Crédito imobiliário, imóveis e outros FIIs <em>em um só fundo, com dividendos mensais</em></h1>
              <p className="lead">O CCME11 é um FII de gestão ativa da Canuma Capital, com mais de R$ 700 milhões em patrimônio, que combina crédito imobiliário, imóveis e outros fundos imobiliários, e reúne hoje mais de 9 mil cotistas.</p>
              <a className="b-hero" href={LINK} data-link="a definir">{CTA} <i aria-hidden="true">→</i></a>
            </div>
            <div className="letras" aria-hidden="true">CCME11</div>
            <img className="predios" src={a("assets/hero-predios.webp")} alt="" width={1344} height={752} fetchPriority="high" />
          </div>
        </section>
        <div className="faixa">
          <ul>
            <li><img src={a("assets/icones/desconto.png")} alt="" />Cota com cerca de 12% de desconto sobre o valor patrimonial</li>
            <li><img src={a("assets/icones/cotistas.png")} alt="" />+9 mil cotistas na B3</li>
            <li><img src={a("assets/icones/cris.png")} alt="" />22 CRIs em carteira, com setores diversificados</li>
          </ul>
        </div>
        <p className="aviso">Leia o regulamento do fundo antes de investir, especialmente os fatores de risco.</p>

        {/* DOBRA 2 - O SETOR E A TESE */}
        <section className="sec" id="tese">
          <div className="wrap">
            <div className="dividido">
              <h2 className="tt">Os setores que mais <em>arrecadam dinheiro</em> no Brasil</h2>
              <div>
                <p className="txt">Residencial, shoppings e escritórios movimentam bilhões todos os anos. Só os shoppings faturaram R$ 200,9 bilhões em 2025, recorde histórico. O CCME11 acompanha esses setores principalmente por meio de crédito imobiliário, com exposição complementar a imóveis e outros FIIs.</p>
                <p className="fonte" style={{ marginTop: 12 }}>Fonte: Abrasce, faturamento dos shoppings em 2025; Relatório Gerencial CCME11, Outubro/2026</p>
              </div>
            </div>
            <div className="juntos" data-scroll>
              <article className="junto surge" style={vi(0)}>
                <img src={a("assets/icones/shopping.png")} alt="" />
                <div className="numero">R$ 200,9 bi</div>
                <p>Shoppings em 2025, recorde histórico.</p>
              </article>
              <article className="junto surge" style={vi(1)}>
                <img src={a("assets/icones/grafico.png")} alt="" />
                <h3>Adaptação ao ciclo de mercado</h3>
                <p>Na gestão ativa, a Canuma Capital pode ajustar a carteira conforme cada fase do mercado imobiliário, combinando CRIs, imóveis, outros FIIs e, quando surgem oportunidades, ações de empresas do setor.</p>
              </article>
              <article className="junto surge" style={vi(2)}>
                <img src={a("assets/icones/cris.png")} alt="" />
                <h3>Sobre o CCME11</h3>
                <p>O CCME11 é o Canuma Capital Multiestratégia, um FII gerido pela Canuma Capital, em operação desde 13 de abril de 2022. A tese diversifica as fontes de retorno entre crédito imobiliário, imóveis, outros fundos imobiliários e ações do segmento.</p>
              </article>
            </div>
          </div>
          <TrilhoFotos />
          <div className="wrap" style={{ marginTop: 88 }}>
            <h2 className="tt" style={{ fontSize: "clamp(26px,3vw,38px)" }}>Histórico de <em>crescimento</em> do CCME11</h2>
            <div className="graficos" data-scroll>
              <div className="cartao-g surge" style={vi(0)}>
                <h4>Evolução de cotistas</h4>
                <span className="sub">abr/22 a set/26 · set/26: 9.268 cotistas</span>
                <LinhaGrafico dados={COTISTAS} max={10000} rotulo="Evolução do número de cotistas do CCME11, de abril de 2022 a setembro de 2026, chegando a 9.268" formato={mil} />
              </div>
              <div className="cartao-g surge" style={vi(1)}>
                <h4>Evolução do patrimônio líquido</h4>
                <span className="sub">R$ milhões · set/26: R$ 714,4 mi</span>
                <LinhaGrafico dados={PL_MI} max={800} rotulo="Evolução do patrimônio líquido do CCME11, de abril de 2022 a setembro de 2026, chegando a R$ 714,4 milhões" formato={brl} />
              </div>
            </div>
            <p className="fonte" style={{ marginTop: 14 }}>Fonte: Informes mensais do CCME11 à CVM, abr/2022 a set/2026</p>
            <p className="txt" style={{ margin: "30px 0 32px", fontSize: 18, color: "#0D233F" }}>Hoje o fundo soma cerca de R$ 714 milhões em patrimônio líquido, valor patrimonial de aproximadamente R$ 10,54 por cota e mais de 9 mil cotistas.</p>
            <a className="b-contorno" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
          </div>
        </section>

        {/* DOBRA 3 - PERFORMANCE E RENDIMENTOS */}
        <section className="sec perf" id="performance">
          <div className="wrap">
            <div className="centro">
              <h2 className="tt">Performance Histórica <em>Desde o Início</em></h2>
            </div>
            <div className="perf-card" data-scroll>
              <span className="pp">+17,7 p.p. acima do IFIX</span>
              <div role="img" aria-label="Retorno total desde o IPO: CCME11 43,1% contra 25,4% do IFIX">
                <div className="barra-p">
                  <div className="r"><span>CCME11</span><b>43,1%</b></div>
                  <div className="t"><div className="c" style={{ width: "100%", background: "linear-gradient(90deg,#1B4185,#3787BD)" }} /></div>
                </div>
                <div className="barra-p">
                  <div className="r"><span>IFIX</span><b style={{ color: "#6B7C8F" }}>25,4%</b></div>
                  <div className="t"><div className="c" style={{ width: `${(25.4 / 43.1) * 100}%`, background: "#A9CBEA" }} /></div>
                </div>
              </div>
              <p className="fonte">Fonte: Relatório Gerencial CCME11, Outubro/2026. Retorno total (variação da cota patrimonial + dividendos distribuídos) de 28/10/2022 a 30/09/2026.</p>
            </div>

            <div className="rend">
              <div>
                <span className="rot">RENDIMENTO MENSAL</span>
                <h3 className="tt" style={{ fontSize: "clamp(26px,3vw,38px)", marginTop: 10 }}>R$ 0,086 por cota <em>ao mês</em></h3>
                <p className="txt" style={{ marginTop: 18 }}>O CCME11 distribui R$ 0,086 por cota ao mês. A gestora projeta distribuição entre R$ 0,084 e R$ 0,088 por cota por mês de outubro a dezembro de 2026, com cenário base de R$ 0,086, e o fundo mantém reserva acumulada de cerca de R$ 0,082 por cota. Nos últimos 12 meses, o dividend yield foi de 12,1%.</p>
                <p className="fonte" style={{ marginTop: 12 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026; dividend yield anualizado com cota de mercado de 11/11/2026</p>
                <h4 style={{ margin: "40px 0 0", fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase" }}>Simulação com o rendimento mensal</h4>
                <ol className="passos" data-scroll>
                  {[
                    { c: "100", v: "R$ 8,60" },
                    { c: "1.000", v: "R$ 86,00" },
                    { c: "10.000", v: "R$ 860,00" },
                  ].map((l, i) => (
                    <li className="surge" style={vi(i)} key={l.c}>
                      <span className="n" aria-hidden="true">{i + 1}</span>
                      <span className="c">Cotas<b>{l.c}</b></span>
                      <span className="v"><small>Rendimento mensal</small>{l.v}</span>
                    </li>
                  ))}
                </ol>
                <p className="fonte" style={{ margin: "14px 0 30px" }}>Simulação matemática com base em R$ 0,086 por cota, não é garantia de rendimentos futuros.</p>
                <a className="b-seta" href={LINK} data-link="a definir"><i aria-hidden="true">→</i>{CTA}</a>
              </div>
              <div data-scroll>
                <div className="mao">
                  <img src={a("assets/celular.webp")} alt="" width={700} height={946} loading="lazy" />
                  <div className="tela" aria-hidden="true">
                    <span>RENDIMENTO MENSAL</span>
                    <b>0,086</b>
                    <small>R$ por cota ao mês</small>
                    <i>CCME11</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOBRA 4 - CONHEÇA A CARTEIRA */}
        <section className="sec" id="carteira">
          <div className="wrap">
            <h2 className="tt">Conheça os ativos <em>do CCME11</em></h2>
            <div className="painel" data-scroll>
              <div className="painel-donut"><Donut /></div>
              <div className="classes">
                <div className="classes-cab"><span>CLASSE · PARTICIPAÇÃO</span><span>TAMANHO APROXIMADO</span></div>
                {FATIAS.map((f, i) => (
                  <article className="classe surge" style={vi(i)} key={f.nome}>
                    <img src={`${BASE}assets/icones/${f.ic}.png`} alt="" width={36} height={36} />
                    <h3><span className="sw" style={{ background: f.c }} />{f.nome}</h3>
                    <b>{f.v}%</b>
                    <p>{f.tam}</p>
                  </article>
                ))}
              </div>
            </div>
            <p className="fonte" style={{ marginTop: 14 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026 (alocação com base em 30/09/2026; percentuais arredondados)</p>
            <div className="desconto">
              <div>
                <h3>Cota com desconto patrimonial</h3>
                <p className="txt" style={{ color: "#0D233F" }}>Em 11 de novembro de 2026, a cota fechou a R$ 8,51, cerca de 19% abaixo do valor patrimonial de R$ 10,54 por cota (P/VP de 0,81x).</p>
                <p className="fonte" style={{ marginTop: 10 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026; cotação de 11/11/2026</p>
              </div>
              <div className="pvp"><span>P/VP</span><b>0,81x</b></div>
            </div>
            <div style={{ marginTop: 40 }}>
              <a className="b-cheio" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <div className="passagem" aria-hidden="true"><span>↓</span></div>

        <div className="escuro">
          {/* DOBRA 5 - OS SETORES POR TRÁS DOS CRIs */}
          <section className="sec" id="setores">
            <div className="wrap centro">
              <h2 className="tt" style={{ maxWidth: "22ch", margin: "0 auto" }}>Em quais setores o CCME11 investe via <em>crédito imobiliário</em></h2>
            </div>
            <CarrosselSetores />
            <div className="wrap centro" style={{ marginTop: 40 }}>
              <p className="txt" style={{ margin: "0 auto" }}>A carteira reúne 22 CRIs, com juros ligados ao CDI ou ao IPCA.</p>
              <p className="fonte" style={{ margin: "10px auto 34px" }}>Fonte: Relatório Gerencial CCME11, Outubro/2026 (percentuais arredondados)</p>
              <a className="b-luz" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
            </div>
          </section>

          {/* DOBRA 6 - COMO FUNCIONA O RENDIMENTO */}
          <section className="sec" id="como-funciona" style={{ paddingTop: 40 }}>
            <div className="wrap">
              <div className="centro"><h2 className="tt">Como funciona o rendimento <em>do CCME11</em></h2></div>
              <ol className="fluxo" data-scroll>
                {[
                  { t: "Seleção Ativa", p: "A Canuma Capital identifica oportunidades em crédito imobiliário, imóveis e outros fundos imobiliários." },
                  { t: "Fontes de Retorno", p: "Os CRIs geram juros ligados ao CDI ou ao IPCA, os imóveis podem gerar renda de aluguel e ganhos na venda, e os outros FIIs trazem rendimentos e potenciais resultados na venda das cotas." },
                  { t: "Adaptação ao Ciclo", p: "A gestão ajusta a carteira conforme cada fase do mercado imobiliário." },
                  { t: "Distribuição Mensal", p: "O resultado é distribuído mensalmente aos cotistas, com isenção de Imposto de Renda para pessoa física que atenda aos requisitos legais." },
                ].map((e, i) => (
                  <li className={`etapa surge${i === 3 ? " final" : ""}`} style={vi(i)} key={e.t}>
                    <span className="n">{i + 1}</span>
                    <div><h3>{e.t}</h3><p>{e.p}</p></div>
                  </li>
                ))}
              </ol>
              <div className="centro"><a className="b-texto" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a></div>
            </div>
          </section>

          {/* DOBRA 7 - DIFERENCIAIS */}
          <section className="sec" id="diferenciais" style={{ paddingTop: 40 }}>
            <div className="wrap">
              <h2 className="tt">Por que o <em>CCME11</em></h2>
              <div className="caixa" data-scroll>
                {[
                  { ic: "grafico", t: "Gestão Ativa", p: "A Canuma Capital ajusta a carteira conforme o ciclo do mercado imobiliário." },
                  { ic: "residencial", t: "Diversificação", p: "CRIs (61%), imóveis (18%), outros FIIs (13%) e caixa (7%)." },
                  { ic: "cris", t: "Crédito Imobiliário", p: "22 CRIs entre residencial, shoppings, escritórios e logística." },
                  { ic: "cotistas", t: "Renda Mensal", p: "Distribuição de R$ 0,086 por cota, com projeção de manutenção desse patamar até dezembro." },
                  { ic: "desconto", t: "Cota com Desconto", p: "Cerca de 19% abaixo do valor patrimonial." },
                  { ic: "reserva", t: "Reserva Acumulada", p: "Cerca de R$ 0,082 por cota." },
                ].map((d, i) => (
                  <article className="dif surge" style={vi(i % 3)} key={d.t}>
                    <img src={`${BASE}assets/icones/${d.ic}.png`} alt="" />
                    <h3>{d.t}</h3>
                    <p>{d.p}</p>
                  </article>
                ))}
              </div>
              <div style={{ margin: "40px 0 22px" }}>
                <a className="b-gradiente" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
              </div>
              <p className="fonte">Fonte: Relatório Gerencial CCME11, Outubro/2026; Desconto com base no P/VP na cotação de 11/11/2026</p>
            </div>
          </section>

          {/* DOBRA 8 - PERGUNTAS FREQUENTES */}
          <section className="sec faq-s" id="faq">
            <div className="wrap">
              <div className="centro"><h2 className="tt">Perguntas <em>frequentes</em></h2></div>
              <div className="faq">
                <details open>
                  <summary>O QUE É O CCME11? <i aria-hidden="true">+</i></summary>
                  <p>FII de gestão ativa da Canuma Capital que combina crédito imobiliário, imóveis, outros fundos imobiliários e, quando surgem oportunidades, ações de empresas do setor, buscando renda mensal para os cotistas.</p>
                </details>
                <details>
                  <summary>HÁ TRIBUTAÇÃO SOBRE OS RENDIMENTOS? <i aria-hidden="true">+</i></summary>
                  <p>Para pessoa física, os rendimentos distribuídos por fundos imobiliários negociados em bolsa contam com isenção de Imposto de Renda, desde que atendidos os requisitos legais (Lei 9.779/99), como o investidor deter menos de 10% das cotas do fundo e o fundo contar com mais de 100 cotistas.</p>
                </details>
                <details>
                  <summary>AS COTAS TÊM LIQUIDEZ? <i aria-hidden="true">+</i></summary>
                  <p>Sim. São negociadas na B3 sob o código CCME11. Volume médio diário: R$ 360 mil.</p>
                </details>
                <details>
                  <summary>QUAIS SÃO OS RISCOS? <i aria-hidden="true">+</i></summary>
                  <p>Como todo FII, o CCME11 está sujeito a riscos como pagamento dos devedores dos CRIs, variação do CDI e do IPCA, vacância dos imóveis e variação no preço das cotas. O desconto sobre o valor patrimonial não garante valorização da cota. Leia o regulamento antes de investir.</p>
                </details>
                <div className="centro" style={{ marginTop: 44 }}>
                  <a className="b-luz" href={LINK} data-link="a definir" style={{ background: "#DCEBFF", color: "#0D233F" }}>{CTA} <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* DOBRA FINAL - DISCLAIMER E RODAPÉ */}
      <footer className="rodape">
        <div className="wrap">
          <img src={a("assets/logo-canuma.png")} alt="Canuma Capital" width={900} height={175} />
          <p>Este material é meramente informativo e não constitui oferta, recomendação ou solicitação para aquisição de valores mobiliários. Rentabilidade passada não representa garantia de rentabilidade futura. O investimento em fundos imobiliários não conta com garantia do administrador, do gestor, de qualquer mecanismo de seguro ou do Fundo Garantidor de Créditos – FGC. Antes de investir, leia atentamente o regulamento e os documentos do fundo. Consulte sempre um assessor de investimentos antes de tomar qualquer decisão. Administração: BTG Pactual. Gestão: Canuma Capital.</p>
        </div>
      </footer>
    </div>
  );
}
