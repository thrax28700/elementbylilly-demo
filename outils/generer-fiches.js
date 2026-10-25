// ELEMENT by Lilly — genere une page par creation (creations/*.html) et le plan du site (sitemap.xml).
// A relancer apres chaque modification de js/products.js :  node outils/generer-fiches.js
// Chaque fiche est du HTML statique (lisible par Google sans JavaScript) avec ses donnees structurees Product.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BASE = "https://elementbylilly.fr/";
const TODAY = new Date().toISOString().slice(0, 10);

// Le catalogue est un script navigateur : on l'evalue pour recuperer PRODUCTS
const catalog = fs.readFileSync(path.join(ROOT, "js/products.js"), "utf8");
const { PRODUCTS } = new Function(catalog + "; return { PRODUCTS };")();

const CAT = {
  "bijoux": { label: "Bijoux", alt: "boucles d'oreilles faites main en argile" },
  "decorations-a-poser": { label: "Décorations à poser", alt: "décoration faite main" },
  "illustrations": { label: "Illustrations", alt: "dessin original encadré d'Émilie" },
};
const EL = { eau: "l'eau", terre: "la terre", bois: "le bois", vent: "le vent", ether: "l'éther" };
const EL_LABEL = { eau: "Eau", terre: "Terre", bois: "Bois", vent: "Vent", ether: "Éther" };

const slug = (p) => p.id.replace(/-1$/, "");
const url = (p) => `creations/${slug(p)}.html`;
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const price = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const list = (items) => items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " et " + items[items.length - 1];
const quoted = (name) => (name.match(/"([^"]+)"/) || [])[1];
// Guillemets francais pour l'affichage : Boucles d'oreilles « Bleu de glace »
const nice = (name) => name.replace(/"([^"]+)"/, "« $1 »");

// Description courte pour Google : le texte d'Émilie s'il existe (coupé proprement), sinon un texte généré
function summary(p){
  if (!p.description) return description(p);
  const first = p.description[0];
  if (first.length <= 158) return first;
  return first.slice(0, first.lastIndexOf(" ", 155)).replace(/[,;:]$/, "") + "…";
}

function description(p){
  const inspired = `inspirée par ${list(p.elements.map(e => EL[e]))}`;
  const place = "par Émilie, artisane créatrice à Saint-Georges-sur-Eure, près de Chartres";
  if (p.category === "bijoux") {
    return `Boucles d'oreilles « ${quoted(p.name) || p.name} » façonnées à la main dans l'argile ${place}. Une pièce unique ${inspired}, à porter au quotidien ou à offrir.`;
  }
  if (p.category === "illustrations") {
    return `« ${p.name} » est un dessin original d'Émilie, artisane créatrice près de Chartres : un trait minutieux, une œuvre encadrée ${inspired}, à accrocher chez soi ou à offrir.`;
  }
  // Le nom dit deja la matiere ("en bois", "en bois flotte") : on ne la repete pas
  const coastal = /flott|côt|port|phare|voil|navire|pêcheur/i.test(p.name);
  return `${p.name} : une décoration à poser façonnée à la main ${place}. Une pièce unique ${inspired}${coastal ? ", qui raconte les rivages et les villages de bord de mer" : ", à poser sur une étagère ou à offrir"}.`;
}

const template = fs.readFileSync(path.join(ROOT, "boutique.html"), "utf8");
const head = template.slice(0, template.indexOf("<main>"));
const tail = template.slice(template.indexOf("</main>") + "</main>".length);

function card(p){
  return `
        <div class="product-card">
          <a class="product-media" href="${url(p)}"><img src="${p.image}" alt="${esc(nice(p.name) + ", " + CAT[p.category].alt)}" loading="lazy"></a>
          <span class="product-cat">${CAT[p.category].label}</span>
          <h3 class="product-title"><a href="${url(p)}">${esc(nice(p.name))}</a></h3>
          <div class="product-price">${price(p.price)}</div>
        </div>`;
}

function page(p){
  const desc = summary(p);
  const paragraphs = p.description || [description(p)];
  const images = p.gallery || [p.image];
  const alt = nice(p.name) + ", " + CAT[p.category].alt;
  const title = `${nice(p.name)} fait main | ELEMENT by Lilly`;
  const pageUrl = BASE + url(p);
  const related = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": nice(p.name),
        "image": images.map(i => BASE + i),
        "description": paragraphs.join(" "),
        "sku": slug(p),
        "category": CAT[p.category].label,
        "brand": { "@type": "Brand", "name": "ELEMENT by Lilly" },
        "offers": {
          "@type": "Offer",
          "url": pageUrl,
          "priceCurrency": "EUR",
          "price": p.price.toFixed(2),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": { "@type": "Organization", "name": "ELEMENT by Lilly", "url": BASE }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE },
          { "@type": "ListItem", "position": 2, "name": CAT[p.category].label, "item": BASE + "boutique.html?cat=" + p.category },
          { "@type": "ListItem", "position": 3, "name": nice(p.name), "item": pageUrl }
        ]
      }
    ]
  };

  let h = head
    .replace('<html lang="fr" data-title-key="meta.boutique.title">', '<html lang="fr">')
    .replace(/<meta name="viewport"[^>]*>/, (m) => m + '\n<base href="../">')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${pageUrl}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace('<meta property="og:type" content="website">', '<meta property="og:type" content="product">')
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${pageUrl}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${BASE + p.image}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${BASE + p.image}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);

  const elements = p.elements.map(e => `<a href="boutique.html?el=${e}">${EL_LABEL[e]}</a>`).join(" · ");
  const main = `<main class="product-page">
  <div class="container">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <a href="index.html" data-i18n="nav.home">Accueil</a><span aria-hidden="true">/</span>
      <a href="boutique.html?cat=${p.category}" data-i18n="cat.${p.category}">${CAT[p.category].label}</a><span aria-hidden="true">/</span>
      <span aria-current="page">${esc(nice(p.name))}</span>
    </nav>
    <article class="pp-grid">
      <div class="pp-gallery">
        <div class="pp-media"><img src="${images[0]}" alt="${esc(alt)}" data-pp-main></div>${images.length > 1 ? `
        <div class="pp-thumbs">${images.map((img, i) => `
          <button type="button" class="pp-thumb${i ? "" : " is-active"}" data-pp-thumb="${img}" aria-label="Photo ${i + 1} sur ${images.length}"><img src="${img}" alt="${esc(alt)}, vue ${i + 1}" loading="lazy"></button>`).join("")}
        </div>` : ""}
      </div>
      <div class="pp-body">
        <span class="product-cat" data-i18n="cat.${p.category}">${CAT[p.category].label}</span>
        <h1 class="pp-title">${esc(nice(p.name))}</h1>
        <div class="pp-price">${price(p.price)}</div>
        <div class="pp-desc">${paragraphs.map(t => `<p>${esc(t)}</p>`).join("")}</div>
        <ul class="pp-facts">
          <li><span class="ms" aria-hidden="true">back_hand</span>Pièce faite main par Émilie</li>
          <li><span class="ms" aria-hidden="true">eco</span>Atelier à Saint-Georges-sur-Eure (28), près de Chartres</li>
          <li><span class="ms" aria-hidden="true">diamond</span>Éléments : ${elements}</li>
        </ul>
        <div class="pp-actions">
          <button class="btn btn-primary" type="button" data-page-add data-add-id="${p.id}"><span data-add-label>Ajouter à ma sélection</span></button>
          <a class="btn btn-outline" href="contact.html?items=${p.id}">Poser une question</a>
        </div>
        <p class="modal-note" data-i18n="product.note">Cette boutique est une démonstration : pour commander, envoyez votre sélection via le formulaire de contact — aucun paiement n'est demandé ici.</p>
      </div>
    </article>
    ${related.length ? `<section class="pp-related">
      <h2>Dans le même esprit</h2>
      <div class="product-grid">${related.map(card).join("")}
      </div>
    </section>` : ""}
  </div>
</main>`;

  return h + main + tail.replace('<a href="boutique.html" class="active"', '<a href="boutique.html"');
}

const outDir = path.join(ROOT, "creations");
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".html")) fs.unlinkSync(path.join(outDir, f));
for (const p of PRODUCTS) fs.writeFileSync(path.join(ROOT, url(p)), page(p));

// Plan du site, avec les images de chaque fiche pour Google Images
const pages = [
  ["", "weekly", "1.0"], ["boutique.html", "weekly", "0.9"], ["histoire.html", "monthly", "0.8"], ["contact.html", "monthly", "0.6"],
];
const urlTag = (loc, freq, prio, images = []) => `  <url>
    <loc>${BASE + loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>${images.map(img => `
    <image:image><image:loc>${BASE + img.loc}</image:loc><image:title>${esc(img.title)}</image:title></image:image>`).join("")}
  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(([loc, f, pr]) => urlTag(loc, f, pr)).join("\n")}
${PRODUCTS.map(p => urlTag(url(p), "monthly", "0.7", (p.gallery || [p.image]).map(loc => ({ loc, title: nice(p.name) })))).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log(`${PRODUCTS.length} fiches generees dans creations/, sitemap.xml a jour (${pages.length + PRODUCTS.length} pages).`);
