// ELEMENT by Lilly — catalogue, filtres, apercu rapide, selection (liste d'envies)

const CATEGORY_ICONS = {
  "bijoux": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="7"/><path d="M12 7v10M7 12h10"/></svg>',
  "decorations-a-poser": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 21h10M9 3h6l1 8a4 4 0 0 1-8 0l1-8Z"/></svg>',
  "decorations-murales": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 15l3-3 2 2 3-4"/></svg>',
  "illustrations": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3v4M3 12h4M17 12h4M12 17v4M6 6l2.5 2.5M17.5 6.5 15 9M6 18l2.5-2.5M17.5 17.5 15 15"/></svg>',
};

function formatPrice(n){
  const lang = getCurrentLang();
  return new Intl.NumberFormat(lang === "en" ? "en-IE" : lang === "es" ? "es-ES" : "fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function productsByCategory(cat){
  return PRODUCTS.filter(p => cat === "all" ? true : p.category === cat);
}

/* ---------- Selection (liste d'envies) ---------- */
const SELECTION_KEY = "ebl_selection";
function getSelection(){
  try { return JSON.parse(localStorage.getItem(SELECTION_KEY)) || []; } catch(e){ return []; }
}
function saveSelection(list){ localStorage.setItem(SELECTION_KEY, JSON.stringify(list)); }
function isSelected(id){ return getSelection().includes(id); }
function toggleSelection(id){
  let list = getSelection();
  if (list.includes(id)) list = list.filter(x => x !== id);
  else list.push(id);
  saveSelection(list);
  updateSelectionUI();
}
function clearSelection(){ saveSelection([]); updateSelectionUI(); }

function updateSelectionUI(){
  const list = getSelection();
  document.querySelectorAll(".selection-count").forEach(el => {
    el.textContent = list.length;
    el.style.display = list.length ? "flex" : "none";
  });
  document.querySelectorAll("[data-add-id]").forEach(btn => {
    const id = btn.getAttribute("data-add-id");
    btn.classList.toggle("added", list.includes(id));
    const label = btn.querySelector("[data-add-label]");
    if (label) label.textContent = list.includes(id) ? t("product.added") : t("product.add");
  });
  renderSelectionPanel();
}

function renderSelectionPanel(){
  const panel = document.querySelector(".selection-panel");
  if (!panel) return;
  const listEl = panel.querySelector(".selection-list");
  const totalEl = panel.querySelector(".selection-total-value");
  const ids = getSelection();
  const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  listEl.innerHTML = "";
  if (!items.length) {
    listEl.innerHTML = `<div class="selection-empty">${t("selection.empty")}</div>`;
  } else {
    items.forEach(p => {
      const row = document.createElement("div");
      row.className = "selection-item";
      row.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div class="product-title" style="font-size:1rem">${p.name}</div>
          <div class="product-price">${formatPrice(p.price)}</div>
        </div>
        <button class="remove" aria-label="Retirer" data-remove-id="${p.id}">&times;</button>
      `;
      listEl.appendChild(row);
    });
  }
  if (totalEl) {
    const total = items.reduce((s,p) => s + p.price, 0);
    totalEl.textContent = formatPrice(total);
  }
  listEl.querySelectorAll("[data-remove-id]").forEach(btn => {
    btn.addEventListener("click", () => toggleSelection(btn.getAttribute("data-remove-id")));
  });
}

function wireSelectionPanel(){
  const panel = document.querySelector(".selection-panel");
  const overlay = document.querySelector(".selection-overlay");
  document.querySelectorAll(".selection-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      panel.classList.add("open");
      overlay.classList.add("open");
    });
  });
  const closeBtn = panel?.querySelector(".selection-close");
  const closePanel = () => { panel.classList.remove("open"); overlay.classList.remove("open"); };
  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  if (overlay) overlay.addEventListener("click", closePanel);
  const clearBtn = panel?.querySelector(".selection-clear-btn");
  if (clearBtn) clearBtn.addEventListener("click", clearSelection);
  const sendBtn = panel?.querySelector(".selection-send-btn");
  if (sendBtn) sendBtn.addEventListener("click", () => {
    const ids = getSelection();
    window.location.href = "contact.html" + (ids.length ? ("?items=" + ids.join(",")) : "");
  });
  updateSelectionUI();
}

/* ---------- Rendu des cartes produit ---------- */
function productCardHTML(p){
  return `
    <div class="product-card" data-product-id="${p.id}" data-category="${p.category}">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="product-quick" data-quickview-id="${p.id}" aria-label="${t('product.quickview')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <span class="product-cat" data-i18n="cat.${p.category}">${t('cat.' + p.category)}</span>
      <h3 class="product-title">${p.name}</h3>
      <div class="product-price">${formatPrice(p.price)}</div>
    </div>
  `;
}

function wireProductCards(container){
  container.querySelectorAll("[data-quickview-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickView(btn.getAttribute("data-quickview-id"));
    });
  });
  container.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => openQuickView(card.getAttribute("data-product-id")));
  });
}

/* ---------- Modal apercu rapide ---------- */
function ensureModal(){
  if (document.querySelector(".modal-overlay")) return;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" aria-label="Fermer">&times;</button>
      <div class="modal-media"><img alt=""></div>
      <div class="modal-body">
        <span class="product-cat"></span>
        <h3 class="product-title" style="font-size:1.6rem"></h3>
        <div class="modal-price"></div>
        <button class="btn btn-primary" data-modal-add>
          <span data-add-label>${t('product.add')}</span>
        </button>
        <p class="modal-note">${t('product.note')}</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeQuickView(); });
  overlay.querySelector(".modal-close").addEventListener("click", closeQuickView);
}

function openQuickView(id){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  ensureModal();
  const overlay = document.querySelector(".modal-overlay");
  overlay.querySelector(".modal-media img").src = p.image;
  overlay.querySelector(".modal-media img").alt = p.name;
  overlay.querySelector(".product-cat").textContent = t("cat." + p.category);
  overlay.querySelector(".modal-body .product-title").textContent = p.name;
  overlay.querySelector(".modal-price").textContent = formatPrice(p.price);
  const addBtn = overlay.querySelector("[data-modal-add]");
  addBtn.setAttribute("data-add-id", p.id);
  addBtn.querySelector("[data-add-label]").textContent = isSelected(p.id) ? t("product.added") : t("product.add");
  addBtn.onclick = () => { toggleSelection(p.id); addBtn.querySelector("[data-add-label]").textContent = isSelected(p.id) ? t("product.added") : t("product.add"); };
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeQuickView(){
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Page d'accueil : categories + nouveautes ---------- */
function renderHomeCategories(){
  const grid = document.querySelector("[data-category-grid]");
  if (!grid) return;
  grid.innerHTML = CATEGORY_ORDER.map(cat => {
    const sample = productsByCategory(cat)[0];
    return `
      <a class="category-card" href="boutique.html?cat=${cat}">
        <img src="${sample ? sample.image : ''}" alt="${cat}">
        <div class="overlay">
          <h3 data-i18n="cat.${cat}">${t('cat.' + cat)}</h3>
        </div>
      </a>
    `;
  }).join("");
}

function renderFeatured(){
  const grid = document.querySelector("[data-featured-grid]");
  if (!grid) return;
  const featured = PRODUCTS.slice(-4).reverse();
  grid.innerHTML = featured.map(productCardHTML).join("");
  wireProductCards(grid);
}

/* ---------- Donnees structurees (SEO) pour la boutique ---------- */
function injectProductListSchema(){
  if (document.querySelector('script[data-schema="product-list"]')) return;
  const base = "https://elementbylilly.fr/";
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "category": t("cat." + p.category),
        "image": base + p.image,
        "url": base + "boutique.html?cat=" + p.category,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": base + "boutique.html?cat=" + p.category
        }
      }
    }))
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-schema", "product-list");
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/* ---------- Page boutique ---------- */
function renderBoutique(){
  const grid = document.querySelector("[data-boutique-grid]");
  if (!grid) return;
  injectProductListSchema();
  const params = new URLSearchParams(window.location.search);
  let activeCat = params.get("cat") || "all";

  const filterBar = document.querySelector("[data-filter-bar]");
  const cats = ["all", ...CATEGORY_ORDER];
  filterBar.innerHTML = cats.map(cat => `
    <button class="filter-btn ${cat === activeCat ? 'active' : ''}" data-filter="${cat}" data-i18n="cat.${cat === 'all' ? 'all' : cat}">${t('cat.' + (cat === 'all' ? 'all' : cat))}</button>
  `).join("");

  function draw(cat){
    const items = productsByCategory(cat);
    grid.innerHTML = items.length ? items.map(productCardHTML).join("") : `<p class="text-center" style="grid-column:1/-1">${t('boutique.empty')}</p>`;
    wireProductCards(grid);
    updateSelectionUI();
  }
  draw(activeCat);

  filterBar.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCat = btn.getAttribute("data-filter");
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
      const url = new URL(window.location);
      if (activeCat === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", activeCat);
      window.history.replaceState({}, "", url);
      draw(activeCat);
    });
  });

  document.addEventListener("langchange", () => draw(activeCat));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCategories();
  renderFeatured();
  renderBoutique();
  wireSelectionPanel();
  document.addEventListener("langchange", () => {
    renderHomeCategories();
    renderFeatured();
    updateSelectionUI();
  });
});
