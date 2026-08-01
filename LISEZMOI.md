# ELEMENT by Lilly — site de démonstration

Ce dossier contient un site vitrine complet, construit à partir des **vraies photos et vrais prix** actuellement en ligne sur elementbylilly.fr (27 articles répartis en 4 catégories), avec une nouvelle page de couverture, une identité "zen / nature", un site multilingue (FR / EN / ES), une version installable comme application mobile (PWA), et un générateur de QR code pour les pubs.

C'est un **prototype à montrer à Lilly** — aucun code n'est requis de sa part pour le voir en ligne.

## 1. Mettre le site en ligne gratuitement (5 minutes, sans compte technique)

**Option recommandée : Netlify Drop**
1. Aller sur https://app.netlify.com/drop
2. Glisser-déposer tout le dossier `ELEMENTBYLILLY` dans la page.
3. Netlify donne immédiatement une adresse du type `https://nom-au-hasard.netlify.app` — le site est en ligne, gratuitement, sans carte bancaire.
4. (Optionnel) Dans les réglages Netlify, on peut renommer le sous-domaine ou brancher un vrai nom de domaine plus tard.

**Alternative : GitHub Pages**
1. Créer un dépôt GitHub, y déposer tous les fichiers de ce dossier.
2. Dans Settings → Pages, activer la publication depuis la branche `main`.
3. Le site sera accessible à `https://votre-compte.github.io/nom-du-depot/`.

Les deux solutions sont gratuites à vie pour ce type de site (aucun serveur/paiement nécessaire).

## 2. Installer le site comme une application mobile

Une fois en ligne : ouvrir le site sur un téléphone (Chrome Android ou Safari iOS), puis :
- **Android/Chrome** : un bandeau « Installer l'application » apparaît automatiquement (ou menu ⋮ → "Ajouter à l'écran d'accueil").
- **iPhone/Safari** : bouton Partager → "Sur l'écran d'accueil".

Le site s'ouvre alors en plein écran, avec sa propre icône, comme une vraie appli. (Note honnête : ce n'est pas une application distribuée sur l'App Store / Play Store — ça, c'est un projet à part, bien plus lourd. Ceci est une "PWA", la solution gratuite et immédiate.)

## 3. Générer un QR code pour vos pubs / flyers

Aller sur la page `qrcode.html` du site (lien discret en pied de page). On peut y entrer n'importe quel lien (l'adresse du site une fois en ligne, l'Instagram, le Pinterest…), choisir une couleur de la charte, et télécharger un PNG haute résolution ou un SVG (idéal pour l'impression). Tout se passe dans le navigateur, aucune donnée n'est envoyée à un serveur externe.

## 4. Ce qu'il reste à personnaliser avant un vrai lancement

- **Email de contact** : le formulaire de contact (`js/contact.js`, ligne `CONTACT_EMAIL`) utilise actuellement l'adresse provisoire `contact@elementbylilly.fr`. À remplacer par la vraie adresse de Lilly.
- **Paiement** : ce site est une **vitrine de démonstration**, il n'y a pas de tunnel de paiement. Le bouton "Ajouter à ma sélection" fonctionne comme une liste d'envies : le visiteur envoie sa demande par email, à charge pour Lilly de facturer comme elle le souhaite (ou d'ajouter plus tard un vrai module de paiement type Stripe/PayPal si elle quitte SumUp).
- **Nom de domaine** : si Lilly veut garder `elementbylilly.fr`, il faudra le repointer vers le nouvel hébergement le jour où elle bascule pour de bon.

## 5. Structure du projet

```
index.html          → Accueil (nouvelle page de couverture)
boutique.html        → Catalogue complet avec filtres par catégorie
histoire.html        → Biographie de la marque
contact.html          → Formulaire de contact
qrcode.html           → Générateur de QR code
css/style.css         → Toute l'identité visuelle
js/products.js        → Catalogue (généré depuis le site actuel)
js/i18n.js             → Traductions FR / EN / ES
js/catalog.js, main.js, contact.js, qrcode-tool.js → comportements du site
manifest.json, sw.js  → application mobile installable (PWA)
assets/img/products/  → 27 photos produits (optimisées, ~1,3 Mo au total)
assets/img/site/      → logo et icônes
```

Pour ajouter/modifier un produit plus tard : éditer `js/products.js` (nom, prix, catégorie, image dans `assets/img/products/`).
