const modal = document.getElementById('modal-maquina');
const titulo = document.getElementById('modal-titulo');
const pagesRoot = document.getElementById('modal-pages');
const indicator = modal.querySelector('.indicator');

/**
 * Tabela (Millstone) — recipe duration por item
 * Se não estiver aqui, o padrão usado é 100.
 */
const MILLSTONE_DURATION_BY_ITEM = {
  // 50
  "clay block": 50,
  "cactus": 50,
  "sea pickle": 50,
  "sugar cane": 50,

  // 70
  "bone meal": 70,
  "cocoa beans": 70,
  "beetroot": 70,

  // 100
  "wool": 100,
  "bone": 100,
  "ink sack": 100,
  "charcoal": 100,
  "coal": 100,
  "lapis lazuli": 100,
  "lilac": 100,
  "peony": 100,
  "sunflower": 100,
  "tall grass": 100,

  // 150
  "sand": 150,
  "stone": 150,
  "wheat": 150,

  // 200
  "granite": 200,
  "terracotta": 200,
  "andesite": 200,
  "gravel": 200,

  // 250
  "calcite": 250,
  "dripstone block": 250,
  "cobblestone": 250,
};

/**
 * Agrupa a tabela por duration e retorna HTML
 */
function buildMillstoneDurationTableHtml() {
  const groups = {};

  for (const [item, dur] of Object.entries(MILLSTONE_DURATION_BY_ITEM)) {
    (groups[dur] ||= []).push(item);
  }

  const orderedDurations = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  const sections = orderedDurations.map((dur) => {
    const items = groups[dur].slice().sort((a, b) => a.localeCompare(b));

    const chips = items.map((name) => {
      return `<span style="
        display:inline-block;
        padding:6px 10px;
        margin:4px 6px 0 0;
        border:1px solid rgba(43,27,18,.35);
        border-radius:999px;
        background: rgba(0,0,0,.03);
        font-size:.85rem;
      ">${escapeHtml(name)}</span>`;
    }).join("");

    return `
      <div style="margin-top:12px;">
        <div style="font-weight:900; margin-bottom:6px;">
          Duration ${dur}
        </div>
        <div style="opacity:.85; font-size:.9rem;">
          ${items.length} item(ns)
        </div>
        <div style="margin-top:8px;">
          ${chips}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div>
      <strong>Tabela de Recipe Duration (Millstone)</strong>
      <div style="margin-top:8px; font-size:.9rem; opacity:.85;">
        Esses valores são os durations conhecidos. Se o item não estiver na tabela, use <strong>100</strong> como padrão.
      </div>

      <hr style="margin:10px 0; opacity:.4;">

      ${sections}

      <hr style="margin:10px 0; opacity:.4;">

      <div style="font-size:.85rem; opacity:.75;">
        Dica: você pode digitar o duration manualmente nas outras páginas quando for um item fora da lista.
      </div>
    </div>
  `;
}

/**
 * Aqui você diferencia CADA máquina pela "estrutura":
 * - pages: lista de páginas
 * - cada page tem: title + fields (inputs) + outputId
 */
const MACHINES = {
  "Lcogwheel": {
    title: "Large Cogwheel",
    pages: [
      {
        id: "VelF",
        title: "Velocidade Final (Diminuindo)",
        fields: [
          { id: "rpm_in_D", label: "RPM de entrada", type: "number", placeholder: "Ex: 64" },
          { id: "Scog_D", label: "Cogwheel", type: "number", placeholder: "Ex: 2" },
          { id: "Lcog_D", label: "Large Cogwheel", type: "number", placeholder: "Ex: 2" },
        ],
        outputId: "out-lcog-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["Lcogwheel"], this, { id: "rpm_in_D" })
          );
          const sEl = document.getElementById(
            fieldId(MACHINES["Lcogwheel"], this, { id: "Scog_D" })
          );
          const lEl = document.getElementById(
            fieldId(MACHINES["Lcogwheel"], this, { id: "Lcog_D" })
          );
          const out = document.getElementById(this.outputId);

          const rpmIn = Number(rpmEl?.value);
          const sCog = Number(sEl?.value);
          const lCog = Number(lEl?.value);

          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM de entrada válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isFinite(sCog) || sCog < 0 || !Number.isInteger(sCog)) {
            out.innerHTML = `<strong>Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          if (!Number.isFinite(lCog) || lCog < 0 || !Number.isInteger(lCog)) {
            out.innerHTML = `<strong>Large Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          if (sCog === 0 && lCog === 0) {
            out.innerHTML = `<strong>Informe pelo menos 1 cogwheel (normal ou large).</strong>`;
            return;
          }

          const pares = Math.min(sCog, lCog); // cada par (1 small + 1 large) reduz pela metade
          const divisor = 2 ** pares;
          const rpmFinal = rpmIn / divisor;

          out.innerHTML = `
            <div style="margin-top:8px; opacity:.9;">
              RPM Final: ${rpmFinal}<br>
              ⚠ Limite Máximo = 512 RPM
            </div>
          `;
        }
      },

      {
        id: "Cogs",
        title: "Cogs necessárias (Diminuir)",
        fields: [
          { id: "rpm_in", label: "RPM inicial", type: "number", placeholder: "Ex: 64" },
          { id: "rpm_target", label: "RPM desejada", type: "number", placeholder: "Ex: 16" },
        ],
        outputId: "out-lcog-2",
        onSubmit: function () {
          const rpmInEl = document.getElementById(
            fieldId(MACHINES["Lcogwheel"], this, { id: "rpm_in" })
          );
          const rpmTargetEl = document.getElementById(
            fieldId(MACHINES["Lcogwheel"], this, { id: "rpm_target" })
          );
          const out = document.getElementById(this.outputId);

          const rpmIn = Number(rpmInEl?.value);
          const rpmTarget = Number(rpmTargetEl?.value);

          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM inicial válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isFinite(rpmTarget) || rpmTarget <= 0) {
            out.innerHTML = `<strong>Digite um RPM desejado válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isInteger(rpmIn) || !Number.isInteger(rpmTarget)) {
            out.innerHTML = `<strong>Use valores inteiros de RPM (sem casas decimais).</strong>`;
            return;
          }

          if (rpmTarget >= rpmIn) {
            out.innerHTML = `
              <div style="margin-top:8px; opacity:.9;">
                Você não precisa diminuir ✅<br>
                Pares mínimos: 0<br>
                RPM Resultante: ${rpmIn}
              </div>
            `;
            return;
          }

          const paresMinimos = Math.ceil(Math.log2(rpmIn / rpmTarget));
          const resultado = Math.floor(rpmIn / (2 ** paresMinimos));

          out.innerHTML = `
            <div style="margin-top:8px; opacity:.9;">
              Pares mínimos: ${paresMinimos}<br>
              RPM Resultante: ${resultado}
            </div>
            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Observação: a redução ocorre em potências de 2 (÷2, ÷4, ÷8...). Se não bater exato, você chega no mais próximo abaixo.
            </div>
          `;
        }
      },
    ],
  },

  "cogwheel": {
    title: "Cogwheel",
    pages: [
      {
        id: "VelF",
        title: "Velocidade Final (Aumentando)",
        fields: [
          { id: "rpm_in", label: "RPM de entrada", type: "number", placeholder: "Ex: 64" },
          { id: "Scog", label: "Cogwheel", type: "number", placeholder: "Ex: 2" },
          { id: "Lcog", label: "Large Cogwheel", type: "number", placeholder: "Ex: 2" },
        ],
        outputId: "out-cog-1",
        onSubmit: function () {
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

          const rpmIn = Number(rpmEl?.value);
          const sCog = Number(sEl?.value);
          const lCog = Number(lEl?.value);

          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM de entrada válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isFinite(sCog) || sCog < 0 || !Number.isInteger(sCog)) {
            out.innerHTML = `<strong>Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          if (!Number.isFinite(lCog) || lCog < 0 || !Number.isInteger(lCog)) {
            out.innerHTML = `<strong>Large Cogwheel precisa ser um número inteiro (0 ou maior).</strong>`;
            return;
          }

          if (sCog === 0 && lCog === 0) {
            out.innerHTML = `<strong>Informe pelo menos 1 cogwheel (normal ou large).</strong>`;
            return;
          }

          const pares = Math.min(sCog, lCog);
          const multiplicador = 2 ** pares;
          const rpmFinal = rpmIn * multiplicador;

          out.innerHTML = `
            <div style="margin-top:8px; opacity:.9;">
              RPM Final: ${rpmFinal}<br>
              ⚠ Limite Máximo = 512 RPM
            </div>
          `;
        }
      },

      {
        id: "Cogs",
        title: "Cogs necessárias (Aumentar)",
        fields: [
          { id: "rpm_in", label: "RPM inicial", type: "number", placeholder: "Ex: 64" },
          { id: "rpm_target", label: "RPM desejada", type: "number", placeholder: "Ex: 256" },
        ],
        outputId: "out-cog-2",
        onSubmit: function () {
          const rpmInEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "rpm_in" })
          );
          const rpmTargetEl = document.getElementById(
            fieldId(MACHINES["cogwheel"], this, { id: "rpm_target" })
          );
          const out = document.getElementById(this.outputId);

          const rpmIn = Number(rpmInEl?.value);
          const rpmTarget = Number(rpmTargetEl?.value);

          if (!Number.isFinite(rpmIn) || rpmIn <= 0) {
            out.innerHTML = `<strong>Digite um RPM inicial válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isFinite(rpmTarget) || rpmTarget <= 0) {
            out.innerHTML = `<strong>Digite um RPM desejado válido (maior que 0).</strong>`;
            return;
          }

          if (!Number.isInteger(rpmIn) || !Number.isInteger(rpmTarget)) {
            out.innerHTML = `<strong>Use valores inteiros de RPM (sem casas decimais).</strong>`;
            return;
          }

          if (rpmTarget <= rpmIn) {
            out.innerHTML = `
              <div style="margin-top:8px; opacity:.9;">
                Você não precisa aumentar ✅<br>
                Pares mínimos: 0<br>
                RPM Resultante: ${rpmIn}
              </div>
            `;
            return;
          }

          const paresMinimos = Math.ceil(Math.log2(rpmTarget / rpmIn));
          const resultado = rpmIn * (2 ** paresMinimos);

          out.innerHTML = `
            <div style="margin-top:8px; opacity:.9;">
              Pares mínimos: ${paresMinimos}<br>
              RPM Resultante: ${resultado}
            </div>
            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Observação: o aumento ocorre em potências de 2 (×2, ×4, ×8...). Se não bater exato, você chega no mais próximo acima.
            </div>
          `;
        }
      },
    ],
  },

  "mechanical-press": {
    title: "Mechanical Press",
    pages: [
      {
        id: "prod",
        title: "Cálculo de Produção de Itens",
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
          const tempoPorItem = 12 / denom; // segundos

          // ✅ ticks (20 ticks = 1s)
          const ticksPorItem = tempoPorItem * 20;

          const itensPorSec = 1 / tempoPorItem;
          const itensPorMin = itensPorSec * 60;
          const itensPorHora = itensPorMin * 60;

          out.innerHTML = `
            <div>
              <strong>Tempo por item</strong>
              <div>${tempoPorItem.toFixed(3)} segundos</div>
              <div style="font-size:.85rem; opacity:.7;">
                ${Math.round(ticksPorItem).toLocaleString("pt-BR")} ticks por item
              </div>
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
        title: "Cálculo do Impacto de Stress",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
          { id: "qtd", label: "Quantidade de Presses", type: "number", placeholder: "Ex: 4", min: 1, value: 1 },
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
              <strong>Stress Total</strong>
              <div>${stressTotal.toLocaleString("pt-BR")} SU</div>
            </div>
          `;
        }
      },

      {
        id: "meta",
        title: "Cálculo de Presses Necessárias",
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
          const tempoPorItem = 12 / denom; // segundos
          const ticksPorItem = tempoPorItem * 20;

          const itensPorMin = (1 / tempoPorItem) * 60;

          const pressesNecessarias = Math.ceil(meta / itensPorMin);
          const producaoTotal = pressesNecessarias * itensPorMin;

          out.innerHTML = `
            <div>
              <strong>Produção por Press</strong>
              <div>${Number(itensPorMin.toFixed(2)).toLocaleString("pt-BR")} itens / minuto</div>
              <div style="font-size:.85rem; opacity:.7;">
                ${Math.round(ticksPorItem).toLocaleString("pt-BR")} ticks por item
              </div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Presses necessárias</strong>
              <div>${pressesNecessarias.toLocaleString("pt-BR")} unidade(s)</div>
            </div>

            <div style="margin-top:10px;">
              <strong>Produção total estimada</strong>
              <div>${Number(producaoTotal.toFixed(2)).toLocaleString("pt-BR")} itens / minuto</div>
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

  "mechanical-mixer": {
    title: "Mechanical Mixer",
    pages: [
      {
        id: "prod",
        title: "Cálculo de Produção de Itens",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
        ],
        outputId: "out-mixer-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-mixer"], this, { id: "rpm" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);

          if (!Number.isFinite(rpm) || rpm <= 0) {
            out.innerHTML = "<strong>Digite um RPM válido.</strong>";
            return;
          }

          // ===== Fórmula (da imagem) em TICKS por item/receita =====
          const k = Math.abs(rpm);
          // evita log2(<=0)
          const ratio = 512 / Math.max(k, 1e-9);
          const inner = Math.floor(Math.log2(ratio)) + 1;         // floor(log2(512/|k|)) + 1
          const capped = Math.min(15 * Math.max(inner, 1), 512);  // min( 15 * max(...,1), 512 )
          const tTicks = capped + 1;                              // +1 ticks

          // ticks -> segundos (20 ticks = 1s)
          const tempoPorItem = tTicks / 20;

          const itensPorSec = 1 / tempoPorItem;
          const itensPorMin = itensPorSec * 60;
          const itensPorHora = itensPorMin * 60;

          out.innerHTML = `
            <div>
              <strong>Tempo por item</strong>
              <div>${tempoPorItem.toFixed(3)} s (${tTicks} ticks)</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Produção</strong>
              <div>${itensPorSec.toFixed(4)} itens / segundo</div>
              <div>${itensPorMin.toFixed(2).toLocaleString("pt-BR")} itens / minuto</div>
              <div>${Math.round(itensPorHora).toLocaleString("pt-BR")} itens / hora</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Fórmula baseada em ticks (Create). Acima de 512 RPM, o comportamento fica limitado.
            </div>
          `;
        }
      },

      {
        id: "stress",
        title: "Cálculo do Impacto de Stress",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
          { id: "qtd", label: "Quantidade de Mixers", type: "number", placeholder: "Ex: 4", min: 1, value: 1 },
        ],
        outputId: "out-mixer-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-mixer"], this, { id: "rpm" })
          );
          const qtdEl = document.getElementById(
            fieldId(MACHINES["mechanical-mixer"], this, { id: "qtd" })
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

          const stressPorMixer = 4 * rpm;
          const stressTotal = stressPorMixer * qtd;

          out.innerHTML = `
            <div>
              <strong>Stress por Mixer</strong>
              <div>${stressPorMixer.toLocaleString("pt-BR")} SU</div>
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
        title: "Cálculo de Mixers Necessários",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 128" },
          { id: "meta", label: "Meta (itens/min)", type: "number", placeholder: "Ex: 1000" },
        ],
        outputId: "out-mixer-3",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-mixer"], this, { id: "rpm" })
          );
          const metaEl = document.getElementById(
            fieldId(MACHINES["mechanical-mixer"], this, { id: "meta" })
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

          // ===== mesma fórmula (ticks) =====
          const k = Math.abs(rpm);
          const ratio = 512 / Math.max(k, 1e-9);
          const inner = Math.floor(Math.log2(ratio)) + 1;
          const capped = Math.min(15 * Math.max(inner, 1), 512);
          const tTicks = capped + 1;

          const tempoPorItem = tTicks / 20;
          const itensPorMin = (1 / tempoPorItem) * 60;

          const mixersNecessarios = Math.ceil(meta / itensPorMin);
          const producaoTotal = mixersNecessarios * itensPorMin;

          out.innerHTML = `
            <div>
              <strong>Produção por Mixer</strong>
              <div>${itensPorMin.toFixed(2).toLocaleString("pt-BR")} itens / minuto</div>
              <div style="font-size:.85rem; opacity:.7;">(${tTicks} ticks por item)</div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Mixers necessários</strong>
              <div>${mixersNecessarios.toLocaleString("pt-BR")} unidade(s)</div>
            </div>

            <div style="margin-top:10px;">
              <strong>Produção total estimada</strong>
              <div>${producaoTotal.toFixed(2).toLocaleString("pt-BR")} itens / minuto</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Dica: aumente o RPM para reduzir a quantidade de Mixers necessários.
            </div>
          `;
        }
      },
    ],
  },

  "encased-fan": {
    title: "Encased Fan",
    pages: [
      {
        id: "ticks",
        title: "Produção por Ticks",
        fields: [
          { id: "qtd", label: "Quantidade de itens", type: "number", placeholder: "Ex: 512" },
          { id: "stack", label: "Stack size (16 / 32 / 48 / 64)", type: "number", placeholder: "Ex: 64", min: 1, max: 64, value: 64 },
          { id: "fans", label: "Quantidade de Fans", type: "number", placeholder: "Ex: 4", min: 1, value: 1 },
        ],
        outputId: "out-fan-ticks",
        onSubmit: function () {
          const qtdEl = document.getElementById(
            fieldId(MACHINES["encased-fan"], this, { id: "qtd" })
          );
          const stackEl = document.getElementById(
            fieldId(MACHINES["encased-fan"], this, { id: "stack" })
          );
          const fansEl = document.getElementById(
            fieldId(MACHINES["encased-fan"], this, { id: "fans" })
          );
          const out = document.getElementById(this.outputId);

          const qtdItens = Number(qtdEl?.value);
          const stackInput = Number(stackEl?.value);
          const fans = Number(fansEl?.value);

          if (!Number.isFinite(qtdItens) || qtdItens <= 0) {
            out.innerHTML = "<strong>Digite uma quantidade válida de itens.</strong>";
            return;
          }

          if (!Number.isFinite(stackInput) || stackInput < 1 || stackInput > 64 || !Number.isInteger(stackInput)) {
            out.innerHTML = "<strong>Stack size precisa ser um inteiro entre 1 e 64.</strong>";
            return;
          }

          if (!Number.isFinite(fans) || fans <= 0 || !Number.isInteger(fans)) {
            out.innerHTML = "<strong>Quantidade de Fans precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const stack =
            stackInput <= 16 ? 16 :
              stackInput <= 32 ? 32 :
                stackInput <= 48 ? 48 :
                  64;

          const ticksPorStack =
            stack === 16 ? 150 :
              stack === 32 ? 300 :
                stack === 48 ? 450 :
                  600;

          const stacksNecessarios = Math.ceil(qtdItens / stack);
          const ticksTotais = Math.ceil((stacksNecessarios * ticksPorStack) / fans);

          const segundos = ticksTotais / 20;
          const minutos = segundos / 60;

          out.innerHTML = `
            <div>
              <strong>Resumo do processamento</strong>
              <div style="margin-top:6px;">
                Itens: ${qtdItens.toLocaleString("pt-BR")}<br>
                Stack considerado: ${stack}<br>
                Fans: ${fans}
              </div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Resultado</strong>
              <div>${ticksTotais.toLocaleString("pt-BR")} ticks totais</div>
              <div>${segundos.toFixed(2)} segundos</div>
              <div>${minutos.toFixed(2)} minutos</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              O Encased Fan processa por <strong>stack</strong>. Fans adicionais apenas dividem o tempo total.
            </div>
          `;
        }
      },
    ],
  },

  "millstone": {
    title: "Millstone",
    pages: [
      {
        id: "prod",
        title: "Cálculo de Produção (por Receita)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
          { id: "duration", label: "Recipe Duration", type: "number", placeholder: "Ex: 100", min: 1, value: 100 },
        ],
        outputId: "out-mill-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "rpm" })
          );
          const durEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "duration" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const recipeDuration = Number(durEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(recipeDuration) || recipeDuration <= 0 || !Number.isInteger(recipeDuration)) {
            out.innerHTML = "<strong>Recipe Duration precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const mpfRaw = Math.abs(rpm / 16);
          const mpf = Math.min(512, Math.max(1, mpfRaw)); // clamp 1..512

          const ticksPorReceita = Math.ceil(recipeDuration / mpf) + 1;
          const segundosPorReceita = ticksPorReceita / 20;

          const receitasPorSec = 20 / ticksPorReceita;
          const receitasPorMin = receitasPorSec * 60;
          const receitasPorHora = receitasPorMin * 60;

          out.innerHTML = `
            <div>
              <strong>Tempo por receita</strong>
              <div>${segundosPorReceita.toFixed(3)} s</div>
              <div style="font-size:.85rem; opacity:.7;">
                ${ticksPorReceita.toLocaleString("pt-BR")} ticks / receita
              </div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Produção</strong>
              <div>${receitasPorSec.toFixed(3)} receita(s) / segundo</div>
              <div>${receitasPorMin.toFixed(2).toLocaleString("pt-BR")} receita(s) / minuto</div>
              <div>${Math.round(receitasPorHora).toLocaleString("pt-BR")} receita(s) / hora</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              mpf = |RPM/16| (clamp 1..512) • gt/recipe = ceil(duration/mpf)+1
            </div>
          `;
        }
      },

      {
        id: "meta",
        title: "Cálculo por Quantidade (ticks totais)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64" },
          { id: "duration", label: "Recipe Duration", type: "number", placeholder: "Ex: 100", min: 1, value: 100 },
          { id: "qtd", label: "Quantidade de itens", type: "number", placeholder: "Ex: 512", min: 1, value: 64 },
          { id: "machines", label: "Quantidade de Millstones", type: "number", placeholder: "Ex: 2", min: 1, value: 1 },
        ],
        outputId: "out-mill-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "rpm" })
          );
          const durEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "duration" })
          );
          const qtdEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "qtd" })
          );
          const macEl = document.getElementById(
            fieldId(MACHINES["millstone"], this, { id: "machines" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const recipeDuration = Number(durEl?.value);
          const qtd = Number(qtdEl?.value);
          const machines = Number(macEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(recipeDuration) || recipeDuration <= 0 || !Number.isInteger(recipeDuration)) {
            out.innerHTML = "<strong>Recipe Duration precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(qtd) || qtd <= 0 || !Number.isInteger(qtd)) {
            out.innerHTML = "<strong>Quantidade de itens precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(machines) || machines <= 0 || !Number.isInteger(machines)) {
            out.innerHTML = "<strong>Quantidade de Millstones precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const mpfRaw = Math.abs(rpm / 16);
          const mpf = Math.min(512, Math.max(1, mpfRaw));

          const ticksPorReceita = Math.ceil(recipeDuration / mpf) + 1;

          const ticksTotais = Math.ceil((ticksPorReceita * qtd) / machines);
          const segundosTotais = ticksTotais / 20;
          const minutosTotais = segundosTotais / 60;

          out.innerHTML = `
            <div>
              <strong>Resumo</strong>
              <div style="margin-top:6px;">
                Itens: ${qtd.toLocaleString("pt-BR")}<br>
                Millstones: ${machines}<br>
                Ticks/receita: ${ticksPorReceita.toLocaleString("pt-BR")}
              </div>
            </div>

            <hr style="margin:10px 0; opacity:.4;">

            <div>
              <strong>Tempo total</strong>
              <div>${ticksTotais.toLocaleString("pt-BR")} ticks</div>
              <div>${segundosTotais.toFixed(2)} s</div>
              <div>${minutosTotais.toFixed(2)} min</div>
            </div>

            <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
              Considera ${machines} Millstone(s) em paralelo (divide o tempo).
            </div>
          `;
        }
      },

      // ✅ TERCEIRA PÁGINA DEMONSTRATIVA (sem inputs)
      {
        id: "tabela",
        title: "Tabela de Durations (Demo)",
        fields: [],
        outputId: "out-mill-3",
        onSubmit: function () {
          const out = document.getElementById(this.outputId);
          out.innerHTML = buildMillstoneDurationTableHtml();
        }
      },
    ],
  },

  // As outras máquinas você pode ir preenchendo aos poucos:
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
