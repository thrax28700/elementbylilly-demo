// ELEMENT by Lilly — page contact : pre-remplissage depuis la selection + envoi via mailto

// TODO: remplacer par l'adresse email reelle d'Emilie avant mise en ligne definitive
const CONTACT_EMAIL = "contact@elementbylilly.fr";

function buildSelectionSummary(){
  const params = new URLSearchParams(window.location.search);
  const ids = (params.get("items") || "").split(",").filter(Boolean);
  if (!ids.length) return "";
  const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (!items.length) return "";
  const lines = items.map(p => `- ${p.name} (${formatPrice(p.price)})`);
  const total = items.reduce((s,p) => s + p.price, 0);
  return lines.join("\n") + `\n\n${t("selection.total")} : ${formatPrice(total)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const messageField = form.querySelector("#contact-message");
  const summary = buildSelectionSummary();
  if (summary && messageField) {
    messageField.value = (t("selection.title") + " :\n" + summary + "\n\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#contact-name").value;
    const email = form.querySelector("#contact-email").value;
    const message = messageField.value;
    const subject = encodeURIComponent("Message depuis le site ELEMENT by Lilly");
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    const status = document.querySelector(".form-status");
    if (status) status.textContent = t("contact.sent");
  });
});
