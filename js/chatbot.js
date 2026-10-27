// ELEMENT by Lilly — "Dans l'atelier d'Émilie" : un guide qui raconte comment naissent les créations
// (100% cote client, sans API externe). Reconnaissance de mots-cles simple : pas d'IA generative,
// des reponses ecrites a partir de ce qu'Émilie dit de son travail.
// Chaque sujet appartient a un groupe ("atelier" ou "pratique") et propose des questions pour continuer ("next").

const CHAT_KB = {
  fr: {
    title: "Dans l'atelier d'Émilie",
    subtitle: "Comment naissent ses créations",
    placeholder: "Posez votre question…",
    greeting: "Bonjour et bienvenue dans l'atelier ! Ici, rien n'est fabriqué à la chaîne : chaque pièce naît des mains d'Émilie, avec patience et beaucoup de cœur. Que voulez-vous découvrir ?",
    fallback: "Je n'ai pas de réponse toute prête pour cette question. Le mieux est de la poser directement à Émilie : elle adore parler de son travail.",
    fallbackCta: "Écrire à Émilie",
    launcherLabel: "Les secrets de l'atelier",
    groups: { atelier: "Le savoir-faire", pratique: "Commander" },
    nextLabel: "Pour continuer :",
    allQuestions: "Toutes les questions",
    topics: [
      {
        id: "bois", group: "atelier",
        label: "Comment naît une sculpture en bois ?",
        keywords: ["phare", "falaise", "village", "maison", "sculpt", "souche", "chene", "voilier", "navire", "port", "deco"],
        answer: "Tout commence par le bois lui-même. Une souche de chêne ou un morceau de bois flotté a déjà été sculpté par la nature : c'est sa forme qui guide Émilie et qui décide s'il deviendra une falaise, un rivage ou un port. Elle creuse ensuite les reliefs, puis ajoute un à un les petits détails : les maisons blotties dans la roche, les escaliers qui serpentent, les chemins de galets, et enfin les nuances de bleu et de blanc qui évoquent l'écume des vagues.",
        next: ["temps", "origine", "unique"]
      },
      {
        id: "origine", group: "atelier",
        label: "D'où vient le bois ?",
        keywords: ["d'ou vient", "origine", "ramasse", "recup", "trouve", "bois flotte", "flotte", "riviere", "plage"],
        answer: "Du bord de l'eau et de la forêt. Le bois flotté est ramassé au fil des rivages, déjà poli par l'eau et le temps ; les souches de chêne gardent les veines et les creux de toute une vie d'arbre. Émilie travaille avec la matière telle qu'elle est, sans chercher à effacer ses marques : ce sont elles qui donnent son caractère à chaque pièce.",
        next: ["bois", "elements"]
      },
      {
        id: "temps", group: "atelier",
        label: "Combien de temps pour une pièce ?",
        keywords: ["combien de temps", "temps", "heures", "duree", "long", "jours"],
        answer: "Le temps qu'il faut. Sculpter, poncer, façonner les maisons miniatures, poser les escaliers et les rambardes, peindre l'écume, laisser sécher… Une sculpture demande de nombreuses heures, réparties sur plusieurs jours. Émilie préfère prendre son temps plutôt que de presser une pièce : la patience fait partie de son travail.",
        next: ["passion", "unique"]
      },
      {
        id: "bijoux", group: "atelier",
        label: "Comment sont faits les bijoux ?",
        keywords: ["bijou", "boucle", "oreille", "argile", "pendentif", "collier", "couleur", "marbr"],
        answer: "Chaque paire est façonnée à la main dans l'argile. Émilie compose elle-même ses couleurs et ses motifs (marbrures, dégradés de bleus, éclats dorés), découpe les formes, puis les assemble avec des apprêts dorés. Comme tout est fait à la main, en petite série, deux paires ne sont jamais tout à fait identiques : ces légères variations sont la signature du fait main.",
        next: ["elements", "unique"]
      },
      {
        id: "dessins", group: "atelier",
        label: "Comment naissent ses dessins ?",
        keywords: ["dessin", "illustration", "tableau", "cadre", "renard", "fleur", "oiseau", "insouciance", "intuition", "resilience"],
        answer: "Trait après trait, à la main, avec une grande minutie. Fleurs, renard, oiseau… chaque dessin porte un nom (Insouciance, Intuition, Résilience) comme une émotion qu'Émilie a voulu fixer sur le papier. Ce sont des œuvres originales, encadrées, et non des reproductions.",
        next: ["passion", "elements"]
      },
      {
        id: "passion", group: "atelier",
        label: "Pourquoi tout faire à la main ?",
        keywords: ["a la main", "fait main", "passion", "coeur", "amour", "therap", "sens", "valeur", "emilie", "qui est"],
        answer: "Pour Émilie, créer est bien plus qu'un métier : c'est une respiration. Hypersensible et perfectionniste, c'est ainsi qu'elle se décrit, elle met dans chaque pièce une part d'elle-même. Faire à la main, c'est prendre le temps, respecter la matière et offrir un objet qui porte une âme et une histoire. Sa page « Notre histoire » raconte comment la création est devenue pour elle une façon d'aller bien.",
        next: ["elements", "surmesure"]
      },
      {
        id: "elements", group: "atelier",
        label: "Pourquoi les cinq éléments ?",
        keywords: ["element", "l'eau", "terre", "feu", "l'air", "ether", "nature", "inspir"],
        answer: "ELEMENT, ce sont l'eau, la terre, le feu, l'air et l'éther, cet esprit qui relie toutes choses. Chaque création naît de l'un d'eux : le bleu des vagues, l'ocre de la roche, l'éclat doré d'un bijou ou la lumière d'un phare, la légèreté d'une voile. Sur la page d'accueil, vous pouvez choisir votre élément : l'ambiance sonore change avec lui.",
        next: ["bois", "bijoux", "dessins"]
      },
      {
        id: "unique", group: "atelier",
        label: "Chaque pièce est-elle unique ?",
        keywords: ["unique", "identique", "pareil", "serie", "copie", "reproduction", "exemplaire"],
        answer: "Oui. Aucun morceau de bois ne ressemble à un autre, donc chaque sculpture est une pièce unique. Les dessins sont des originaux. Les bijoux sont façonnés en petite série, et chaque paire garde ses propres nuances. Quand une pièce est partie, elle ne revient pas à l'identique.",
        next: ["surmesure", "commande"]
      },
      {
        id: "surmesure", group: "pratique",
        label: "Une pièce sur-mesure ?",
        keywords: ["personnalis", "sur mesure", "sur-mesure", "cadeau", "special", "commande speciale"],
        answer: "Avec plaisir ! Émilie réalise aussi des pièces personnalisées, pour un cadeau ou une envie particulière : un phare qui rappelle un lieu cher, des couleurs choisies… Décrivez-lui votre idée via la page Contact, elle vous dira ce qu'elle peut imaginer.",
        next: ["commande", "contact"]
      },
      {
        id: "commande", group: "pratique",
        label: "Comment commander ?",
        keywords: ["commander", "commande", "acheter", "boutique", "choisir", "selection", "panier"],
        answer: "Parcourez la boutique, ajoutez les pièces qui vous plaisent à votre sélection (icône panier en haut de page), puis cliquez sur « Envoyer ma demande » : votre sélection arrive directement à Émilie via le formulaire de contact.",
        next: ["paiement", "livraison"]
      },
      {
        id: "paiement", group: "pratique",
        label: "Moyens de paiement",
        keywords: ["paiement", "payer", "carte", "virement", "espece", "reglement", "prix", "cout", "combien coute"],
        answer: "Ce site est pour l'instant une vitrine de démonstration, sans paiement en ligne. Envoyez votre sélection via le formulaire de contact : Émilie revient vers vous pour convenir ensemble du règlement.",
        next: ["livraison"]
      },
      {
        id: "livraison", group: "pratique",
        label: "Livraison et délais",
        keywords: ["livraison", "delai", "expedition", "envoi", "transport", "recevoir", "colis"],
        answer: "Chaque pièce est emballée avec soin et envoyée en colis suivi. Une remise en main propre est possible dans le secteur de Chartres. Pour un délai précis sur une pièce, le plus simple est d'écrire à Émilie.",
        next: ["contact"]
      },
      {
        id: "contact", group: "pratique",
        label: "Où se trouve l'atelier ?",
        keywords: ["atelier", "contact", "adresse", "situe", "chartres", "joindre", "email", "instagram", "pinterest"],
        answer: "L'atelier se trouve à Saint-Georges-sur-Eure, près de Chartres (Eure-et-Loir). Pour joindre Émilie : le formulaire de la page Contact, ou Instagram et Pinterest (liens en bas de page).",
        next: ["surmesure"]
      }
    ]
  },
  en: {
    title: "Inside Émilie's workshop",
    subtitle: "How her creations come to life",
    placeholder: "Ask your question…",
    greeting: "Hello and welcome to the workshop! Nothing here is mass-produced: every piece comes from Émilie's hands, made with patience and a lot of heart. What would you like to discover?",
    fallback: "I don't have a ready answer for that one. The best way is to ask Émilie directly: she loves talking about her work.",
    fallbackCta: "Write to Émilie",
    launcherLabel: "Workshop secrets",
    groups: { atelier: "The craft", pratique: "Ordering" },
    nextLabel: "Keep exploring:",
    allQuestions: "All questions",
    topics: [
      {
        id: "bois", group: "atelier",
        label: "How is a wood sculpture born?",
        keywords: ["lighthouse", "cliff", "village", "house", "sculpt", "stump", "oak", "sailboat", "ship", "harbor", "decor"],
        answer: "It all starts with the wood itself. An oak stump or a piece of driftwood has already been sculpted by nature: its shape guides Émilie and decides whether it becomes a cliff, a shore or a harbor. She then carves the reliefs and adds the small details one by one: houses nestled in the rock, winding stairs, pebble paths, and finally the shades of blue and white that evoke sea foam.",
        next: ["temps", "origine", "unique"]
      },
      {
        id: "origine", group: "atelier",
        label: "Where does the wood come from?",
        keywords: ["where does", "come from", "origin", "gather", "found", "driftwood", "river", "beach"],
        answer: "From the water's edge and the forest. Driftwood is gathered along the shores, already polished by water and time; oak stumps keep the veins and hollows of a whole tree's life. Émilie works with the material as it is, without erasing its marks: they give each piece its character.",
        next: ["bois", "elements"]
      },
      {
        id: "temps", group: "atelier",
        label: "How long does a piece take?",
        keywords: ["how long", "time", "hours", "days", "duration"],
        answer: "As long as it needs. Carving, sanding, shaping the tiny houses, fitting stairs and railings, painting the foam, letting it dry… A sculpture takes many hours spread over several days. Émilie would rather take her time than rush a piece: patience is part of her craft.",
        next: ["passion", "unique"]
      },
      {
        id: "bijoux", group: "atelier",
        label: "How is the jewelry made?",
        keywords: ["jewel", "earring", "clay", "pendant", "necklace", "color", "marbl"],
        answer: "Every pair is shaped by hand from clay. Émilie mixes her own colors and patterns (marbling, blue gradients, golden flakes), cuts the shapes, then assembles them with gold-tone findings. Since everything is handmade in small batches, no two pairs are ever exactly alike: those slight variations are the signature of handmade work.",
        next: ["elements", "unique"]
      },
      {
        id: "dessins", group: "atelier",
        label: "How are her drawings made?",
        keywords: ["drawing", "illustration", "frame", "fox", "flower", "bird", "insouciance", "intuition", "resilience"],
        answer: "Line by line, by hand, with great care. Flowers, a fox, a bird… each drawing has a name (Insouciance, Intuition, Résilience), like an emotion Émilie wanted to capture on paper. They are framed originals, not reproductions.",
        next: ["passion", "elements"]
      },
      {
        id: "passion", group: "atelier",
        label: "Why make everything by hand?",
        keywords: ["by hand", "handmade", "passion", "heart", "love", "therap", "meaning", "emilie", "who is"],
        answer: "For Émilie, creating is much more than a job: it's a way to breathe. Highly sensitive and a perfectionist, as she describes herself, she puts a part of herself into every piece. Making by hand means taking time, respecting the material and offering an object with a soul and a story. Her \"Our story\" page tells how creating became her way of feeling well.",
        next: ["elements", "surmesure"]
      },
      {
        id: "elements", group: "atelier",
        label: "Why the five elements?",
        keywords: ["element", "water", "earth", "fire", "ether", "nature", "inspir"],
        answer: "ELEMENT means water, earth, fire, air and ether, the spirit that connects all things. Each creation is born from one of them: the blue of the waves, the ochre of the rock, the golden glint of a jewel or the light of a lighthouse, the lightness of a sail. On the home page you can choose your element: the ambient sound changes with it.",
        next: ["bois", "bijoux", "dessins"]
      },
      {
        id: "unique", group: "atelier",
        label: "Is every piece unique?",
        keywords: ["unique", "identical", "same", "batch", "copy", "reproduction"],
        answer: "Yes. No two pieces of wood are alike, so every sculpture is one of a kind. The drawings are originals. The jewelry is made in small batches, and each pair keeps its own nuances. Once a piece is gone, it never comes back exactly the same.",
        next: ["surmesure", "commande"]
      },
      {
        id: "surmesure", group: "pratique",
        label: "A custom piece?",
        keywords: ["custom", "personalis", "personaliz", "gift", "bespoke", "special"],
        answer: "Gladly! Émilie also makes custom pieces, for a gift or a special idea: a lighthouse that recalls a beloved place, chosen colors… Describe your idea through the Contact page and she'll tell you what she can imagine.",
        next: ["commande", "contact"]
      },
      {
        id: "commande", group: "pratique",
        label: "How to order?",
        keywords: ["order", "buy", "shop", "choose", "selection", "basket"],
        answer: "Browse the shop, add the pieces you like to your selection (basket icon at the top), then click \"Send my request\": your selection goes straight to Émilie through the contact form.",
        next: ["paiement", "livraison"]
      },
      {
        id: "paiement", group: "pratique",
        label: "Payment methods",
        keywords: ["payment", "pay", "card", "transfer", "cash", "price", "cost", "how much"],
        answer: "This site is currently a demo showcase, with no online payment. Send your selection through the contact form: Émilie will get back to you to arrange payment together.",
        next: ["livraison"]
      },
      {
        id: "livraison", group: "pratique",
        label: "Shipping and timing",
        keywords: ["shipping", "delivery", "ship", "transport", "receive", "parcel"],
        answer: "Every piece is carefully packed and sent with tracking. Hand delivery is possible around Chartres. For an exact timeline on a piece, the easiest is to write to Émilie.",
        next: ["contact"]
      },
      {
        id: "contact", group: "pratique",
        label: "Where is the workshop?",
        keywords: ["workshop", "contact", "address", "located", "where", "chartres", "reach", "email", "instagram", "pinterest"],
        answer: "The workshop is in Saint-Georges-sur-Eure, near Chartres (Eure-et-Loir, France). To reach Émilie: the form on the Contact page, or Instagram and Pinterest (links at the bottom of the page).",
        next: ["surmesure"]
      }
    ]
  },
  es: {
    title: "En el taller de Émilie",
    subtitle: "Cómo nacen sus creaciones",
    placeholder: "Escribe tu pregunta…",
    greeting: "¡Hola y bienvenido al taller! Aquí nada se fabrica en serie: cada pieza nace de las manos de Émilie, con paciencia y mucho cariño. ¿Qué quieres descubrir?",
    fallback: "No tengo una respuesta preparada para eso. Lo mejor es preguntárselo directamente a Émilie: le encanta hablar de su trabajo.",
    fallbackCta: "Escribir a Émilie",
    launcherLabel: "Secretos del taller",
    groups: { atelier: "El oficio", pratique: "Pedidos" },
    nextLabel: "Para seguir:",
    allQuestions: "Todas las preguntas",
    topics: [
      {
        id: "bois", group: "atelier",
        label: "¿Cómo nace una escultura de madera?",
        keywords: ["faro", "acantilado", "pueblo", "casa", "escult", "tocon", "roble", "velero", "barco", "puerto", "decor"],
        answer: "Todo empieza por la propia madera. Un tocón de roble o un trozo de madera flotante ya ha sido esculpido por la naturaleza: su forma guía a Émilie y decide si será un acantilado, una orilla o un puerto. Después talla los relieves y añade uno a uno los pequeños detalles: las casas acurrucadas en la roca, las escaleras que serpentean, los caminos de guijarros y, por último, los matices de azul y blanco que evocan la espuma de las olas.",
        next: ["temps", "origine", "unique"]
      },
      {
        id: "origine", group: "atelier",
        label: "¿De dónde viene la madera?",
        keywords: ["de donde", "origen", "recog", "encuentra", "madera flotante", "rio", "playa"],
        answer: "De la orilla del agua y del bosque. La madera flotante se recoge en las orillas, ya pulida por el agua y el tiempo; los tocones de roble conservan las vetas y los huecos de toda una vida de árbol. Émilie trabaja la materia tal como es, sin borrar sus marcas: son ellas las que dan carácter a cada pieza.",
        next: ["bois", "elements"]
      },
      {
        id: "temps", group: "atelier",
        label: "¿Cuánto tiempo lleva una pieza?",
        keywords: ["cuanto tiempo", "tiempo", "horas", "dias", "duracion"],
        answer: "El tiempo que haga falta. Tallar, lijar, modelar las casitas, colocar escaleras y barandillas, pintar la espuma, dejar secar… Una escultura requiere muchas horas repartidas en varios días. Émilie prefiere tomarse su tiempo antes que apresurar una pieza: la paciencia forma parte de su trabajo.",
        next: ["passion", "unique"]
      },
      {
        id: "bijoux", group: "atelier",
        label: "¿Cómo se hacen las joyas?",
        keywords: ["joya", "pendiente", "arcilla", "colgante", "collar", "color", "marmol"],
        answer: "Cada par se modela a mano en arcilla. Émilie compone sus propios colores y motivos (vetas marmoladas, degradados de azules, destellos dorados), recorta las formas y las monta con fornituras doradas. Como todo se hace a mano, en pequeñas series, dos pares nunca son exactamente iguales: esas ligeras variaciones son la firma de lo hecho a mano.",
        next: ["elements", "unique"]
      },
      {
        id: "dessins", group: "atelier",
        label: "¿Cómo nacen sus dibujos?",
        keywords: ["dibujo", "ilustracion", "cuadro", "marco", "zorro", "flor", "pajaro", "insouciance", "intuition", "resilience"],
        answer: "Trazo a trazo, a mano, con gran minuciosidad. Flores, un zorro, un pájaro… cada dibujo lleva un nombre (Insouciance, Intuition, Résilience), como una emoción que Émilie quiso fijar en el papel. Son obras originales enmarcadas, no reproducciones.",
        next: ["passion", "elements"]
      },
      {
        id: "passion", group: "atelier",
        label: "¿Por qué hacerlo todo a mano?",
        keywords: ["a mano", "pasion", "corazon", "amor", "terap", "sentido", "emilie", "quien es"],
        answer: "Para Émilie, crear es mucho más que un oficio: es una forma de respirar. Hipersensible y perfeccionista, así se describe ella, pone una parte de sí misma en cada pieza. Hacer a mano es tomarse el tiempo, respetar la materia y ofrecer un objeto con alma e historia. Su página «Nuestra historia» cuenta cómo la creación se convirtió para ella en una manera de estar bien.",
        next: ["elements", "surmesure"]
      },
      {
        id: "elements", group: "atelier",
        label: "¿Por qué los cinco elementos?",
        keywords: ["elemento", "agua", "tierra", "fuego", "eter", "naturaleza", "inspir"],
        answer: "ELEMENT son el agua, la tierra, el fuego, el aire y el éter, ese espíritu que une todas las cosas. Cada creación nace de uno de ellos: el azul de las olas, el ocre de la roca, el brillo dorado de una joya o la luz de un faro, la ligereza de una vela. En la página de inicio puedes elegir tu elemento: el sonido ambiente cambia con él.",
        next: ["bois", "bijoux", "dessins"]
      },
      {
        id: "unique", group: "atelier",
        label: "¿Cada pieza es única?",
        keywords: ["unica", "unico", "identic", "igual", "serie", "copia", "reproduccion"],
        answer: "Sí. Ningún trozo de madera se parece a otro, así que cada escultura es única. Los dibujos son originales. Las joyas se hacen en pequeñas series y cada par conserva sus propios matices. Cuando una pieza se va, nunca vuelve idéntica.",
        next: ["surmesure", "commande"]
      },
      {
        id: "surmesure", group: "pratique",
        label: "¿Una pieza a medida?",
        keywords: ["personaliz", "a medida", "regalo", "especial", "encargo"],
        answer: "¡Con mucho gusto! Émilie también crea piezas personalizadas, para un regalo o una idea especial: un faro que recuerde un lugar querido, colores elegidos… Cuéntale tu idea en la página de Contacto y te dirá lo que puede imaginar.",
        next: ["commande", "contact"]
      },
      {
        id: "commande", group: "pratique",
        label: "¿Cómo pedir?",
        keywords: ["pedir", "comprar", "tienda", "elegir", "seleccion", "cesta"],
        answer: "Explora la tienda, añade las piezas que te gusten a tu selección (icono de cesta arriba) y pulsa «Enviar mi solicitud»: tu selección llega directamente a Émilie mediante el formulario de contacto.",
        next: ["paiement", "livraison"]
      },
      {
        id: "paiement", group: "pratique",
        label: "Métodos de pago",
        keywords: ["pago", "pagar", "tarjeta", "transferencia", "efectivo", "precio", "cuanto cuesta"],
        answer: "Por ahora esta web es una demostración, sin pago en línea. Envía tu selección mediante el formulario de contacto: Émilie te responderá para acordar el pago juntas.",
        next: ["livraison"]
      },
      {
        id: "livraison", group: "pratique",
        label: "Envío y plazos",
        keywords: ["envio", "entrega", "transporte", "recibir", "paquete"],
        answer: "Cada pieza se embala con cuidado y se envía con seguimiento. Es posible la entrega en mano en la zona de Chartres. Para un plazo exacto, lo más sencillo es escribir a Émilie.",
        next: ["contact"]
      },
      {
        id: "contact", group: "pratique",
        label: "¿Dónde está el taller?",
        keywords: ["taller", "contacto", "direccion", "situado", "donde", "chartres", "email", "instagram", "pinterest"],
        answer: "El taller está en Saint-Georges-sur-Eure, cerca de Chartres (Eure-et-Loir, Francia). Para contactar a Émilie: el formulario de la página de Contacto, o Instagram y Pinterest (enlaces al pie de página).",
        next: ["surmesure"]
      }
    ]
  }
};

function chatLang(){
  return (typeof getCurrentLang === "function" && CHAT_KB[getCurrentLang()]) ? getCurrentLang() : "fr";
}
function chatStripAccents(s){
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function findTopic(message){
  const kb = CHAT_KB[chatLang()];
  const norm = chatStripAccents(message.toLowerCase());
  let best = null, bestScore = 0;
  kb.topics.forEach(topic => {
    let score = 0;
    // Les mots-cles longs (plus precis) comptent davantage que les courts
    topic.keywords.forEach(kw => { if (norm.indexOf(chatStripAccents(kw)) !== -1) score += kw.length; });
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
      <span class="ms chat-bubble-icon" aria-hidden="true">chat_bubble</span>
      <span class="ms chat-bubble-close" aria-hidden="true">close</span>
      <span class="chat-bubble-label"></span>
    </button>
    <div class="chat-panel" role="dialog" aria-label="Assistant">
      <div class="chat-header">
        <img class="chat-avatar" src="assets/img/site/logo.png" alt="">
        <div>
          <strong class="chat-title"></strong>
          <span class="chat-subtitle"></span>
        </div>
      </div>
      <div class="chat-messages" aria-live="polite"></div>
      <div class="chat-quick-replies"></div>
      <form class="chat-input-row">
        <input type="text" class="chat-input" autocomplete="off">
        <button type="submit" class="chat-send" aria-label="Envoyer">
          <span class="ms" aria-hidden="true">arrow_forward</span>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  const bubble = wrap.querySelector(".chat-bubble");
  const messages = wrap.querySelector(".chat-messages");
  const quickReplies = wrap.querySelector(".chat-quick-replies");
  const form = wrap.querySelector(".chat-input-row");
  const input = wrap.querySelector(".chat-input");
  let greeted = false;

  function scrollDown(){ messages.scrollTop = messages.scrollHeight; }

  function addMessage(text, who){
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-" + who;
    row.textContent = text;
    messages.appendChild(row);
    scrollDown();
    return row;
  }

  // Petite attente "Émilie ecrit..." avant chaque reponse, pour un echange plus naturel
  function replyWith(render){
    const typing = document.createElement("div");
    typing.className = "chat-msg chat-msg-bot chat-typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    messages.appendChild(typing);
    scrollDown();
    setTimeout(() => { typing.remove(); render(); }, 650);
  }

  function chipFor(topic){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chat-chip";
    btn.textContent = topic.label;
    btn.addEventListener("click", () => ask(topic));
    return btn;
  }

  function addFollowUps(topic){
    const kb = CHAT_KB[chatLang()];
    const next = (topic.next || []).map(id => kb.topics.find(x => x.id === id)).filter(Boolean);
    if (!next.length) return;
    const box = document.createElement("div");
    box.className = "chat-followups";
    const label = document.createElement("span");
    label.textContent = kb.nextLabel;
    box.appendChild(label);
    next.forEach(t => box.appendChild(chipFor(t)));
    messages.appendChild(box);
    scrollDown();
  }

  function answer(topic){
    replyWith(() => {
      addMessage(topic.answer, "bot");
      addFollowUps(topic);
    });
  }

  // Apres la premiere question, la liste se replie pour laisser la place a la conversation
  function collapseQuestions(){ quickReplies.classList.add("is-collapsed"); }

  function ask(topic){
    collapseQuestions();
    addMessage(topic.label, "user");
    answer(topic);
  }

  function addFallback(){
    const kb = CHAT_KB[chatLang()];
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-bot";
    row.innerHTML = `<span></span><a href="contact.html" class="chat-fallback-cta"></a>`;
    row.querySelector("span").textContent = kb.fallback;
    row.querySelector(".chat-fallback-cta").textContent = kb.fallbackCta;
    messages.appendChild(row);
    scrollDown();
  }

  // Questions de depart, rangees par groupe : le savoir-faire d'abord, la commande ensuite
  function renderQuickReplies(){
    const kb = CHAT_KB[chatLang()];
    quickReplies.innerHTML = "";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "chat-all-toggle";
    toggle.textContent = kb.allQuestions;
    toggle.addEventListener("click", () => quickReplies.classList.remove("is-collapsed"));
    quickReplies.appendChild(toggle);
    Object.entries(kb.groups).forEach(([group, label]) => {
      const title = document.createElement("span");
      title.className = "chat-group-label";
      title.textContent = label;
      quickReplies.appendChild(title);
      const row = document.createElement("div");
      row.className = "chat-group";
      kb.topics.filter(t => t.group === group).forEach(t => row.appendChild(chipFor(t)));
      quickReplies.appendChild(row);
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
    collapseQuestions();
    addMessage(value, "user");
    input.value = "";
    const topic = findTopic(value);
    if (topic) answer(topic);
    else replyWith(addFallback);
  });

  renderStrings();
  document.addEventListener("langchange", renderStrings);
}

document.addEventListener("DOMContentLoaded", buildChatWidget);
