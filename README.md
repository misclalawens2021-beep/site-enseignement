# E-enseignement — version statique HTML/CSS/JS

> Mis à jour pour suivre le **cahier des charges v3.0** et la **charte
> graphique v3.0** : équipe réelle (Mike, Berkan, Mathéo, Othman), 4
> catégories de compétences (Langages / Base de données / Web / Outils),
> échelle à 3 niveaux (Notions / Intermédiaire / Avancé), cours
> "Algorithmique" en 5 chapitres (chapitre 3 "Les boucles" conforme à la
> maquette), exercice "Table de multiplication" (F-50/F-51), les 4
> livrables exacts de la doc (cahier des charges, diagramme de cas
> d'utilisation, modèle de données, compte rendu IA), logo "E/" + logo
> Ynov dans l'en-tête, logo "E/" + LinkedIn/GitHub/Instagram en pied de
> page, adresse exacte F-74.

Conversion de la version PHP/MySQL en site 100% client (HTML/CSS/JavaScript),
sans backend : toutes les données proviennent de fichiers JSON dans `assets/data/`.

## ⚠️ Important : servir le site via HTTP

Le site utilise `fetch()` pour charger les fichiers JSON. Ça ne fonctionne
**pas** en ouvrant simplement `index.html` avec un double-clic (protocole
`file://`, bloqué par le navigateur). Il faut un serveur local, par exemple :

- Avec XAMPP : place le dossier `site` dans `C:\xampp\htdocs\`, démarre Apache,
  puis ouvre `http://localhost/site/`
- Avec Python : `python -m http.server 8000` puis `http://localhost:8000/`
- Avec VS Code : l'extension "Live Server"

## Structure

```
site/
├── index.html, groupe.html, cours.html, exercices.html,
│   documentation.html, contact.html, mentions.html
└── assets/
    ├── css/style.css       (inchangé)
    ├── js/
    │   ├── commun.js       (fonctions communes : e(), fetch JSON, menu mobile...)
    │   ├── index.js, groupe.js, cours.js, exercices.js,
    │   │   documentation.js, contact.js   (logique par page)
    ├── data/                (remplace la base MySQL)
    │   ├── site.json        (SITE_NOM, SITE_MAIL, etc.)
    │   ├── membres.json
    │   ├── entreprises.json
    │   ├── competences.json (categories + competences)
    │   ├── exercices.json   (langages + exercices)
    │   ├── cours.json       (cours > chapitres > examens, imbriqués)
    │   └── documents.json
    └── img/                 (logos placeholder — à remplacer par les vrais)
```

## Ce qui a changé par rapport à la version PHP

- **Aucune connexion base de données** : `db()`, PDO et les requêtes SQL ont
  disparu. Chaque page fait un `fetch()` vers le fichier JSON correspondant.
- **Le formulaire de contact** ne fait plus d'`INSERT` en base : les messages
  sont stockés dans le `localStorage` du navigateur (clé `messages_contact`),
  uniquement pour la démo.
- **Les filtres** (compétences par membre/catégorie, exercices par langage,
  chapitre sélectionné) restent pilotés par les paramètres d'URL (`?membre=`,
  `?langage=`, `?chapitre=`, `?exercice=`), comme en PHP, mais le filtrage se
  fait maintenant en JavaScript côté client.
- **Les données sont des exemples** : remplace le contenu des fichiers dans
  `assets/data/` par les vraies informations du groupe (membres, cours réels,
  exercices, etc.).
- **Les images des logos/icônes sont des placeholders** générés pour que le
  site fonctionne tout de suite — remplace-les par les fichiers originaux
  (`Ynov_2.jpg`, `YNOV_Campus_idgt8RaZcQ_0.png`, les deux SVG) dans
  `assets/img/`.

## Pages non converties

`config.exemple.php` et `config.php` n'ont plus lieu d'être (pas de base à
configurer). `fonctions.php` a son équivalent dans `assets/js/commun.js`.

## Encore à remplacer avant la mise en ligne (cf. "Notes de remise" de la charte)

- **Portraits des 4 membres** et **logos des entreprises** (actuellement
  des blocs texte "portrait 600×600" / pas de logo)
- **CV réels** en PDF dans `assets/cv/` (liens déjà en place)
- **Vrais noms d'entreprises** (actuellement "Entreprise A/B/C/D",
  seules A et B viennent de la charte — C et D sont des placeholders à
  compléter pour Mathéo et Othman)
- **Vrais documents** dans `assets/documents/` (cahier des charges,
  diagramme de cas d'utilisation, modèle de données, compte rendu IA)
- **Logo Ynov officiel** à la place du placeholder généré
  (`assets/img/YNOV_Campus_idgt8RaZcQ_0.png`)
- Accord de chaque membre avant publication des CV et noms d'entreprises
  (contrainte juridique du cahier des charges)
