// ELEMENT by Lilly — ajoute un numero de version aux fichiers CSS et JS appeles par les pages (?v=...).
// Ainsi, apres chaque mise en ligne, les navigateurs rechargent les nouveaux fichiers au lieu
// de melanger d'anciennes copies gardees en memoire avec les nouvelles pages.
// A lancer avant chaque mise en ligne :  node outils/versionner.js   (puis node outils/generer-fiches.js)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const version = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith(".html"));

for (const page of pages) {
  const file = path.join(ROOT, page);
  const html = fs.readFileSync(file, "utf8")
    .replace(/(src="js\/[^"?]+\.js)(\?v=\d+)?"/g, `$1?v=${version}"`)
    .replace(/(href="css\/[^"?]+\.css)(\?v=\d+)?"/g, `$1?v=${version}"`);
  fs.writeFileSync(file, html);
}
console.log(`Version ${version} appliquee a ${pages.length} pages.`);
