const modal = document.getElementById('modal-maquina');
const titulo = document.getElementById('modal-titulo');
const pagesRoot = document.getElementById('modal-pages');
const indicator = modal.querySelector('.indicator');

/**
 * Aqui você diferencia CADA máquina pela "estrutura":
 * - pages: lista de páginas
 * - cada page tem: title + fields (inputs) + outputId
 *
 * Você NÃO precisa escrever cálculo aqui agora.
 * Depois você só adiciona "onSubmit" em cada página.
 */
const MACHINES = {
  "speedometer": {
    title: "Speedometer",
    pages: [
      {
        id: "read",
        title: "Leitura",
        description: "Mostra RPM/velocidade atual do eixo.",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
        ],
        outputId: "out-speedometer-1",
        onSubmit: null, // depois você coloca a função
      },
    ],
  },

  "mechanical-press": {
    title: "Mechanical Press",
    pages: [
      {
        id: "prod",
        title: "Produção",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
        ],
        outputId: "out-press-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-press"], this, { id: "rpm" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);

          if (!Number.isFinite(rpm) || rpm <= 0) {
            out.innerHTML = "<strong>Digite um RPM válido.</strong>";
            return;
          }

          const clamp = Math.min(1, Math.abs(rpm) / 512);
          const denom = 1 + (clamp * 59);
          const tempoPorItem = 12 / denom;

          const itensPorSec = 1 / tempoPorItem;
          const itensPorMin = itensPorSec * 60;
          const itensPorHora = itensPorMin * 60;

          out.innerHTML = `
            <div>
              <strong>Tempo por item</strong>
              <div>${tempoPorItem.toFixed(3)} segundos</div>
            </div>
                  
            <hr style="margin:10px 0; opacity:.4;">
                  
            <div>
              <strong>Produção</strong>
              <div>${itensPorSec.toFixed(3)} itens / segundo</div>
              <div>${Math.round(itensPorMin).toLocaleString("pt-BR")} itens / minuto</div>
              <div>${Math.round(itensPorHora).toLocaleString("pt-BR")} itens / hora</div>
            </div>
                  
            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Limite máximo atingido acima de 512 RPM
            </div>
          `;
        }

      },
      {
        id: "stress",
        title: "Stress",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
          { id: "qtd", label: "Quantidade", type: "number", placeholder: "Ex: 4", min: 1, value: 1 },
        ],
        outputId: "out-press-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-press"], this, { id: "rpm" })
          );
          const qtdEl = document.getElementById(
            fieldId(MACHINES["mechanical-press"], this, { id: "qtd" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const qtd = Number(qtdEl?.value);

          if (!Number.isFinite(rpm) || rpm <= 0) {
            out.innerHTML = "<strong>Digite um RPM válido.</strong>";
            return;
          }

          if (!Number.isFinite(qtd) || qtd <= 0) {
            out.innerHTML = "<strong>Digite uma quantidade válida.</strong>";
            return;
          }

          const stressPorPress = 8 * rpm;
          const stressTotal = stressPorPress * qtd;

          out.innerHTML = `
            <div>
              <strong>Stress por Press</strong>
              <div>${stressPorPress.toLocaleString("pt-BR")} SU</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Configuração</strong>
              <div>${qtd} Press${qtd > 1 ? "es" : ""}</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Stress Total</strong>
              <div>${stressTotal.toLocaleString("pt-BR")} SU</div>
            </div>
          `;

        }

      },
      {
        id: "meta",
        title: "Meta",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 128" },
          { id: "meta", label: "Meta (itens/min)", type: "number", placeholder: "Ex: 1000" },
        ],
        outputId: "out-press-3",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-press"], this, { id: "rpm" })
          );
          const metaEl = document.getElementById(
            fieldId(MACHINES["mechanical-press"], this, { id: "meta" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const meta = Number(metaEl?.value);

          if (!Number.isFinite(rpm) || rpm <= 0) {
            out.innerHTML = "<strong>Digite um RPM válido.</strong>";
            return;
          }

          if (!Number.isFinite(meta) || meta <= 0) {
            out.innerHTML = "<strong>Digite uma meta válida.</strong>";
            return;
          }

          const clamp = Math.min(1, Math.abs(rpm) / 512);
          const denom = 1 + (clamp * 59);
          const tempoPorItem = 12 / denom;

          const itensPorMin = (1 / tempoPorItem) * 60;

          const pressesNecessarias = Math.ceil(meta / itensPorMin);
          const producaoTotal = pressesNecessarias * itensPorMin;

          out.innerHTML = `
            <div>
              <strong>Produção por Press</strong>
              <div>${itensPorMin.toFixed(1).toLocaleString("pt-BR")} itens / minuto</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Meta informada</strong>
              <div>${meta.toLocaleString("pt-BR")} itens / minuto</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Presses necessárias</strong>
              <div>${pressesNecessarias.toLocaleString("pt-BR")} unidade(s)</div>
            </div>

            <div style="margin-top:10px;">
              <strong>Produção total estimada</strong>
              <div>${producaoTotal.toFixed(1).toLocaleString("pt-BR")} itens / minuto</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Dica: aumente o RPM para reduzir a quantidade de Presses necessárias.
            </div>
          `;
        }

      },
    ],
  },

  "mechanical-crafter": {
    title: "Mechanical Crafter",
    pages: [
      {
        id: "ticks",
        title: "Ticks por Receita",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
        ],
        outputId: "out-crafter-1",
        onSubmit: null,
      },
      {
        id: "rate",
        title: "Receitas por Tempo",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 128" },
        ],
        outputId: "out-crafter-2",
        onSubmit: null,
      },
    ],
  },

  "cogwheel": {
    title: "Cogwheel",
    pages: [
      {
        id: "VelF",
        title: "Relação / Velocidade Final",
        fields: [
          { id: "rpm_in", label: "RPM de entrada", type: "number", placeholder: "Ex: 64" },
          { id: "Scog", label: "Cogwheel", type: "number", placeholder: "Ex: 2" },
          { id: "Lcog", label: "Large Cogwheel", type: "number", placeholder: "Ex: 2" },
        ],
        outputId: "out-cog-1",
        onSubmit: function () {
          // pega elementos
          const rpmEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "rpm_in" })
          );
          const sEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "Scog" })
          );
          const lEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "Lcog" })
          );
          const out = document.getElementById(this.outputId);

          // lê valores
          const rpmIn = Number(rpmEl?.value);
          const sCog = Number(sEl?.value);
          const lCog = Number(lEl?.value);

          // validações: RPM
          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM de entrada válido (maior que 0).</strong>`;
            return;
          }

          // validações: quantidades
          if (!Number.isFinite(sCog) || sCog < 0 || !Number.isInteger(sCog)) {
            out.innerHTML = `<strong>Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          if (!Number.isFinite(lCog) || lCog < 0 || !Number.isInteger(lCog)) {
            out.innerHTML = `<strong>Large Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          // validação: não pode ser tudo zero
          if (sCog === 0 && lCog === 0) {
            out.innerHTML = `<strong>Informe pelo menos 1 cogwheel (normal ou large).</strong>`;
            return;
          }
          const pares = Math.min(sCog, lCog)
          const multiplicador = Math.pow(2, pares)
          const rpmFinal = rpmIn * multiplicador
          
          out.innerHTML = `
                            <div style="margin-top:8px; opacity:.9;">
                              RPM Final: ${rpmFinal}<br>
                              ⚠ Límite Máximo = 512 RPM
                            </div>
                          `;
        }

      },
      {
        id: "Cogs",
        title: "Relação / Cogs necessárias",
        fields: [
          { id: "rpm_in", label: "RPM inicial", type: "number", placeholder: "Ex: 64" },
          { id: "Scog", label: "RPM Desejada", type: "number", placeholder: "Ex: 256" },
        ],
        outputId: "out-cog-2",
        onSubmit: function () {
          const rpmInEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "rpm_in" })
          );
          const rpmTargetEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "Scog" }) // (melhor seria "rpm_target")
          );
          const out = document.getElementById(this.outputId);

          const rpmIn = Number(rpmInEl?.value);
          const rpmTarget = Number(rpmTargetEl?.value);

          // ===== validações: RPM inicial =====
          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM inicial válido (maior que 0).</strong>`;
            return;
          }

          // ===== validações: RPM desejada =====
          if (!Number.isFinite(rpmTarget) || rpmTarget <= 0) {
            out.innerHTML = `<strong>Digite um RPM desejado válido (maior que 0).</strong>`;
            return;
          }

          // (opcional, mas recomendado) - só aceitar inteiros
          if (!Number.isInteger(rpmIn) || !Number.isInteger(rpmTarget)) {
            out.innerHTML = `<strong>Use valores inteiros de RPM (sem casas decimais).</strong>`;
            return;
          }

          // ===== validação lógica: precisa aumentar ou reduzir? =====
          if (rpmTarget === rpmIn) {
            out.innerHTML = `
                              <div><strong>Você já está no RPM desejado ✅</strong></div>
                              <div style="margin-top:8px; opacity:.9;">
                                RPM inicial: ${rpmIn.toLocaleString("pt-BR")}<br>
                                RPM desejado: ${rpmTarget.toLocaleString("pt-BR")}
                              </div>
                              <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
                                Resultado: nenhuma relação de engrenagens necessária (multiplicador 1x).
                              </div>
                            `;
            return;
          }

          const pares = Math.log2(rpmTarget/rpmIn)
          out.innerHTML = `
                            <div style="margin-top:8px; opacity:.9;">
                              Pares de cogs necessários: ${pares}
                            </div>
                            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
                              Próximo passo: calcular quantos pares (1 cog + 1 large) você precisa para chegar no RPM desejado.
                            </div>
                          `;
        }


      }

      ,
    ],
  },

  // As outras máquinas você pode ir preenchendo aos poucos:
  "mechanical-mixer": { title: "Mechanical Mixer", pages: [basicRPMPage("out-mixer-1")] },
  "encased-fan": { title: "Encased Fan", pages: [basicRPMPage("out-fan-1")] },
  "millstone": { title: "Millstone", pages: [basicRPMPage("out-mill-1")] },
  "crushing-wheel": { title: "Crushing Wheel", pages: [basicRPMPage("out-crush-1")] },
  "deployer": { title: "Deployer", pages: [basicRPMPage("out-deploy-1")] },
  "mechanical-belt": { title: "Mechanical Belt", pages: [basicRPMPage("out-belt-1")] },
  "water-wheel": { title: "Water Wheel", pages: [basicRPMPage("out-water-1")] },
  "steam-engine": { title: "Steam Engine", pages: [basicRPMPage("out-steam-1")] },
};

function basicRPMPage(outputId) {
  return {
    id: "main",
    title: "Configuração",
    fields: [{ id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" }],
    outputId,
    onSubmit: null,
  };
}

/** =========================
 *  ABRIR MODAL
 *  ========================= */
function AbrirPorCard(cardEl) {
  const key = cardEl.dataset.machine;
  const def = MACHINES[key];

  modal.dataset.machine = key;
  titulo.textContent = def?.title || "Máquina";

  renderModalPages(def);
  irParaPagina(1);
  modal.showModal();
}

// Event delegation pros botões "Veja"
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-ver');
  if (!btn) return;

  const card = btn.closest('.card');
  if (!card) return;

  AbrirPorCard(card);
});

/** =========================
 *  RENDERIZAR PÁGINAS DINÂMICAS
 *  ========================= */
function renderModalPages(machineDef) {
  pagesRoot.innerHTML = "";

  if (!machineDef || !machineDef.pages?.length) {
    pagesRoot.innerHTML = `<div class="page active" data-page="1">
      <h2>Sem configuração</h2>
      <p>Essa máquina ainda não foi configurada.</p>
    </div>`;
    indicator.textContent = `1/1`;
    return;
  }

  machineDef.pages.forEach((pageDef, idx) => {
    const pageNumber = idx + 1;

    const fieldsHtml = (pageDef.fields || []).map((f) => {
      const attrs = [
        `id="${fieldId(machineDef, pageDef, f)}"`,
        `type="${f.type || 'text'}"`,
        f.placeholder ? `placeholder="${escapeHtml(f.placeholder)}"` : "",
        f.min != null ? `min="${f.min}"` : "",
        f.max != null ? `max="${f.max}"` : "",
        f.value != null ? `value="${f.value}"` : "",
      ].filter(Boolean).join(" ");

      return `
        <label for="${fieldId(machineDef, pageDef, f)}">${escapeHtml(f.label || f.id)}</label>
        <input ${attrs} />
      `;
    }).join("");

    const description = pageDef.description
      ? `<p class="page-desc">${escapeHtml(pageDef.description)}</p>`
      : "";

    pagesRoot.innerHTML += `
      <div class="page ${pageNumber === 1 ? 'active' : ''}" data-page="${pageNumber}">
        <h2>${escapeHtml(pageDef.title || `Página ${pageNumber}`)}</h2>
        ${description}
        <div class="form-grid">
          ${fieldsHtml}
        </div>

        <div class="output" id="${escapeHtml(pageDef.outputId || `out-${pageNumber}`)}"></div>

        <button class="btn-calc" type="button" data-action="calc">
          <span>Calcular</span>
        </button>
      </div>
    `;
  });

  indicator.textContent = `1/${machineDef.pages.length}`;
}

function fieldId(machineDef, pageDef, fieldDef) {
  // ID único por máquina/página/campo para não colidir
  const key = modal.dataset.machine || machineDef?.title || "machine";
  const pid = pageDef.id || "page";
  const fid = fieldDef.id || "field";
  return `f__${key}__${pid}__${fid}`;
}

/** =========================
 *  PAGINAÇÃO
 *  ========================= */
function irParaPagina(numero) {
  modal.dataset.page = String(numero);

  const total = getTotalPages();
  pagesRoot.querySelectorAll('.page').forEach((p) => {
    p.classList.toggle('active', p.dataset.page == numero);
  });

  indicator.textContent = `${numero}/${total}`;
}

function getTotalPages() {
  const key = modal.dataset.machine;
  const def = MACHINES[key];
  return Math.max(1, def?.pages?.length || 1);
}

modal.querySelector('.prev').addEventListener('click', () => mudarPagina(-1));
modal.querySelector('.next').addEventListener('click', () => mudarPagina(+1));

function mudarPagina(delta) {
  const total = getTotalPages();
  const atual = Number(modal.dataset.page || 1);
  const prox = ((atual - 1 + delta + total) % total) + 1;
  irParaPagina(prox);
}

/** =========================
 *  BOTÃO CALCULAR (placeholder)
 *  ========================= */
pagesRoot.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="calc"]');
  if (!btn) return;

  const key = modal.dataset.machine;
  const def = MACHINES[key];
  const pageIndex = Number(modal.dataset.page || 1) - 1;
  const pageDef = def?.pages?.[pageIndex];
  if (!pageDef) return;

  if (typeof pageDef.onSubmit === "function") {
    pageDef.onSubmit.call(pageDef);
    return;
  }

  const out = document.getElementById(pageDef.outputId);
  if (out) out.innerHTML = `<strong>Sem cálculo configurado nesta página.</strong>`;
});


/** =========================
 *  FECHAR MODAL
 *  ========================= */
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.open) modal.close();
});

/** =========================
 *  Utils
 *  ========================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
