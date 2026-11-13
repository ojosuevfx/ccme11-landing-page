import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

// Destino dos botões: a definir (documento CCME11_Pagina_AlwaysOn).
const LINK = "#";
const CTA = "Clique aqui para ter mais informações";

// Informes mensais do CCME11 à CVM, de abr/2022 a set/2026 (54 meses).
const MESES_INICIO = { ano: 2022, mes: 4 };
const PL_MI = [49.9, 50.2, 126.3, 126.6, 128.3, 254.8, 254.3, 252.1, 251.3, 251.7, 251.2, 251.4, 251.2, 304.6, 306.2, 306.4, 556.1, 555.2, 560.4, 564.1, 590.2, 593.6, 587.2, 587.1, 580.3, 721.7, 714.1, 720.7, 722.6, 715.9, 710.2, 702.1, 682.1, 684.9, 689.0, 696.6, 705.4, 707.9, 708.6, 700.8, 705.6, 710.9, 708.0, 711.7, 715.6, 719.7, 718.4, 720.8, 721.1, 723.9, 717.0, 716.5, 712.9, 714.4];
const COTISTAS = [1, 1, 4, 4, 4, 4, 4, 66, 77, 79, 79, 76, 75, 77, 146, 148, 148, 148, 155, 155, 158, 163, 233, 441, 576, 4598, 4591, 4574, 4371, 4536, 4830, 4924, 5511, 7444, 7727, 7879, 7999, 8268, 8253, 8265, 8150, 8926, 9102, 9175, 9197, 9305, 9284, 9459, 9646, 9617, 9516, 9423, 9295, 9268];

function LinhaGrafico({ dados, max, rotulo, formato }: { dados: number[]; max: number; rotulo: string; formato: (n: number) => string }) {
  const W = 520, H = 220, pl = 46, pr = 14, pt = 18, pb = 30;
  const x = (i: number) => pl + (i / (dados.length - 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - v / max) * (H - pt - pb);
  const d = dados.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${d} L${x(dados.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const anos = [2023, 2024, 2025, 2026].map((a) => ({ a, i: (a - MESES_INICIO.ano) * 12 + (1 - MESES_INICIO.mes) }));
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

function Donut() {
  const fatias = [
    { v: 61, c: "#0D233F" },
    { v: 18, c: "#1B4185" },
    { v: 13, c: "#3787BD" },
    { v: 7, c: "#A9CBEA" },
  ];
  const total = fatias.reduce((s, f) => s + f.v, 0);
  let acc = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 200 200" role="img" aria-label="Alocação da carteira: CRIs 61%, imóveis 18%, outros FIIs 13%, caixa e renda fixa 7%">
        {fatias.map((f) => {
          const el = (
            <circle key={f.c} cx="100" cy="100" r="78" fill="none" stroke={f.c} strokeWidth="34" pathLength={total} strokeDasharray={`${f.v - 0.6} ${total - f.v + 0.6}`} strokeDashoffset={-acc} transform="rotate(-90 100 100)" />
          );
          acc += f.v;
          return el;
        })}
      </svg>
      <div className="donut-c"><b>CCME11</b><span>alocação da carteira</span></div>
    </div>
  );
}

function Index() {
  const frRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = frRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const yv = Math.min(window.scrollY, 900);
        el.style.transform = `translate3d(0, ${yv * 0.08}px, 0) scale(${1 + yv * 0.00008})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const brl = (n: number) => `R$ ${Math.round(n)}`;
  const mil = (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : String(Math.round(n)));

  return (
    <div className="lp">
      <header className="topo">
        <div className="wrap">
          <img src="/assets/logo-canuma.png" alt="Canuma Capital" width={900} height={175} />
          <span className="topo-ticker">CCME11 · B3</span>
        </div>
      </header>

      <main>
        {/* DOBRA 1 - ABERTURA */}
        <section className="hero grade" id="abertura">
          <div className="wrap hero-grid">
            <div className="revela">
              <div className="hero-marca">
                <b>CCME11</b>
                <span>FII Canuma Capital<br />Multiestratégia</span>
              </div>
              <h1>Crédito imobiliário, imóveis e outros FIIs em um só fundo, com dividendos mensais</h1>
              <p className="lead">O CCME11 é um FII de gestão ativa da Canuma Capital, com mais de R$ 700 milhões em patrimônio, que combina crédito imobiliário, imóveis e outros fundos imobiliários, e reúne hoje mais de 9 mil cotistas.</p>
              <ul className="hero-stats" style={{ padding: 0 }}>
                <li><img src="/assets/icones/desconto.png" alt="" />Cota com cerca de 12% de desconto sobre o valor patrimonial</li>
                <li><img src="/assets/icones/cotistas.png" alt="" />+9 mil cotistas na B3</li>
                <li><img src="/assets/icones/cris.png" alt="" />22 CRIs em carteira, com setores diversificados</li>
              </ul>
              <a className="cta-hero" href={LINK} data-link="a definir">{CTA} <i aria-hidden="true">→</i></a>
              <p className="hero-aviso">Leia o regulamento do fundo antes de investir, especialmente os fatores de risco.</p>
            </div>
            <div className="colagem" aria-hidden="true">
              <span className="linha-cota" />
              <span className="cota c1">RESIDENCIAL · SHOPPING · ESCRITÓRIOS</span>
              <div className="fr" ref={frRef} />
            </div>
          </div>
        </section>

        {/* DOBRA 2 - O SETOR E A TESE */}
        <section className="sec planta" id="tese">
          <div className="wrap">
            <h2 className="h2" style={{ maxWidth: "16ch" }}>Os setores que mais arrecadam dinheiro no Brasil</h2>
            <div className="metrica">
              <strong>R$ 200,9 bi</strong>
              <p className="txt">Residencial, shoppings e escritórios movimentam bilhões todos os anos. Só os shoppings faturaram R$ 200,9 bilhões em 2025, recorde histórico. O CCME11 acompanha esses setores principalmente por meio de crédito imobiliário, com exposição complementar a imóveis e outros FIIs.</p>
            </div>
            <p className="fonte" style={{ marginTop: -28, marginBottom: 48 }}>Fonte: Abrasce, faturamento dos shoppings em 2025; Relatório Gerencial CCME11, Outubro/2026</p>
            <div className="cols">
              <div>
                <h3 className="h3">Adaptação ao ciclo de mercado</h3>
                <p className="txt">Na gestão ativa, a Canuma Capital pode ajustar a carteira conforme cada fase do mercado imobiliário, combinando CRIs, imóveis, outros FIIs e, quando surgem oportunidades, ações de empresas do setor.</p>
              </div>
              <div>
                <h3 className="h3">Sobre o CCME11</h3>
                <p className="txt">O CCME11 é o Canuma Capital Multiestratégia, um FII gerido pela Canuma Capital, em operação desde 13 de abril de 2022. A tese diversifica as fontes de retorno entre crédito imobiliário, imóveis, outros fundos imobiliários e ações do segmento.</p>
              </div>
            </div>
            <h3 className="h3">Histórico de crescimento do CCME11</h3>
            <div className="graficos">
              <div className="cartao-g">
                <h4>Evolução de cotistas</h4>
                <span className="sub">abr/22 a set/26 · set/26: 9.268 cotistas</span>
                <LinhaGrafico dados={COTISTAS} max={10000} rotulo="Evolução do número de cotistas do CCME11, de abril de 2022 a setembro de 2026, chegando a 9.268" formato={mil} />
              </div>
              <div className="cartao-g">
                <h4>Evolução do patrimônio líquido</h4>
                <span className="sub">R$ milhões · set/26: R$ 714,4 mi</span>
                <LinhaGrafico dados={PL_MI} max={800} rotulo="Evolução do patrimônio líquido do CCME11, de abril de 2022 a setembro de 2026, chegando a R$ 714,4 milhões" formato={brl} />
              </div>
            </div>
            <p className="fonte" style={{ marginTop: 14 }}>Fonte: Informes mensais do CCME11 à CVM, abr/2022 a set/2026</p>
            <p className="txt" style={{ margin: "34px 0 34px" }}>Hoje o fundo soma cerca de R$ 714 milhões em patrimônio líquido, valor patrimonial de aproximadamente R$ 10,54 por cota e mais de 9 mil cotistas.</p>
            <a className="cta-link" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
          </div>
        </section>

        {/* DOBRA 3 - PERFORMANCE E RENDIMENTOS */}
        <section className="dip sec-dark" id="performance">
          <div className="dip-a">
            <h2 className="h2">Performance Histórica Desde o Início</h2>
            <div className="barras-perf" role="img" aria-label="Retorno total desde o IPO: CCME11 43,1% contra 25,4% do IFIX">
              <div className="barra-p">
                <div className="rot"><span>CCME11</span><b>43,1%</b></div>
                <div className="trilho"><div className="cheio" style={{ width: "100%", background: "#3787BD" }} /></div>
              </div>
              <div className="barra-p">
                <div className="rot"><span>IFIX</span><b>25,4%</b></div>
                <div className="trilho"><div className="cheio" style={{ width: `${(25.4 / 43.1) * 100}%`, background: "#DCEBFF" }} /></div>
              </div>
            </div>
            <span className="pp">+17,7 p.p. acima do IFIX</span>
            <p className="fonte" style={{ marginTop: 26 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026. Retorno total (variação da cota patrimonial + dividendos distribuídos) de 28/10/2022 a 30/09/2026.</p>
          </div>
          <div className="dip-b">
            <h3 className="h3">Rendimento mensal</h3>
            <div className="numeral" aria-label="R$ 0,086 por cota ao mês"><small>R$</small>0,086</div>
            <p className="txt" style={{ marginTop: 18 }}>O CCME11 distribui R$ 0,086 por cota ao mês. A gestora projeta distribuição entre R$ 0,084 e R$ 0,088 por cota por mês de outubro a dezembro de 2026, com cenário base de R$ 0,086, e o fundo mantém reserva acumulada de cerca de R$ 0,082 por cota. Nos últimos 12 meses, o dividend yield foi de 12,1%.</p>
            <p className="fonte" style={{ marginTop: 12 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026; dividend yield anualizado com cota de mercado de 11/11/2026</p>
            <table className="sim">
              <caption>Simulação com o rendimento mensal</caption>
              <thead><tr><th scope="col">Cotas</th><th scope="col">Rendimento mensal</th></tr></thead>
              <tbody>
                <tr><td>100</td><td>R$ 8,60</td></tr>
                <tr><td>1.000</td><td>R$ 86,00</td></tr>
                <tr><td>10.000</td><td>R$ 860,00</td></tr>
              </tbody>
            </table>
            <p className="fonte" style={{ marginBottom: 30 }}>Simulação matemática com base em R$ 0,086 por cota, não é garantia de rendimentos futuros.</p>
            <a className="cta-moldura" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        {/* DOBRA 4 - CONHEÇA A CARTEIRA */}
        <section className="sec grade" id="carteira">
          <div className="wrap">
            <h2 className="h2">Conheça os ativos do CCME11</h2>
            <div className="carteira">
              <Donut />
              <div style={{ overflowX: "auto" }}>
                <table className="tab">
                  <thead><tr><th scope="col">Classe</th><th scope="col">Participação</th><th scope="col">Tamanho aproximado</th></tr></thead>
                  <tbody>
                    <tr><td><span className="sw" style={{ background: "#0D233F" }} />CRIs (crédito imobiliário)</td><td>61%</td><td>R$ 439 milhões</td></tr>
                    <tr><td><span className="sw" style={{ background: "#1B4185" }} />Imóveis</td><td>18%</td><td>R$ 126 milhões</td></tr>
                    <tr><td><span className="sw" style={{ background: "#3787BD" }} />Outros FIIs</td><td>13%</td><td>R$ 93 milhões</td></tr>
                    <tr><td><span className="sw" style={{ background: "#A9CBEA" }} />Caixa e renda fixa</td><td>7%</td><td>Cerca de 7% da carteira</td></tr>
                  </tbody>
                </table>
                <p className="fonte" style={{ marginTop: 14 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026 (alocação com base em 30/09/2026; percentuais arredondados)</p>
              </div>
            </div>
            <div className="desc">
              <div className="desc-a">
                <h3 className="h3">Cota com desconto patrimonial</h3>
                <p className="txt" style={{ color: "#0D233F" }}>Em 11 de novembro de 2026, a cota fechou a R$ 8,51, cerca de 19% abaixo do valor patrimonial de R$ 10,54 por cota (P/VP de 0,81x).</p>
                <p className="fonte" style={{ marginTop: 12 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026; cotação de 11/11/2026</p>
              </div>
              <div className="desc-b"><span>P/VP</span><b>0,81x</b></div>
            </div>
            <div style={{ marginTop: 44 }}>
              <a className="cta-dupla" href={LINK} data-link="a definir">{CTA}</a>
            </div>
          </div>
        </section>

        {/* DOBRA 5 - OS SETORES POR TRÁS DOS CRIs */}
        <section className="setores sec-dark" id="setores">
          <div className="wrap">
            <h2 className="h2" style={{ maxWidth: "20ch" }}>Em quais setores o CCME11 investe via <em>crédito imobiliário</em></h2>
            <div className="barras-s" role="img" aria-label="Divisão setorial da carteira de CRIs: residencial 55%, shopping centers 24%, escritórios 18%, logística 1%">
              {[
                { n: "Residencial", v: 55, ic: "residencial" },
                { n: "Shopping centers", v: 24, ic: "shopping" },
                { n: "Escritórios (lajes corporativas)", v: 18, ic: "escritorios" },
                { n: "Logística", v: 1, ic: "logistica" },
              ].map((s) => (
                <div className="barra-s" key={s.n}>
                  <img src={`/assets/icones/${s.ic}.png`} alt="" />
                  <span className="nome">{s.n}</span>
                  <div className="trilho"><div className="cheio" style={{ width: `${Math.max((s.v / 55) * 100, 1.6)}%` }} /></div>
                  <b>{s.v}%</b>
                </div>
              ))}
            </div>
            <ul className="txt" style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
              <li>Residencial: 55% da carteira de CRIs · Shopping centers: 24% · Escritórios (lajes corporativas): 18% · Logística: 1%</li>
            </ul>
            <p className="txt" style={{ marginBottom: 12 }}>A carteira reúne 22 CRIs, com juros ligados ao CDI ou ao IPCA.</p>
            <p className="fonte" style={{ paddingBottom: 72 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026 (percentuais arredondados)</p>
          </div>
          <a className="cta-banner" href={LINK} data-link="a definir">
            <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, width: "100%", padding: 0 }}>
              <span style={{ background: "none", color: "#fff", padding: 0, fontSize: 14 }}>{CTA}</span>
              <span aria-hidden="true">→</span>
            </div>
          </a>
        </section>

        {/* DOBRA 6 - COMO FUNCIONA O RENDIMENTO */}
        <section className="sec planta" id="como-funciona">
          <div className="wrap" style={{ textAlign: "center" }}>
            <h2 className="h2" style={{ maxWidth: "18ch", margin: "0 auto" }}>Como funciona o rendimento do CCME11</h2>
          </div>
          <div className="wrap">
            <ol className="fluxo" style={{ padding: 0, listStyle: "none" }}>
              <li className="estacao">
                <div className="disco"><img src="/assets/icones/grafico.png" alt="" /></div>
                <div><h3>Seleção Ativa</h3><p>A Canuma Capital identifica oportunidades em crédito imobiliário, imóveis e outros fundos imobiliários.</p></div>
              </li>
              <li className="estacao">
                <div className="disco"><img src="/assets/icones/cris.png" alt="" /></div>
                <div><h3>Fontes de Retorno</h3><p>Os CRIs geram juros ligados ao CDI ou ao IPCA, os imóveis podem gerar renda de aluguel e ganhos na venda, e os outros FIIs trazem rendimentos e potenciais resultados na venda das cotas.</p></div>
              </li>
              <li className="estacao">
                <div className="disco"><img src="/assets/icones/escritorios.png" alt="" /></div>
                <div><h3>Adaptação ao Ciclo</h3><p>A gestão ajusta a carteira conforme cada fase do mercado imobiliário.</p></div>
              </li>
              <li className="estacao final">
                <div className="disco"><img src="/assets/icones/reserva.png" alt="" /></div>
                <div><h3>Distribuição Mensal</h3><p>O resultado é distribuído mensalmente aos cotistas, com isenção de Imposto de Renda para pessoa física que atenda aos requisitos legais.</p></div>
              </li>
            </ol>
            <div style={{ textAlign: "center" }}>
              <a className="cta-pill" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        {/* DOBRA 7 - DIFERENCIAIS */}
        <section className="sec dif sec-dark" id="diferenciais">
          <div className="wrap">
            <h2 className="h2">Por que o CCME11</h2>
            <div className="bento">
              <article className="cel c1">
                <img className="ic" src="/assets/icones/grafico.png" alt="" />
                <h3>Gestão Ativa</h3>
                <p>A Canuma Capital ajusta a carteira conforme o ciclo do mercado imobiliário.</p>
              </article>
              <article className="cel c2">
                <img className="ic" src="/assets/icones/cris.png" alt="" style={{ filter: "brightness(0) invert(1)" }} />
                <h3>Diversificação</h3>
                <p>CRIs (61%), imóveis (18%), outros FIIs (13%) e caixa (7%).</p>
                <div className="pilha" aria-hidden="true">
                  <span style={{ width: "61%", background: "#0D233F" }}>61%</span>
                  <span style={{ width: "18%", background: "#3787BD" }}>18%</span>
                  <span style={{ width: "13%", background: "#A9CBEA", color: "#0D233F" }}>13%</span>
                  <span style={{ width: "8%", background: "#fff", color: "#0D233F" }}>7%</span>
                </div>
              </article>
              <div className="cel c3" role="img" aria-label="Fachada de edifício corporativo" />
              <article className="cel c4">
                <img className="ic" src="/assets/icones/residencial.png" alt="" style={{ filter: "brightness(0) invert(1)" }} />
                <h3>Crédito Imobiliário</h3>
                <p>22 CRIs entre residencial, shoppings, escritórios e logística.</p>
              </article>
              <article className="cel c5">
                <h3>Renda Mensal</h3>
                <span className="big">0,086</span>
                <p>Distribuição de R$ 0,086 por cota, com projeção de manutenção desse patamar até dezembro.</p>
              </article>
              <article className="cel c6">
                <img className="ic" src="/assets/icones/desconto.png" alt="" />
                <h3>Cota com Desconto</h3>
                <p>Cerca de 19% abaixo do valor patrimonial.</p>
              </article>
              <article className="cel c7">
                <img className="ic" src="/assets/icones/reserva.png" alt="" />
                <h3>Reserva Acumulada</h3>
                <p>Cerca de R$ 0,082 por cota.</p>
              </article>
            </div>
            <a className="cta-contorno" href={LINK} data-link="a definir">{CTA} <span aria-hidden="true">→</span></a>
            <p className="fonte" style={{ marginTop: 26 }}>Fonte: Relatório Gerencial CCME11, Outubro/2026; Desconto com base no P/VP na cotação de 11/11/2026</p>
          </div>
        </section>

        {/* DOBRA 8 - PERGUNTAS FREQUENTES */}
        <section className="sec" id="faq">
          <div className="wrap faq">
            <div className="faq-trilho"><h2 className="h2" style={{ fontSize: "clamp(28px,3.4vw,40px)" }}>Perguntas frequentes</h2></div>
            <div>
              <details open>
                <summary>O que é o CCME11? <i aria-hidden="true">+</i></summary>
                <p>FII de gestão ativa da Canuma Capital que combina crédito imobiliário, imóveis, outros fundos imobiliários e, quando surgem oportunidades, ações de empresas do setor, buscando renda mensal para os cotistas.</p>
              </details>
              <details>
                <summary>Há tributação sobre os rendimentos? <i aria-hidden="true">+</i></summary>
                <p>Para pessoa física, os rendimentos distribuídos por fundos imobiliários negociados em bolsa contam com isenção de Imposto de Renda, desde que atendidos os requisitos legais (Lei 9.779/99), como o investidor deter menos de 10% das cotas do fundo e o fundo contar com mais de 100 cotistas.</p>
              </details>
              <details>
                <summary>As cotas têm liquidez? <i aria-hidden="true">+</i></summary>
                <p>Sim. São negociadas na B3 sob o código CCME11. Volume médio diário: R$ 360 mil.</p>
              </details>
              <details>
                <summary>Quais são os riscos? <i aria-hidden="true">+</i></summary>
                <p>Como todo FII, o CCME11 está sujeito a riscos como pagamento dos devedores dos CRIs, variação do CDI e do IPCA, vacância dos imóveis e variação no preço das cotas. O desconto sobre o valor patrimonial não garante valorização da cota. Leia o regulamento antes de investir.</p>
              </details>
              <div style={{ marginTop: 40 }}>
                <a className="cta-seta" href={LINK} data-link="a definir"><b aria-hidden="true">→</b>{CTA}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* DOBRA FINAL - DISCLAIMER E RODAPÉ */}
      <footer className="rodape">
        <div className="wrap rodape-grid">
          <img src="/assets/logo-canuma-branco.png" alt="Canuma Capital" width={900} height={175} />
          <p>Este material é meramente informativo e não constitui oferta, recomendação ou solicitação para aquisição de valores mobiliários. Rentabilidade passada não representa garantia de rentabilidade futura. O investimento em fundos imobiliários não conta com garantia do administrador, do gestor, de qualquer mecanismo de seguro ou do Fundo Garantidor de Créditos – FGC. Antes de investir, leia atentamente o regulamento e os documentos do fundo. Consulte sempre um assessor de investimentos antes de tomar qualquer decisão. Administração: BTG Pactual. Gestão: Canuma Capital.</p>
        </div>
      </footer>
    </div>
  );
}
