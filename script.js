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

const CRUSHING_DURATION_BY_OUTPUT = {
  // 50
  "clay block": 50,
  "cactus": 50,
  "sea pickle": 50,
  "sugar cane": 50,
  "azure bluet": 50,
  "blue orchid": 50,
  "fern": 50,
  "large fern": 50,
  "allium": 50,
  "lily of the valley": 50,
  "rose bush": 50,
  "oxeye daisy": 50,
  "poppy": 50,
  "dandelion": 50,
  "cornflower": 50,
  "wither rose": 50,
  "orange tulip": 50,
  "red tulip": 50,
  "white tulip": 50,
  "pink tulip": 50,

  // 70
  "bone meal": 70,
  "coca beans": 70,
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
  "blaze rod": 100,

  // 150
  "sand stone": 150,
  "wheat": 150,
  "prismarine crystal": 150,
  "coal ore": 150,
  "amethist cluster": 150,
  "glowstone": 150,
  "amethist block": 150,

  // 200
  "granite": 200,
  "terracota": 200,
  "andesite": 200,
  "saddle": 200,
  "any horse armor": 200,

  // 250
  "calcite": 250,
  "dripstone block": 250,
  "cobblestone": 250,
  "gravel": 250,
  "copper ore": 250,
  "zinc ore": 250,
  "iron ore": 250,
  "gold ore": 250,
  "redstone ore": 250,
  "lapis ore": 250,
  "netherrack": 250,
  "crimsite": 250,

  // 350
  "diorite": 350,
  "tuff": 350,
  "diamond ore": 350,
  "emerald ore": 350,
  "deepslate copper ore": 350,
  "deepslate zinc ore": 350,
  "deepslate iron ore": 350,
  "deepslate gold ore": 350,
  "deepslate redstone ore": 350,
  "deepslate lapis ore": 350,
  "nether gold ore": 350,
  "nether quarts ore": 350,

  // 400
  "any raw ore": 400,

  // 450
  "deepslate Diamond Ore": 450,
  "deepslate Emerald Ore": 450,

  // 500
  "obsidian": 500,
};

function buildCrushingDurationTableHtml() {
  const groups = {};

  for (const [item, dur] of Object.entries(CRUSHING_DURATION_BY_OUTPUT)) {
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
      <strong>Tabela de Recipe Duration (Crushing Wheel)</strong>
      <div style="margin-top:8px; font-size:.9rem; opacity:.85;">
        Esses valores são os durations conhecidos. Se o output não estiver na tabela, use <strong>100</strong> como padrão.
      </div>

      <hr style="margin:10px 0; opacity:.4;">

      ${sections}

      <hr style="margin:10px 0; opacity:.4;">

      <div style="font-size:.85rem; opacity:.75;">
        Dica: se estiver usando um modpack com receitas custom, confirme no JEI / configs do Create.
      </div>
    </div>
  `;
}

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
  "crushing-wheel": {
    title: "Crushing Wheel",
    pages: [
      {
        id: "prod",
        title: "Cálculo de Produção (por Receita)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 128" },
          { id: "duration", label: "Recipe Duration", type: "number", placeholder: "Ex: 250", min: 1, value: 250 },
          { id: "stack", label: "Stack Size", type: "number", placeholder: "Ex: 64", min: 1, value: 64 },
          { id: "inputDelay", label: "Input Delay (ticks)", type: "number", placeholder: "Funil=1, Chute=3, Jogar=27", min: 0, value: 1 },
        ],
        outputId: "out-crush-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "rpm" }));
          const durEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "duration" }));
          const stackEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "stack" }));
          const delayEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "inputDelay" }));
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const recipeDuration = Number(durEl?.value);
          const stackSize = Number(stackEl?.value);
          const inputDelay = Number(delayEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(recipeDuration) || recipeDuration <= 0 || !Number.isInteger(recipeDuration)) {
            out.innerHTML = "<strong>Recipe Duration precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(stackSize) || stackSize <= 0 || !Number.isInteger(stackSize)) {
            out.innerHTML = "<strong>Stack Size precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(inputDelay) || inputDelay < 0 || !Number.isInteger(inputDelay)) {
            out.innerHTML = "<strong>Input Delay precisa ser um inteiro maior ou igual a 0.</strong>";
            return;
          }

          // --- Fórmula (baseada na wiki da Crushing Wheel) ---

          // 1) duration efetivo (a wiki mostra "recipe duration in ticks - 20")
          const durationEff = Math.max(0, recipeDuration - 20);

          // 2) rpm factor: (RPM/50) * 4
          const rpmFactor = (Math.abs(rpm) / 50) * 4;

          // 3) stack factor: log2(stack size) (clamp 1..20)
          const log2 = (n) => Math.log(n) / Math.log(2);
          const stackFactor = Math.max(1, Math.min(log2(stackSize), 20));

          // 4) speed factor: clamp (rpmFactor/stackFactor) com min 0.25 e max 20
          const speedFactor = Math.max(0.25, Math.min(rpmFactor / stackFactor, 20));

          // 5) ticks por stack (tempo de processamento)
          const ticksPorStack = Math.ceil(durationEff / speedFactor) + 1 + inputDelay;

          const segundosPorStack = ticksPorStack / 20;

          const stacksPorSec = 20 / ticksPorStack;
          const stacksPorMin = stacksPorSec * 60;
          const stacksPorHora = stacksPorMin * 60;

          out.innerHTML = `
          <div>
            <strong>Tempo por stack</strong>
            <div>${segundosPorStack.toFixed(3)} s</div>
            <div style="font-size:.85rem; opacity:.7;">
              ${ticksPorStack.toLocaleString("pt-BR")} ticks / stack
            </div>
          </div>

          <hr style="margin:10px 0; opacity:.4;">

          <div>
            <strong>Produção</strong>
            <div>${stacksPorSec.toFixed(3)} stack(s) / segundo</div>
            <div>${stacksPorMin.toFixed(2).toLocaleString("pt-BR")} stack(s) / minuto</div>
            <div>${Math.round(stacksPorHora).toLocaleString("pt-BR")} stack(s) / hora</div>
          </div>

          <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
            effDur = max(0, duration-20) • rpmF=(|rpm|/50)*4 • sF=clamp(log2(stack),1..20) • speed=max(.25,min(rpmF/sF,20))
          </div>
        `;
        }
      },

      {
        id: "meta",
        title: "Cálculo por Quantidade (tempo total)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 128" },
          { id: "duration", label: "Recipe Duration", type: "number", placeholder: "Ex: 250", min: 1, value: 250 },
          { id: "stack", label: "Stack Size", type: "number", placeholder: "Ex: 64", min: 1, value: 64 },
          { id: "inputDelay", label: "Input Delay (ticks)", type: "number", placeholder: "Funil=1, Chute=3, Jogar=27", min: 0, value: 1 },
          { id: "qtdStacks", label: "Quantidade de stacks", type: "number", placeholder: "Ex: 10", min: 1, value: 1 },
          { id: "machines", label: "Quantidade de Crushing Wheels", type: "number", placeholder: "Ex: 2", min: 1, value: 1 },
        ],
        outputId: "out-crush-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "rpm" }));
          const durEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "duration" }));
          const stackEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "stack" }));
          const delayEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "inputDelay" }));
          const qtdEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "qtdStacks" }));
          const macEl = document.getElementById(fieldId(MACHINES["crushing-wheel"], this, { id: "machines" }));
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const recipeDuration = Number(durEl?.value);
          const stackSize = Number(stackEl?.value);
          const inputDelay = Number(delayEl?.value);
          const qtdStacks = Number(qtdEl?.value);
          const machines = Number(macEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(recipeDuration) || recipeDuration <= 0 || !Number.isInteger(recipeDuration)) {
            out.innerHTML = "<strong>Recipe Duration precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(stackSize) || stackSize <= 0 || !Number.isInteger(stackSize)) {
            out.innerHTML = "<strong>Stack Size precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(inputDelay) || inputDelay < 0 || !Number.isInteger(inputDelay)) {
            out.innerHTML = "<strong>Input Delay precisa ser um inteiro maior ou igual a 0.</strong>";
            return;
          }

          if (!Number.isFinite(qtdStacks) || qtdStacks <= 0 || !Number.isInteger(qtdStacks)) {
            out.innerHTML = "<strong>Quantidade de stacks precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(machines) || machines <= 0 || !Number.isInteger(machines)) {
            out.innerHTML = "<strong>Quantidade de Crushing Wheels precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const durationEff = Math.max(0, recipeDuration - 20);
          const rpmFactor = (Math.abs(rpm) / 50) * 4;

          const log2 = (n) => Math.log(n) / Math.log(2);
          const stackFactor = Math.max(1, Math.min(log2(stackSize), 20));
          const speedFactor = Math.max(0.25, Math.min(rpmFactor / stackFactor, 20));

          const ticksPorStack = Math.ceil(durationEff / speedFactor) + 1 + inputDelay;

          const ticksTotais = Math.ceil((ticksPorStack * qtdStacks) / machines);
          const segundosTotais = ticksTotais / 20;
          const minutosTotais = segundosTotais / 60;

          out.innerHTML = `
          <div>
            <strong>Resumo</strong>
            <div style="margin-top:6px;">
              Stacks: ${qtdStacks.toLocaleString("pt-BR")}<br>
              Stack size: ${stackSize.toLocaleString("pt-BR")}<br>
              Crushing Wheels: ${machines}<br>
              Ticks/stack: ${ticksPorStack.toLocaleString("pt-BR")}
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
            Considera ${machines} Crushing Wheel(s) em paralelo (divide o tempo).
          </div>
        `;
        }
      },

      // ✅ TERCEIRA PÁGINA DEMONSTRATIVA (sem inputs)
      {
        id: "tabela",
        title: "Tabela de Durations (Demo)",
        fields: [],
        outputId: "out-crush-3",
        onSubmit: function () {
          const out = document.getElementById(this.outputId);
          out.innerHTML = buildCrushingDurationTableHtml();
        }
      },
    ],
  },

  "mechanical-belt": {
    title: "Mechanical Belt",
    pages: [
      // ===============================
      // 1) Throughput de Itens
      // ===============================
      {
        id: "throughput",
        title: "Throughput (itens/min)",
        fields: [
          { id: "rpm", label: "Belt RPM", type: "number", placeholder: "Ex: 64" },
          {
            id: "stack",
            label: "Stack na Belt (itens por “grupo”)",
            type: "number",
            placeholder: "Ex: 1 (solto) ou 64 (stack)",
            min: 1,
            value: 1
          },
        ],
        outputId: "out-belt-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-belt"], this, { id: "rpm" })
          );
          const stackEl = document.getElementById(
            fieldId(MACHINES["mechanical-belt"], this, { id: "stack" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const a = Number(stackEl?.value); // stack size no belt (itens por "grupo")

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(a) || a <= 0 || !Number.isInteger(a)) {
            out.innerHTML = "<strong>Stack na Belt precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const rpmAbs = Math.abs(rpm);

          // itens/min = (75/32) * |RPM| * a
          const itensPorMin = (75 / 32) * rpmAbs * a;
          const itensPorSec = itensPorMin / 60;

          // formatação correta (evita "160.000" parecer 160 mil)
          const fmtMin = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          const fmtSec = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
          });

          // alertas úteis
          const precisaBrass = itensPorMin > 600; // regra prática citada na wiki
          const isSingle = a === 1;
          const isStack = a >= 64;

          out.innerHTML = `
          <div>
            <strong>Throughput</strong>
            <div>${fmtMin.format(itensPorMin)} itens/min</div>
            <div>${fmtSec.format(itensPorSec)} itens/s</div>
          </div>

          <hr style="margin:10px 0; opacity:.4;">

          <div>
            <strong>Notas</strong>
            <div style="margin-top:6px; font-size:.9rem; opacity:.85;">
              ${isSingle ? "Modo: itens soltos (a=1)." : ""}
              ${isStack ? "Modo: stacks (a≥64) — típico com <strong>Brass Funnel</strong>." : ""}
              ${!isSingle && !isStack ? "Modo: valor custom de stack na belt." : ""}
            </div>

            <div style="margin-top:8px; font-size:.9rem;">
              ${precisaBrass
              ? "⚠️ Acima de <strong>600 itens/min</strong>: normalmente você precisa de <strong>Brass Funnel</strong> para colocar stacks na belt."
              : "✅ Abaixo de <strong>600 itens/min</strong>: itens soltos geralmente dão conta."
            }
            </div>
          </div>
        `;
        }
      },

      // ===============================
      // 2) Velocidade de Transferência (blocos/min)
      // ===============================
      {
        id: "speed",
        title: "Velocidade (blocos/min)",
        fields: [
          { id: "rpm", label: "Belt RPM", type: "number", placeholder: "Ex: 32" },
        ],
        outputId: "out-belt-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-belt"], this, { id: "rpm" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          const rpmAbs = Math.abs(rpm);

          // blocks/min = |RPM| * 2.5
          const blocosPorMin = rpmAbs * 2.5;
          const blocosPorSec = blocosPorMin / 60;

          // útil para quem pensa em ticks
          const blocosPorTick = blocosPorSec / 20;

          // formatação clara
          const fmtBMin = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          const fmtBSec = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
          });

          out.innerHTML = `
          <div>
            <strong>Velocidade da Belt</strong>
            <div>${fmtBMin.format(blocosPorMin)} blocos/min</div>
            <div>${fmtBSec.format(blocosPorSec)} blocos/s</div>
            <div style="font-size:.85rem; opacity:.7;">
              ${blocosPorTick.toFixed(4).replace(".", ",")} blocos/tick
            </div>
          </div>

          <hr style="margin:10px 0; opacity:.4;">

          <div style="font-size:.9rem; opacity:.85;">
            Use isso para estimar o tempo de viagem em belts longas (ex.: “quantos segundos até chegar na próxima máquina?”).
          </div>

          <div style="margin-top:10px; font-size:.85rem; opacity:.7;">
            Fórmula: blocos/min = |RPM| × 2.5
          </div>
        `;
        }
      },
    ],
  },
  "deployer": {
    title: "Mechanical Deployer",
    pages: [
      // ===============================
      // 1) Produção (pipeline) — Deployers em sequência (mantida)
      // ===============================
      {
        id: "prod",
        title: "Produção (pipeline) — Deployers em sequência",
        fields: [
          { id: "rpm", label: "Belt RPM", type: "number", placeholder: "Ex: 64", value: 64 },
          { id: "deployers", label: "Qtd. de Deployers (em sequência)", type: "number", placeholder: "Ex: 3", min: 1, value: 3 },

          // ticks por ação (deployer). Default 10 = ~2 ações/seg (aprox)
          { id: "tD", label: "Ticks por ação do Deployer (tD)", type: "number", placeholder: "Ex: 10", min: 1, value: 10 },

          // distância média entre deployers (em blocos).
          { id: "dist", label: "Distância entre Deployers (blocos)", type: "number", placeholder: "Ex: 1", min: 0, value: 1 },

          { id: "loops", label: "Ciclos/Loops (ex: 4)", type: "number", placeholder: "Ex: 5", min: 1, value: 5 },

          // Para Precision Mechanism no Create padrão: sucesso ~0.80
          { id: "yield", label: "Rendimento por ciclo (0–1)", type: "number", placeholder: "Ex: 0.80", min: 0, value: 0.80 },
        ],
        outputId: "out-deployer-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "rpm" }));
          const nEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "deployers" }));
          const tDEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "tD" }));
          const distEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "dist" }));
          const loopsEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "loops" }));
          const yEl = document.getElementById(fieldId(MACHINES["deployer"], this, { id: "yield" }));
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const nDeployers = Number(nEl?.value);
          const tD = Number(tDEl?.value);
          const dist = Number(distEl?.value);
          const loops = Number(loopsEl?.value);
          const yieldPerCycle = Number(yEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }
          if (!Number.isFinite(nDeployers) || nDeployers <= 0 || !Number.isInteger(nDeployers)) {
            out.innerHTML = "<strong>Qtd. de Deployers precisa ser um inteiro maior que 0.</strong>";
            return;
          }
          if (!Number.isFinite(tD) || tD <= 0 || !Number.isInteger(tD)) {
            out.innerHTML = "<strong>Ticks por ação (tD) precisa ser um inteiro maior que 0.</strong>";
            return;
          }
          if (!Number.isFinite(dist) || dist < 0) {
            out.innerHTML = "<strong>Distância precisa ser um número maior ou igual a 0.</strong>";
            return;
          }
          if (!Number.isFinite(loops) || loops <= 0 || !Number.isInteger(loops)) {
            out.innerHTML = "<strong>Loops/Ciclos precisa ser um inteiro maior que 0.</strong>";
            return;
          }
          if (!Number.isFinite(yieldPerCycle) || yieldPerCycle < 0 || yieldPerCycle > 1) {
            out.innerHTML = "<strong>Rendimento por ciclo precisa estar entre 0 e 1 (ex.: 0.80).</strong>";
            return;
          }

          const rpmAbs = Math.abs(rpm);

          // velocidade da belt: blocos/tick
          const v = rpmAbs / 480;

          // ticks entre deployers
          const tB = dist === 0 ? 0 : Math.ceil(dist / v);

          // tempo de 1 ciclo (passar pelos N deployers 1 vez)
          const tCycle = (nDeployers * tD) + ((nDeployers - 1) * tB);

          // produção pipeline (ciclos por minuto)
          const cyclesPerMin = 1200 / tCycle; // 1200 ticks/min

          // itens por minuto considerando rendimento
          const itemsPerMin = cyclesPerMin * yieldPerCycle;
          const itemsPerHour = itemsPerMin * 60;

          // tempo médio entre saídas (seg) — aproximado
          const secondsPerOutput = (tCycle / 20) / Math.max(1e-9, yieldPerCycle);

          // WIP recomendado para saturar: ~loops itens simultâneos
          const wipSuggested = loops;

          const fmt2 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          out.innerHTML = `
          <div>
            <strong>Produção (pipeline)</strong>
            <div style="margin-top:6px;">
              <div><strong>${fmt2.format(itemsPerMin)}</strong> item(ns)/min</div>
              <div>${Math.round(itemsPerHour).toLocaleString("pt-BR")} item(ns)/hora</div>
            </div>
            <div style="margin-top:8px; font-size:.85rem; opacity:.75;">
              Tempo médio por item entregue: ~${fmt2.format(secondsPerOutput)} s
            </div>
          </div>

          <hr style="margin:10px 0; opacity:.4;">

          <div>
            <strong>Loops e Saturação</strong>
            <div style="margin-top:6px; font-size:.9rem; opacity:.85;">
              Loops (ciclos): ${loops}<br>
              Para saturar o pipeline, tenha ~<strong>${wipSuggested}</strong> itens “em voo” no loop.
            </div>
          </div>
        `;
        }
      },

      // ===============================
      // 2) Impacto de Stress (SU) — escala 4× com RPM
      // ===============================
      {
        id: "stress",
        title: "Impacto de Stress (SU)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64", value: 64 },
        ],
        outputId: "out-deployer-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["deployer"], this, { id: "rpm" })
          );
          const out = document.getElementById(this.outputId);
          const rpm = Number(rpmEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          const rpmAbs = Math.abs(rpm);
          const suPorDeployer = 4 * rpmAbs;
          const fmt2 = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });

          out.innerHTML = `
      <div>
        <strong>Stress Impact</strong>
        <div style="margin-top:6px;">
          SU por Deployer: <strong>${fmt2.format(suPorDeployer)}</strong> SU
        </div>
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
        id: "prod",
        title: "Itens por minuto (receitas/min)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64", value: 64 },

          {
            id: "chain",
            label: "Maior cadeia de Crafters (longest chain)",
            type: "number",
            placeholder: "Ex: 6",
            min: 1,
            value: 1
          },
        ],
        outputId: "out-crafter-1",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-crafter"], this, { id: "rpm" })
          );
          const chainEl = document.getElementById(
            fieldId(MACHINES["mechanical-crafter"], this, { id: "chain" })
          );
          const out = document.getElementById(this.outputId);

          const rpmRaw = Number(rpmEl?.value);
          const longestChain = Number(chainEl?.value);

          if (!Number.isFinite(rpmRaw) || rpmRaw === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(longestChain) || longestChain <= 0 || !Number.isInteger(longestChain)) {
            out.innerHTML = "<strong>Maior cadeia precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          // clamp RPM conforme fórmula
          const sRaw = Math.abs(rpmRaw);
          const s = Math.min(250, Math.max(4, sRaw));

          // Helpers pra ficar igual à fórmula (ceil)
          const ceilDiv = (num, den) => Math.ceil(num / den);

          // Parte base: ⌈2000/s⌉ + ⌈500/s⌉ + 2
          const base = ceilDiv(2000, s) + ceilDiv(500, s) + 2;

          // Parte por crafter adicional na cadeia:
          // (⌈max(100, s+1)/s⌉ + ⌈1000/s⌉ + 2) * (longestChain - 1)
          const termA = Math.ceil(Math.max(100, s + 1) / s);
          const perLink = termA + ceilDiv(1000, s) + 2;

          const extraLinks = (longestChain - 1);
          const gtPerRecipe = base + (perLink * extraLinks);

          // receitas por segundo e por minuto
          const recipesPerSec = 20 / gtPerRecipe;
          const recipesPerMin = recipesPerSec * 60;

          const fmt2 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          out.innerHTML = `
          <div>
            <strong>Resultado</strong>
            <div style="margin-top:6px;">
              <div><strong>${fmt2.format(recipesPerMin)}</strong> receita(s)/min</div>
              <div>${fmt2.format(recipesPerSec)} receita(s)/s</div>
              <div style="font-size:.85rem; opacity:.75;">
                ${gtPerRecipe.toLocaleString("pt-BR")} ticks por receita (gt/r)
              </div>
            </div>
          </div>

        `;
        }
      },
      {
        id: "stress",
        title: "Impacto de Stress (SU)",
        fields: [
          { id: "rpm", label: "RPM", type: "number", placeholder: "Ex: 64", value: 64 },
          { id: "qtd", label: "Quantidade de Crafters", type: "number", placeholder: "Ex: 8", min: 1, value: 1 },
        ],
        outputId: "out-crafter-2",
        onSubmit: function () {
          const rpmEl = document.getElementById(
            fieldId(MACHINES["mechanical-crafter"], this, { id: "rpm" })
          );
          const qtdEl = document.getElementById(
            fieldId(MACHINES["mechanical-crafter"], this, { id: "qtd" })
          );
          const out = document.getElementById(this.outputId);

          const rpm = Number(rpmEl?.value);
          const qtd = Number(qtdEl?.value);

          if (!Number.isFinite(rpm) || rpm === 0) {
            out.innerHTML = "<strong>Digite um RPM válido (diferente de 0).</strong>";
            return;
          }

          if (!Number.isFinite(qtd) || qtd <= 0 || !Number.isInteger(qtd)) {
            out.innerHTML = "<strong>Quantidade de Crafters precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const rpmAbs = Math.abs(rpm);

          // Regra pedida: SU por Crafter = 2 × |RPM|
          const suPorCrafter = 2 * rpmAbs;
          const suTotal = suPorCrafter * qtd;

          const fmt2 = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });

          out.innerHTML = `
      <div>
        <strong>Stress Impact</strong>
        <div style="margin-top:6px;">
          SU por Crafter: <strong>${fmt2.format(suPorCrafter)}</strong> SU<br>
          SU total (${qtd} Crafter(s)): <strong>${fmt2.format(suTotal)}</strong> SU
        </div>
      </div>
    `;
        }
      },

    ],
  },

  "blaze-burner": {
    title: "Blaze Burner",
    pages: [
      {
        id: "fuel",
        title: "Consumo de Combustível",
        fields: [
          {
            id: "burners",
            label: "Quantidade de Blaze Burners",
            type: "number",
            placeholder: "Ex: 4",
            min: 1,
            value: 1
          },
          {
            id: "burnTime",
            label: "Tempo de queima do item (ticks)",
            type: "number",
            placeholder: "Ex: 600",
            min: 1,
            value: 600
          },
        ],
        outputId: "out-burner-1",
        onSubmit: function () {
          const burnersEl = document.getElementById(
            fieldId(MACHINES["blaze-burner"], this, { id: "burners" })
          );
          const burnTimeEl = document.getElementById(
            fieldId(MACHINES["blaze-burner"], this, { id: "burnTime" })
          );
          const out = document.getElementById(this.outputId);

          const burners = Number(burnersEl?.value);
          const burnTimeTicks = Number(burnTimeEl?.value);

          if (!Number.isFinite(burners) || burners <= 0 || !Number.isInteger(burners)) {
            out.innerHTML = "<strong>Quantidade de Blaze Burners precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          if (!Number.isFinite(burnTimeTicks) || burnTimeTicks <= 0 || !Number.isInteger(burnTimeTicks)) {
            out.innerHTML = "<strong>Tempo de queima precisa ser um inteiro maior que 0 (em ticks).</strong>";
            return;
          }

          const itemMin = 1200 / burnTimeTicks
          const itensTotal = burners * itemMin

          out.innerHTML = `
        <div style="font-size:.9rem; opacity:.75;">
          Você precisa de: <strong>${itensTotal} Itens/Min</strong>
        </div>
      `;
        }
      },
    ],

  },
  "steam-engine": {
    title: "Steam Engine",
    pages: [
      {
        id: "planner",
        title: "Planejamento do Boiler",
        fields: [
          {
            id: "burners",
            label: "Quantidade de Blaze Burners",
            type: "number",
            placeholder: "Ex: 9",
            min: 1,
            value: 1
          },
          {
            id: "temp",
            label: "Temperatura do Blaze Burner",
            type: "select",
            options: [
              { value: "heated", label: "Heated (+1 Heat)" },
              { value: "superheated", label: "Super-heated (+2 Heat)" }
            ],
            value: "heated"
          }
        ],
        outputId: "out-steam-1",
        onSubmit: function () {
          const burnersEl = document.getElementById(
            fieldId(MACHINES["steam-engine"], this, { id: "burners" })
          );
          const typeEl = document.getElementById(
  fieldId(MACHINES["steam-engine"], this, { id: "temp" })
);
          const out = document.getElementById(this.outputId);

          const burners = Number(burnersEl?.value);
          const type = String(typeEl?.value || "heated");

          if (!Number.isFinite(burners) || burners <= 0 || !Number.isInteger(burners)) {
            out.innerHTML = "<strong>Quantidade de Blaze Burners precisa ser um inteiro maior que 0.</strong>";
            return;
          }

          const heatPerBurner = type === "superheated" ? 2 : 1;

          // ===============================
          // Cálculos principais
          // ===============================
          const heatLevel = burners * heatPerBurner;
          const boilerBlocks = heatLevel * 4;
          const waterMbPerTick = heatLevel * 10;
          const steamEngines = heatLevel;
          const stressSU = heatLevel * 16384;

          const fmt0 = new Intl.NumberFormat("pt-BR");
          const fmt2 = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });

          out.innerHTML = `
          <div>
            <strong>Resultado do Planejamento</strong>

            <div style="margin-top:8px;">
              🔥 <strong>Heat Level:</strong> ${fmt0.format(heatLevel)}
            </div>

            <div style="margin-top:6px;">
              🧱 <strong>Boiler mínimo:</strong> ${fmt0.format(boilerBlocks)} blocos de Fluid Tank
            </div>

            <div style="margin-top:6px;">
              🚰 <strong>Água necessária:</strong> ${fmt0.format(waterMbPerTick)} mb/t
            </div>

            <div style="margin-top:6px;">
              ⚙️ <strong>Steam Engines:</strong> ${fmt0.format(steamEngines)}
            </div>

            <div style="margin-top:6px;">
              💥 <strong>Stress gerado:</strong> ${fmt0.format(stressSU)} SU
            </div>
          </div>

          <hr style="margin:10px 0; opacity:.4;">

          <div style="font-size:.85rem; opacity:.75;">
            Regras usadas:<br>
            Heat = burners × (${heatPerBurner})<br>
            Boiler = heat × 4 blocos<br>
            Água = heat × 10 mb/t<br>
            Stress = heat × 16.384 SU
          </div>
        `;
        }
      }
    ]
  },

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
  const id = fieldId(machineDef, pageDef, f);

  // 🔹 SELECT (combo box)
  if (f.type === "select") {
    const optionsHtml = (f.options || []).map(opt => `
      <option value="${escapeHtml(opt.value)}"
        ${opt.value === f.value ? "selected" : ""}>
        ${escapeHtml(opt.label)}
      </option>
    `).join("");

    return `
      <label for="${id}">${escapeHtml(f.label || f.id)}</label>
      <select id="${id}">
        ${optionsHtml}
      </select>
    `;
  }

  // 🔹 INPUT normal
  const attrs = [
    `id="${id}"`,
    `type="${f.type || 'text'}"`,
    f.placeholder ? `placeholder="${escapeHtml(f.placeholder)}"` : "",
    f.min != null ? `min="${f.min}"` : "",
    f.max != null ? `max="${f.max}"` : "",
    f.value != null ? `value="${f.value}"` : "",
  ].filter(Boolean).join(" ");

  return `
    <label for="${id}">${escapeHtml(f.label || f.id)}</label>
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
