// Catalogue ELEMENT by Lilly — genere depuis le site actuel (photos et prix reels)
const PRODUCTS = [
  {
    "id": "le-phare-des-marees",
    "category": "decorations-a-poser",
    "name": "Le Phare des marées",
    "price": 90,
    "image": "assets/img/products/le-phare-des-marees-1.jpg",
    "gallery": [
      "assets/img/products/le-phare-des-marees-1.jpg",
      "assets/img/products/le-phare-des-marees-2.jpg",
      "assets/img/products/le-phare-des-marees-3.jpg",
      "assets/img/products/le-phare-des-marees-4.jpg",
      "assets/img/products/le-phare-des-marees-5.jpg",
      "assets/img/products/le-phare-des-marees-6.jpg"
    ],
    "elements": [
      "bois",
      "eau",
      "terre"
    ],
    "description": [
      "Entièrement façonnée à la main à partir d'une souche de chêne, cette sculpture unique invite à l'évasion et à la rêverie. Au sommet d'une falaise sculptée par la nature se dresse un phare aux teintes douces, veillant sur un petit village côtier niché dans les reliefs du bois.",
      "Chaque détail a été minutieusement travaillé : les petites maisons blotties dans la roche, les escaliers qui serpentent le long de la falaise, les chemins de galets et les nuances de bleu et de blanc évoquant l'écume des vagues venant caresser le rivage.",
      "Cette création artisanale est une invitation au voyage, un hommage aux paysages marins et à la beauté des matières naturelles. Elle trouvera sa place dans un intérieur chaleureux, une maison de bord de mer ou chez tous ceux qui aiment les objets décoratifs porteurs d'une âme et d'une histoire.",
      "Parce qu'aucune souche ne ressemble à une autre, cette œuvre est une pièce unique, façonnée avec patience, imagination et passion."
    ]
  },
  {
    "id": "maison-en-bois",
    "category": "decorations-a-poser",
    "name": "Maison en bois",
    "price": 80,
    "image": "assets/img/products/maison-en-bois.jpg",
    "elements": [
      "bois"
    ]
  },
  {
    "id": "navire-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Navire en bois flotté",
    "price": 79,
    "image": "assets/img/products/navire-en-bois-flott.jpg",
    "elements": [
      "bois",
      "vent"
    ]
  },
  {
    "id": "phare-cotier-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Phare côtier en bois flotté",
    "price": 60,
    "image": "assets/img/products/phare-c-tier-en-bois-flott.jpg",
    "elements": [
      "bois",
      "eau"
    ]
  },
  {
    "id": "port-cotier",
    "category": "decorations-a-poser",
    "name": "Port côtier",
    "price": 100,
    "image": "assets/img/products/port-c-tier.jpg",
    "elements": [
      "bois",
      "eau"
    ]
  },
  {
    "id": "village-cotier",
    "category": "decorations-a-poser",
    "name": "Village côtier",
    "price": 80,
    "image": "assets/img/products/village-c-tier.jpg",
    "elements": [
      "bois",
      "eau"
    ]
  },
  {
    "id": "village-de-pecheurs-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Village de pêcheurs en bois flotté",
    "price": 100,
    "image": "assets/img/products/village-de-p-cheurs-en-bois-flott.jpg",
    "elements": [
      "bois",
      "vent"
    ]
  },
  {
    "id": "voilier-en-bois-flotte-et-voile-en-toile-de-lin",
    "category": "decorations-a-poser",
    "name": "Voilier en bois flotté et voile en toile de lin",
    "price": 120,
    "image": "assets/img/products/voilier-en-bois-flott-et-voile-en-toile-de-lin.jpg",
    "elements": [
      "bois",
      "vent"
    ]
  },
  {
    "id": "hotel-en-bois",
    "category": "decorations-a-poser",
    "name": "Hôtel en bois",
    "price": 75,
    "image": "assets/img/products/h-tel-en-bois.jpg",
    "elements": [
      "bois",
      "terre"
    ]
  },
  {
    "id": "insouciance",
    "category": "illustrations",
    "name": "Insouciance",
    "price": 210,
    "image": "assets/img/products/insouciance.jpg",
    "elements": [
      "vent",
      "terre",
      "ether"
    ]
  },
  {
    "id": "intuition",
    "category": "illustrations",
    "name": "Intuition",
    "price": 210,
    "image": "assets/img/products/intuition.jpg",
    "elements": [
      "bois",
      "ether"
    ]
  },
  {
    "id": "resilience",
    "category": "illustrations",
    "name": "Résilience",
    "price": 210,
    "image": "assets/img/products/r-silience.jpg",
    "elements": [
      "vent",
      "eau",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-bleu-de-glace-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Bleu de glace\"",
    "price": 28,
    "image": "assets/img/products/boucles-d-oreilles-bleu-de-glace.jpg",
    "elements": [
      "eau"
    ]
  },
  {
    "id": "boucles-d-oreilles-creole-bohemian-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles créole \"Bohémian\"",
    "price": 15,
    "image": "assets/img/products/boucles-d-oreilles-cr-ole-boh-mian.jpg",
    "elements": [
      "terre",
      "vent"
    ]
  },
  {
    "id": "boucles-d-oreilles-eclat-celeste",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Éclat Céleste\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-clat-c-leste.jpg",
    "elements": [
      "eau",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-eclats-d-azur-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Éclats d'azur\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-clats-d-azur.jpg",
    "elements": [
      "eau"
    ]
  },
  {
    "id": "boucles-d-oreilles-egyptian",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Egyptian\"",
    "price": 20,
    "image": "assets/img/products/boucles-d-oreilles-egyptian.jpg",
    "elements": [
      "terre",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-egyptian-bleu",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Egyptian bleu\"",
    "price": 20,
    "image": "assets/img/products/boucles-d-oreilles-egyptian-bleu.jpg",
    "elements": [
      "terre",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-elegance-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Élégance\"",
    "price": 28,
    "image": "assets/img/products/boucles-d-oreilles-l-gance.jpg",
    "elements": [
      "eau"
    ]
  },
  {
    "id": "boucles-d-oreilles-fleur-de-marbre-bleu-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Fleur de marbre bleu\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-fleur-de-marbre-bleu.jpg",
    "elements": [
      "eau",
      "vent"
    ]
  },
  {
    "id": "boucles-d-oreilles-marbre-dore-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Marbre doré\"",
    "price": 28,
    "image": "assets/img/products/boucles-d-oreilles-marbre-dor.jpg",
    "elements": [
      "terre",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-ocean-d-or-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Océan d'or\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-oc-an-d-or.jpg",
    "elements": [
      "eau",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-pastel-d-eau-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Pastel d'eau\"",
    "price": 28,
    "image": "assets/img/products/boucles-d-oreilles-pastel-d-eau.jpg",
    "elements": [
      "eau",
      "terre"
    ]
  },
  {
    "id": "boucles-d-oreilles-reve-azur",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Rêve azur\"",
    "price": 25,
    "image": "assets/img/products/boucles-d-oreilles-r-ve-azur.jpg",
    "elements": [
      "eau",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-rosee-du-matin-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Rosée du matin\"",
    "price": 15,
    "image": "assets/img/products/boucles-d-oreilles-ros-e-du-matin.jpg",
    "elements": [
      "terre",
      "vent"
    ]
  },
  {
    "id": "boucles-d-oreilles-serenite",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Sérénité\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-s-r-nit.jpg",
    "elements": [
      "eau",
      "ether"
    ]
  },
  {
    "id": "boucles-d-oreilles-terre-de-lune-1",
    "category": "bijoux",
    "name": "Boucles d’oreilles \"Terre de lune\"",
    "price": 30,
    "image": "assets/img/products/boucles-d-oreilles-terre-de-lune.jpg",
    "elements": [
      "terre",
      "eau"
    ]
  },
  {
    "id": "boucles-d-oreilles-triangle-bleu",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Triangle bleu\"",
    "price": 28,
    "image": "assets/img/products/boucles-d-oreilles-triangle-bleu.jpg",
    "elements": [
      "eau",
      "ether"
    ]
  }
];

const CATEGORY_ORDER = ["decorations-a-poser", "illustrations", "bijoux"];

// Les cinq elements de la marque — chaque creation est rattachee a ceux qui l'ont inspiree
const ELEMENT_ORDER = ["eau", "terre", "bois", "vent", "ether"];
