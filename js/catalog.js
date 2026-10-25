// ELEMENT by Lilly — catalogue, filtres, apercu rapide, selection (liste d'envies)

function formatPrice(n){
  const lang = getCurrentLang();
  return new Intl.NumberFormat(lang === "en" ? "en-IE" : lang === "es" ? "es-ES" : "fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

// Adresse de la fiche detaillee d'une creation (pages generees par outils/generer-fiches.js)
function productUrl(p){ return "creations/" + p.id.replace(/-1$/, "") + ".html"; }

// Texte alternatif descriptif, utile a Google Images comme aux lecteurs d'ecran
function productAlt(p){
  if (p.category === "bijoux") return p.name + ", boucles d'oreilles faites main en argile";
  if (p.category === "illustrations") return p.name + ", dessin original encadré d'Émilie";
  return p.name + ", décoration faite main";
}

function productsByCategory(cat){
  return PRODUCTS.filter(p => cat === "all" ? true : p.category === cat);
}

/* ---------- Selection (liste d'envies) ---------- */
const SELECTION_KEY = "ebl_selection";
function getSelection(){
  try { return JSON.parse(localStorage.getItem(SELECTION_KEY)) || []; } catch(e){ return []; }
}
function saveSelection(list){ try { localStorage.setItem(SELECTION_KEY, JSON.stringify(list)); } catch(e){} }
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
        <img src="${p.image}" alt="${productAlt(p)}" loading="lazy">
        <button class="product-quick" data-quickview-id="${p.id}" aria-label="${t('product.quickview')}">
          <span class="ms" aria-hidden="true">visibility</span>
        </button>
      </div>
      <span class="product-cat" data-i18n="cat.${p.category}">${t('cat.' + p.category)}</span>
      <h3 class="product-title"><a href="${productUrl(p)}">${p.name}</a></h3>
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
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      openQuickView(card.getAttribute("data-product-id"));
    });
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
        <a class="modal-page-link" data-modal-page href="#">${t('product.page')}</a>
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
  overlay.querySelector(".modal-media img").alt = productAlt(p);
  overlay.querySelector("[data-modal-page]").href = productUrl(p);
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

/* ---------- Page d'accueil : savoir-faire, explorateur par element, galerie ---------- */
const CRAFTS = [
  { key: "bijoux", cat: "bijoux", images: ["boucles-d-oreilles-reve-azur", "boucles-d-oreilles-terre-de-lune-1", "boucles-d-oreilles-ocean-d-or-1"] },
  { key: "bois", cat: "decorations-a-poser", images: ["voilier-en-bois-flotte-et-voile-en-toile-de-lin", "village-cotier", "phare-cotier-en-bois-flotte"] },
  { key: "dessin", cat: "illustrations", images: ["intuition", "insouciance", "resilience"] },
];

function productById(id){ return PRODUCTS.find(p => p.id === id); }

function renderCrafts(){
  const wrap = document.querySelector("[data-crafts]");
  if (!wrap) return;
  wrap.innerHTML = CRAFTS.map((c, i) => {
    const items = productsByCategory(c.cat);
    const min = Math.min(...items.map(p => p.price));
    const imgs = c.images.map(productById).filter(Boolean);
    return `
      <article class="craft ${i % 2 ? 'craft-reverse' : ''} reveal">
        <div class="craft-media">
          ${imgs.map((p, k) => `<button type="button" class="craft-img craft-img-${k}" data-quickview-id="${p.id}" aria-label="${p.name}"><img src="${p.image}" alt="${productAlt(p)}" loading="lazy"></button>`).join("")}
        </div>
        <div class="craft-body">
          <span class="craft-num">0${i + 1}</span>
          <h3 data-i18n="craft.${c.key}.title">${t('craft.' + c.key + '.title')}</h3>
          <p data-i18n="craft.${c.key}.text">${t('craft.' + c.key + '.text')}</p>
          <div class="craft-meta">
            <span>${t('craft.count').replace('{n}', items.length)}</span>
            <span>${t('craft.from').replace('{p}', formatPrice(min))}</span>
          </div>
          <a class="btn btn-outline" href="boutique.html?cat=${c.cat}">${t('craft.cta')}</a>
        </div>
      </article>
    `;
  }).join("");
  wrap.querySelectorAll("[data-quickview-id]").forEach(btn => btn.addEventListener("click", () => openQuickView(btn.getAttribute("data-quickview-id"))));
  observeReveal(wrap);
}

// Illustrations au trait des cinq elements, pour le bandeau defilant
const ELEMENT_ART = {
  eau: '<path d="M32 6s9 10 9 16a9 9 0 0 1-18 0c0-6 9-16 9-16Z"/><path d="M28 21a4 4 0 0 0 3 4"/><path d="M4 42c5-5 9-5 14 0s9 5 14 0 9-5 14 0 9 5 14 0"/><path d="M4 52c5-5 9-5 14 0s9 5 14 0 9-5 14 0 9 5 14 0"/>',
  terre: '<path d="M4 54 22 24l10 15 8-11 20 26Z"/><path d="M17 32l5-8 5 8-5-2Z"/><circle cx="48" cy="13" r="6"/><path d="M48 3v2M58 13h-2M41 6l1.5 1.5M55 6l-1.5 1.5"/><path d="M2 54h60"/>',
  bois: '<path d="M32 6c10 0 17 7 17 15 0 7-6 12-12 12H27c-6 0-12-5-12-12 0-8 7-15 17-15Z"/><path d="M32 58V24M32 38l-8-6M32 44l9-7"/><path d="M22 58c4-2 7-2 10 0 3-2 6-2 10 0"/>',
  vent: '<path d="M4 22h30a7 7 0 1 0-7-7"/><path d="M4 32h44a7 7 0 1 1-7 7"/><path d="M4 42h22"/><path d="M48 12c6-1 10 2 11 8-6 1-10-2-11-8Z"/><path d="M50 14l7 5"/>',
  feu: '<path d="M32 50c9 0 15-6 15-14 0-11-10-15-10-25-6 4-9 10-9 15-2-2-4-4-4-8-4 4-7 10-7 17 0 9 6 15 15 15Z"/><path d="M32 50c-4 0-7-3-7-7 0-4 3-6 4-10 2 3 3 4 3 6 1-2 2-3 4-4 0 3 3 5 3 8 0 4-3 7-7 7Z"/><path d="M16 59l32-6M48 59l-32-6"/>',
};

function renderMarquee(){
  const track = document.querySelector("[data-marquee]");
  if (!track) return;
  const run = ELEMENT_ORDER.map(el => `
    <svg class="mq-art mq-${el}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><title>${t('el.' + el)}</title>${ELEMENT_ART[el]}</svg><i></i>`).join("");
  // Contenu double pour un defilement continu
  track.innerHTML = `<div>${run.repeat(3)}</div><div>${run.repeat(3)}</div>`;
}

let explorerElement = "eau";
function renderExplorer(){
  const section = document.querySelector("[data-explorer]");
  if (!section) return;
  const tabs = section.querySelector("[data-explorer-tabs]");
  const grid = section.querySelector("[data-explorer-grid]");
  const link = section.querySelector("[data-explorer-link]");
  tabs.innerHTML = ELEMENT_ORDER.map(el => `
    <button type="button" role="tab" class="explorer-tab" data-tab="${el}" aria-selected="${el === explorerElement}">
      <span class="explorer-dot dot-${el}"></span>${t('el.' + el)}
      <small>${PRODUCTS.filter(p => p.elements.includes(el)).length}</small>
    </button>
  `).join("");
  const items = PRODUCTS.filter(p => p.elements.includes(explorerElement)).slice(0, 8);
  grid.innerHTML = items.map(productCardHTML).join("");
  grid.classList.remove("is-swapping");
  void grid.offsetWidth;
  grid.classList.add("is-swapping");
  wireProductCards(grid);
  section.setAttribute("data-mode", explorerElement);
  if (link) link.href = "boutique.html?el=" + explorerElement;
  tabs.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
    setActiveElement(btn.getAttribute("data-tab"), "explorer");
  }));
}

function renderGallery(){
  const strip = document.querySelector("[data-gallery]");
  if (!strip) return;
  strip.innerHTML = PRODUCTS.map(p => `
    <a class="gallery-item" href="${productUrl(p)}" data-quickview-id="${p.id}" draggable="false">
      <img src="${p.image}" alt="${productAlt(p)}" loading="lazy" draggable="false">
      <span class="gallery-caption"><strong>${p.name}</strong><span>${formatPrice(p.price)}</span></span>
    </a>
  `).join("");
  strip.querySelectorAll("[data-quickview-id]").forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (strip.dataset.dragged === "1") return;
    openQuickView(btn.getAttribute("data-quickview-id"));
  }));
  if (strip.dataset.wired) return;
  strip.dataset.wired = "1";
  // Glisser a la souris (le tactile defile nativement)
  let down = false, startX = 0, startScroll = 0;
  strip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; startX = e.clientX; startScroll = strip.scrollLeft; strip.dataset.dragged = "0";
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { strip.dataset.dragged = "1"; strip.classList.add("is-dragging"); }
    strip.scrollLeft = startScroll - dx;
  });
  window.addEventListener("pointerup", () => {
    down = false; strip.classList.remove("is-dragging");
    setTimeout(() => { strip.dataset.dragged = "0"; }, 0);
  });
}

function observeReveal(root){
  const els = root.querySelectorAll(".reveal:not(.in-view)");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in-view")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in-view"); io.unobserve(entry.target); }
  }), { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

function renderHome(){
  renderMarquee();
  renderCrafts();
  renderExplorer();
  renderGallery();
}

document.addEventListener("elementchange", (e) => {
  if (e.detail.source === "auto" || !document.querySelector("[data-explorer]")) return;
  if (explorerElement === e.detail.element) return;
  explorerElement = e.detail.element;
  renderExplorer();
});

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
        "url": base + productUrl(p),
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "url": base + productUrl(p)
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
  let activeEl = ELEMENT_ORDER.includes(params.get("el")) ? params.get("el") : null;

  const filterBar = document.querySelector("[data-filter-bar]");
  const cats = ["all", ...CATEGORY_ORDER];
  filterBar.innerHTML = cats.map(cat => `
    <button class="filter-btn ${cat === activeCat ? 'active' : ''}" data-filter="${cat}" data-i18n="cat.${cat === 'all' ? 'all' : cat}">${t('cat.' + (cat === 'all' ? 'all' : cat))}</button>
  `).join("");

  const elementBar = document.querySelector("[data-element-bar]");
  if (elementBar) {
    elementBar.innerHTML = `<span class="element-bar-label" data-i18n="boutique.elements">${t('boutique.elements')}</span>` + ELEMENT_ORDER.map(el => `
      <button class="element-filter ${el === activeEl ? 'active' : ''}" data-element-filter="${el}" aria-pressed="${el === activeEl}">
        <span class="explorer-dot dot-${el}"></span><span data-i18n="el.${el}">${t('el.' + el)}</span>
      </button>
    `).join("");
  }

  function draw(){
    const items = productsByCategory(activeCat).filter(p => !activeEl || p.elements.includes(activeEl));
    grid.innerHTML = items.length ? items.map(productCardHTML).join("") : `<p class="text-center" style="grid-column:1/-1">${t('boutique.empty')}</p>`;
    wireProductCards(grid);
    updateSelectionUI();
  }

  function syncUrl(){
    const url = new URL(window.location);
    if (activeCat === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", activeCat);
    if (activeEl) url.searchParams.set("el", activeEl); else url.searchParams.delete("el");
    window.history.replaceState({}, "", url);
  }
  draw();
  if (activeEl) document.dispatchEvent(new CustomEvent("elementchange", { detail: { element: activeEl, source: "boutique" } }));

  filterBar.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCat = btn.getAttribute("data-filter");
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
      syncUrl();
      draw();
    });
  });

  if (elementBar) elementBar.querySelectorAll("[data-element-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      const el = btn.getAttribute("data-element-filter");
      activeEl = activeEl === el ? null : el;
      elementBar.querySelectorAll("[data-element-filter]").forEach(b => {
        const on = b.getAttribute("data-element-filter") === activeEl;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      syncUrl();
      draw();
      if (activeEl) document.dispatchEvent(new CustomEvent("elementchange", { detail: { element: activeEl, source: "boutique" } }));
    });
  });

  document.addEventListener("langchange", draw);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  renderBoutique();
  document.querySelectorAll("[data-page-add]").forEach(btn => btn.addEventListener("click", () => toggleSelection(btn.getAttribute("data-add-id"))));
  wireSelectionPanel();
  document.addEventListener("langchange", () => {
    renderMarquee();
    renderCrafts();
    renderExplorer();
    renderGallery();
    updateSelectionUI();
  });
});
