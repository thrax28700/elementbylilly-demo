// ELEMENT by Lilly — assistant de questions frequentes (100% cote client, sans API externe)
// Reconnaissance de mots-cles simple : pas d'IA generative, mais des reponses reelles et utiles.

const CHAT_KB = {
  fr: {
    title: "L'atelier vous répond",
    subtitle: "Inspiration, paiement, livraison…",
    placeholder: "Écrivez votre question…",
    greeting: "Bonjour ! Je peux répondre à vos questions sur l'inspiration, les matières, le paiement, la livraison ou la commande sur-mesure. Que souhaitez-vous savoir ?",
    fallback: "Je n'ai pas de réponse toute prête pour cette question. Le plus sûr est d'écrire directement à Émilie via la page Contact — elle répond avec plaisir.",
    fallbackCta: "Écrire à Émilie",
    launcherLabel: "Une question ?",
    topics: [
      {
        id: "inspiration",
        label: "D'où vient l'inspiration ?",
        keywords: ["inspir", "idee", "création", "createur", "pourquoi", "emilie", "histoire"],
        answer: "Toute l'inspiration d'Émilie vient de la nature : bois flotté ramassé sur la côte, argile, lin, liège… Chaque pièce célèbre l'un des quatre éléments de la marque — terre, eau, bois et lin. Vous pouvez lire son parcours complet sur la page « Notre histoire »."
      },
      {
        id: "paiement",
        label: "Moyens de paiement",
        keywords: ["paiement", "payer", "carte", "virement", "espece", "reglement", "prix", "cout", "combien coute"],
        answer: "Ce site est pour l'instant une vitrine de démonstration, sans paiement en ligne. Pour commander : ajoutez les pièces qui vous plaisent à votre sélection (icône panier en haut de page), puis envoyez votre demande via le formulaire de contact — Émilie revient vers vous pour convenir ensemble du règlement."
      },
      {
        id: "livraison",
        label: "Livraison & délais",
        keywords: ["livraison", "delai", "expedition", "envoi", "transport", "recevoir", "combien de temps", "colis"],
        answer: "Chaque pièce est façonnée à la main, à la commande : comptez généralement 1 à 3 semaines de fabrication selon la création, puis un envoi soigné en colis suivi. Une remise en main propre est aussi possible selon votre localisation. Pour un délai précis sur une pièce en particulier, le plus simple est d'écrire à Émilie."
      },
      {
        id: "matieres",
        label: "Quelles matières ?",
        keywords: ["matiere", "materiau", "bois", "argile", "lin", "liege", "fabrique", "compose", "naturel"],
        answer: "Bois flotté, argile, lin, liège, laiton… chaque création est façonnée à partir de matières brutes et naturelles, en écho aux quatre éléments de la marque : terre, eau, bois et lin."
      },
      {
        id: "surmesure",
        label: "Pièce sur-mesure",
        keywords: ["personnalis", "sur mesure", "sur-mesure", "cadeau", "unique", "special", "custom"],
        answer: "Oui ! Émilie réalise aussi des pièces personnalisées, pour un cadeau ou une envie particulière. Le plus simple est de lui écrire directement via la page Contact en décrivant votre projet."
      },
      {
        id: "commande",
        label: "Comment commander ?",
        keywords: ["commander", "commande", "acheter", "boutique", "choisir", "selection"],
        answer: "Parcourez la boutique, ajoutez les pièces qui vous plaisent à votre sélection (icône panier en haut de page), puis cliquez sur « Envoyer ma demande » — votre sélection part directement à Émilie via le formulaire de contact."
      },
      {
        id: "contact",
        label: "Contacter l'atelier",
        keywords: ["atelier", "contact", "adresse", "situe", "joindre", "email", "instagram", "pinterest", "ou"],
        answer: "Émilie crée depuis son atelier en France. Le plus simple pour la joindre est le formulaire de la page Contact, ou d'échanger directement sur Instagram/Pinterest (liens en pied de page)."
      }
    ]
  },
  en: {
    title: "Ask the workshop",
    subtitle: "Inspiration, payment, shipping…",
    placeholder: "Type your question…",
    greeting: "Hello! I can answer questions about inspiration, materials, payment, shipping or custom orders. What would you like to know?",
    fallback: "I don't have a ready answer for that one. The best way is to write directly to Émilie via the Contact page — she's happy to help.",
    fallbackCta: "Write to Émilie",
    launcherLabel: "Got a question?",
    topics: [
      {
        id: "inspiration",
        label: "Where does the inspiration come from?",
        keywords: ["inspir", "idea", "creat", "why", "emilie", "story"],
        answer: "All of Émilie's inspiration comes from nature: driftwood gathered along the coast, clay, linen, cork… Every piece celebrates one of the brand's four elements — earth, water, wood and linen. Read her full story on the \"Our story\" page."
      },
      {
        id: "paiement",
        label: "Payment methods",
        keywords: ["payment", "pay", "card", "transfer", "cash", "price", "cost", "how much"],
        answer: "This site is currently a demo showcase, with no online payment. To order: add the pieces you like to your selection (basket icon at the top), then send your request through the contact form — Émilie will get back to you to arrange payment together."
      },
      {
        id: "livraison",
        label: "Shipping & delivery",
        keywords: ["shipping", "delivery", "ship", "transport", "receive", "how long", "parcel"],
        answer: "Every piece is handmade to order: allow roughly 1 to 3 weeks to make it, then careful tracked shipping. Local hand-delivery may also be possible. For an exact timeline on a specific piece, the best way is to write to Émilie."
      },
      {
        id: "matieres",
        label: "What materials?",
        keywords: ["material", "wood", "clay", "linen", "cork", "made of", "natural"],
        answer: "Driftwood, clay, linen, cork, brass… every creation is shaped from raw, natural materials, echoing the brand's four elements: earth, water, wood and linen."
      },
      {
        id: "surmesure",
        label: "Custom piece",
        keywords: ["custom", "personalis", "personaliz", "gift", "unique", "bespoke"],
        answer: "Yes! Émilie also makes custom pieces, for a gift or a special idea. The best way is to write to her directly via the Contact page describing your project."
      },
      {
        id: "commande",
        label: "How to order?",
        keywords: ["order", "buy", "shop", "choose", "selection"],
        answer: "Browse the shop, add the pieces you like to your selection (basket icon at the top), then click \"Send my request\" — your selection goes straight to Émilie through the contact form."
      },
      {
        id: "contact",
        label: "Contact the workshop",
        keywords: ["workshop", "contact", "address", "located", "reach", "email", "instagram", "pinterest", "where"],
        answer: "Émilie creates from her workshop in France. The easiest way to reach her is the form on the Contact page, or directly on Instagram/Pinterest (links in the footer)."
      }
    ]
  },
  es: {
    title: "Pregunta al taller",
    subtitle: "Inspiración, pago, envío…",
    placeholder: "Escribe tu pregunta…",
    greeting: "¡Hola! Puedo responder preguntas sobre la inspiración, los materiales, el pago, el envío o los encargos a medida. ¿Qué quieres saber?",
    fallback: "No tengo una respuesta preparada para eso. Lo más seguro es escribir directamente a Émilie a través de la página de Contacto — responde con gusto.",
    fallbackCta: "Escribir a Émilie",
    launcherLabel: "¿Una pregunta?",
    topics: [
      {
        id: "inspiration",
        label: "¿De dónde viene la inspiración?",
        keywords: ["inspir", "idea", "creac", "por que", "emilie", "historia"],
        answer: "Toda la inspiración de Émilie viene de la naturaleza: madera flotante recogida en la costa, arcilla, lino, corcho… Cada pieza celebra uno de los cuatro elementos de la marca — tierra, agua, madera y lino. Lee su historia completa en la página «Nuestra historia»."
      },
      {
        id: "paiement",
        label: "Métodos de pago",
        keywords: ["pago", "pagar", "tarjeta", "transferencia", "efectivo", "precio", "cuanto cuesta"],
        answer: "Por ahora esta web es una demostración, sin pago en línea. Para pedir: añade las piezas que te gusten a tu selección (icono de cesta arriba), y envía tu solicitud mediante el formulario de contacto — Émilie te responderá para acordar el pago juntas."
      },
      {
        id: "livraison",
        label: "Envío y plazos",
        keywords: ["envio", "entrega", "transporte", "recibir", "cuanto tiempo", "paquete"],
        answer: "Cada pieza se hace a mano bajo pedido: cuenta normalmente entre 1 y 3 semanas de fabricación, y después un envío cuidado con seguimiento. También es posible la entrega en mano según tu ubicación. Para un plazo exacto en una pieza concreta, lo mejor es escribir a Émilie."
      },
      {
        id: "matieres",
        label: "¿Qué materiales?",
        keywords: ["material", "madera", "arcilla", "lino", "corcho", "hecho de", "natural"],
        answer: "Madera flotante, arcilla, lino, corcho, latón… cada creación se moldea con materiales brutos y naturales, en eco a los cuatro elementos de la marca: tierra, agua, madera y lino."
      },
      {
        id: "surmesure",
        label: "Pieza a medida",
        keywords: ["personaliz", "a medida", "regalo", "unico", "especial"],
        answer: "¡Sí! Émilie también hace piezas personalizadas, para un regalo o una idea especial. Lo mejor es escribirle directamente a través de la página de Contacto describiendo tu proyecto."
      },
      {
        id: "commande",
        label: "¿Cómo pedir?",
        keywords: ["pedir", "comprar", "tienda", "elegir", "seleccion"],
        answer: "Explora la tienda, añade las piezas que te gusten a tu selección (icono de cesta arriba), y pulsa «Enviar mi solicitud» — tu selección llega directamente a Émilie mediante el formulario de contacto."
      },
      {
        id: "contact",
        label: "Contactar el taller",
        keywords: ["taller", "contacto", "direccion", "situado", "email", "instagram", "pinterest", "donde"],
        answer: "Émilie crea desde su taller en Francia. Lo más sencillo para contactarla es el formulario de la página de Contacto, o directamente en Instagram/Pinterest (enlaces en el pie de página)."
      }
    ]
  }
};

function chatLang(){
  return (typeof getCurrentLang === "function" && CHAT_KB[getCurrentLang()]) ? getCurrentLang() : "fr";
}
function chatStripAccents(s){
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function findTopic(message){
  const kb = CHAT_KB[chatLang()];
  const norm = chatStripAccents(message.toLowerCase());
  let best = null, bestScore = 0;
  kb.topics.forEach(topic => {
    let score = 0;
    topic.keywords.forEach(kw => { if (norm.indexOf(chatStripAccents(kw)) !== -1) score++; });
    if (score > bestScore) { bestScore = score; best = topic; }
  });
  return best;
}

function buildChatWidget(){
  if (document.querySelector(".chat-widget")) return;

  const wrap = document.createElement("div");
  wrap.className = "chat-widget";
  wrap.innerHTML = `
    <button class="chat-bubble" type="button" aria-label="Ouvrir l'assistant">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="chat-bubble-icon"><path d="M4 4h16v12H8l-4 4V4Z"/></svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="chat-bubble-close"><path d="M6 6l12 12M18 6 6 18"/></svg>
      <span class="chat-bubble-label"></span>
    </button>
    <div class="chat-panel" role="dialog" aria-label="Assistant">
      <div class="chat-header">
        <div>
          <strong class="chat-title"></strong>
          <span class="chat-subtitle"></span>
        </div>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-quick-replies"></div>
      <form class="chat-input-row">
        <input type="text" class="chat-input" autocomplete="off">
        <button type="submit" class="chat-send" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  const bubble = wrap.querySelector(".chat-bubble");
  const panel = wrap.querySelector(".chat-panel");
  const messages = wrap.querySelector(".chat-messages");
  const quickReplies = wrap.querySelector(".chat-quick-replies");
  const form = wrap.querySelector(".chat-input-row");
  const input = wrap.querySelector(".chat-input");
  let greeted = false;

  function addMessage(text, who){
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-" + who;
    row.textContent = text;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function addFallback(){
    const kb = CHAT_KB[chatLang()];
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-bot";
    row.innerHTML = `<span></span><a href="contact.html" class="chat-fallback-cta"></a>`;
    row.querySelector("span").textContent = kb.fallback;
    const cta = row.querySelector(".chat-fallback-cta");
    cta.textContent = kb.fallbackCta;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderQuickReplies(){
    const kb = CHAT_KB[chatLang()];
    quickReplies.innerHTML = "";
    kb.topics.forEach(topic => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chat-chip";
      btn.textContent = topic.label;
      btn.addEventListener("click", () => {
        addMessage(topic.label, "user");
        addMessage(topic.answer, "bot");
      });
      quickReplies.appendChild(btn);
    });
  }

  function renderStrings(){
    const kb = CHAT_KB[chatLang()];
    wrap.querySelector(".chat-title").textContent = kb.title;
    wrap.querySelector(".chat-subtitle").textContent = kb.subtitle;
    wrap.querySelector(".chat-bubble-label").textContent = kb.launcherLabel;
    input.setAttribute("placeholder", kb.placeholder);
    renderQuickReplies();
  }

  function openPanel(){
    wrap.classList.add("open");
    bubble.setAttribute("aria-label", "Fermer l'assistant");
    if (!greeted) {
      addMessage(CHAT_KB[chatLang()].greeting, "bot");
      greeted = true;
    }
    input.focus();
  }
  function closePanel(){
    wrap.classList.remove("open");
    bubble.setAttribute("aria-label", "Ouvrir l'assistant");
  }

  bubble.addEventListener("click", () => {
    wrap.classList.contains("open") ? closePanel() : openPanel();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    addMessage(value, "user");
    input.value = "";
    const topic = findTopic(value);
    setTimeout(() => {
      if (topic) addMessage(topic.answer, "bot");
      else addFallback();
    }, 260);
  });

  renderStrings();
  document.addEventListener("langchange", renderStrings);
}

document.addEventListener("DOMContentLoaded", buildChatWidget);
