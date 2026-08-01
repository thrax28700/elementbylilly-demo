// Catalogue ELEMENT by Lilly — genere depuis le site actuel (photos et prix reels)
const PRODUCTS = [
  {
    "id": "boucles-d-oreilles-bleu-de-glace-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Bleu de glace\"",
    "price": 28.0,
    "image": "assets/img/products/boucles-d-oreilles-bleu-de-glace.jpg"
  },
  {
    "id": "boucles-d-oreilles-creole-bohemian-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles créole \"Bohémian\"",
    "price": 15.0,
    "image": "assets/img/products/boucles-d-oreilles-cr-ole-boh-mian.jpg"
  },
  {
    "id": "boucles-d-oreilles-eclat-celeste",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Éclat Céleste\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-clat-c-leste.jpg"
  },
  {
    "id": "boucles-d-oreilles-eclats-d-azur-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Éclats d'azur\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-clats-d-azur.jpg"
  },
  {
    "id": "boucles-d-oreilles-egyptian",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Egyptian\"",
    "price": 20.0,
    "image": "assets/img/products/boucles-d-oreilles-egyptian.jpg"
  },
  {
    "id": "boucles-d-oreilles-egyptian-bleu",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Egyptian bleu\"",
    "price": 20.0,
    "image": "assets/img/products/boucles-d-oreilles-egyptian-bleu.jpg"
  },
  {
    "id": "boucles-d-oreilles-elegance-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Élégance\"",
    "price": 28.0,
    "image": "assets/img/products/boucles-d-oreilles-l-gance.jpg"
  },
  {
    "id": "boucles-d-oreilles-fleur-de-marbre-bleu-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Fleur de marbre bleu\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-fleur-de-marbre-bleu.jpg"
  },
  {
    "id": "boucles-d-oreilles-marbre-dore-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Marbre doré\"",
    "price": 28.0,
    "image": "assets/img/products/boucles-d-oreilles-marbre-dor.jpg"
  },
  {
    "id": "boucles-d-oreilles-ocean-d-or-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Océan d'or\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-oc-an-d-or.jpg"
  },
  {
    "id": "boucles-d-oreilles-pastel-d-eau-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Pastel d'eau\"",
    "price": 28.0,
    "image": "assets/img/products/boucles-d-oreilles-pastel-d-eau.jpg"
  },
  {
    "id": "boucles-d-oreilles-reve-azur",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Rêve azur\"",
    "price": 25.0,
    "image": "assets/img/products/boucles-d-oreilles-r-ve-azur.jpg"
  },
  {
    "id": "boucles-d-oreilles-rosee-du-matin-1",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Rosée du matin\"",
    "price": 15.0,
    "image": "assets/img/products/boucles-d-oreilles-ros-e-du-matin.jpg"
  },
  {
    "id": "boucles-d-oreilles-serenite",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Sérénité\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-s-r-nit.jpg"
  },
  {
    "id": "boucles-d-oreilles-terre-de-lune-1",
    "category": "bijoux",
    "name": "Boucles d’oreilles \"Terre de lune\"",
    "price": 30.0,
    "image": "assets/img/products/boucles-d-oreilles-terre-de-lune.jpg"
  },
  {
    "id": "boucles-d-oreilles-triangle-bleu",
    "category": "bijoux",
    "name": "Boucles d'oreilles \"Triangle bleu\"",
    "price": 28.0,
    "image": "assets/img/products/boucles-d-oreilles-triangle-bleu.jpg"
  },
  {
    "id": "maison-en-bois",
    "category": "decorations-a-poser",
    "name": "Maison en bois",
    "price": 80.0,
    "image": "assets/img/products/maison-en-bois.jpg"
  },
  {
    "id": "navire-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Navire en bois flotté",
    "price": 79.0,
    "image": "assets/img/products/navire-en-bois-flott.jpg"
  },
  {
    "id": "phare-cotier-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Phare côtier en bois flotté",
    "price": 60.0,
    "image": "assets/img/products/phare-c-tier-en-bois-flott.jpg"
  },
  {
    "id": "port-cotier",
    "category": "decorations-a-poser",
    "name": "Port côtier",
    "price": 100.0,
    "image": "assets/img/products/port-c-tier.jpg"
  },
  {
    "id": "village-cotier",
    "category": "decorations-a-poser",
    "name": "Village côtier",
    "price": 80.0,
    "image": "assets/img/products/village-c-tier.jpg"
  },
  {
    "id": "village-de-pecheurs-en-bois-flotte",
    "category": "decorations-a-poser",
    "name": "Village de pêcheurs en bois flotté",
    "price": 100.0,
    "image": "assets/img/products/village-de-p-cheurs-en-bois-flott.jpg"
  },
  {
    "id": "voilier-en-bois-flotte-et-voile-en-toile-de-lin",
    "category": "decorations-a-poser",
    "name": "Voilier en bois flotté et voile en toile de lin",
    "price": 120.0,
    "image": "assets/img/products/voilier-en-bois-flott-et-voile-en-toile-de-lin.jpg"
  },
  {
    "id": "hotel-en-bois",
    "category": "decorations-murales",
    "name": "Hôtel en bois",
    "price": 75.0,
    "image": "assets/img/products/h-tel-en-bois.jpg"
  },
  {
    "id": "insouciance",
    "category": "illustrations",
    "name": "Insouciance",
    "price": 210.0,
    "image": "assets/img/products/insouciance.jpg"
  },
  {
    "id": "intuition",
    "category": "illustrations",
    "name": "Intuition",
    "price": 210.0,
    "image": "assets/img/products/intuition.jpg"
  },
  {
    "id": "resilience",
    "category": "illustrations",
    "name": "Résilience",
    "price": 210.0,
    "image": "assets/img/products/r-silience.jpg"
  }
];

const CATEGORY_ORDER = ["bijoux", "decorations-a-poser", "decorations-murales", "illustrations"];
