// ELEMENT by Lilly — protection des creations : clic droit, copie, glisser-deposer et enregistrement bloques.
// Rien n'empeche totalement une capture d'ecran ; ces mesures decouragent la copie facile.
// Les champs de formulaire (contact, assistant) restent utilisables normalement.

(() => {
  const isField = (el) => el && el.closest && el.closest("input, textarea, [contenteditable='true']");

  // Clic droit (et appui long sur mobile, qui declenche le meme evenement)
  document.addEventListener("contextmenu", (e) => {
    if (!isField(e.target)) e.preventDefault();
  });

  // Glisser une image vers le bureau ou un autre onglet
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG" || e.target.closest?.("img, svg")) e.preventDefault();
  });

  // Copier / couper hors des champs de saisie
  ["copy", "cut"].forEach(type => document.addEventListener(type, (e) => {
    if (!isField(e.target)) e.preventDefault();
  }));

  // Raccourcis : copier, enregistrer la page, afficher la source, imprimer
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ["c", "s", "u", "p"].includes(key) && !isField(e.target)) {
      e.preventDefault();
    }
  });

  // Touche Impr. ecran (Windows) : on remplace aussitot l'image copiee dans le presse-papiers
  document.addEventListener("keyup", (e) => {
    if (e.key !== "PrintScreen") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("© ELEMENT by Lilly — images protégées").catch(() => {});
    }
  });
})();
