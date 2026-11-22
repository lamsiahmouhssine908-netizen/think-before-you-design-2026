# Think Before You Design 2026 — CtrlArt × FSBM

Site officiel de l’événement **Think Before You Design 2026**, organisé par le club **CtrlArt** à la **Faculté des Sciences Ben M’Sick (FSBM — Université Hassan II de Casablanca)** et la **Bibliothèque Universitaire Mohamed Sekkat (BUMS)** les **28 novembre et 5 décembre 2026**.

## Structure du projet

```text
├── index.html          # Page principale (Accueil, Intervenants, Billetterie QR, Contact équipe)
├── contact.html        # Coordonnées officielles CtrlArt & FSBM
├── css/
│   └── styles.css      # Feuille de style complète (thèmes sombre/clair, orbites intervenants, billet)
├── js/
│   ├── qrcode.js       # Générateur QR Code 100 % local (sans serveur externe)
│   ├── theme.js        # Gestion du thème (sombre/clair) et bilinguisme (FR/EN)
│   ├── speakers.js     # Carrousel orbital interactif des intervenants (Mouhssine Lamsiah & Abdelbasset Tassine)
│   └── app.js          # Validation du formulaire et génération instantanée du billet PNG/PDF
└── assets/
    ├── fonts/          # Polices Forevs & ForevsBlack
    ├── logos/          # Logos officiels CtrlArt, INJAZ Al-Maghrib et FSBM
    ├── media/          # Vidéo d’introduction et arrière-plan
    ├── speakers/       # Portraits et arrière-plans locaux des intervenants (portraits et arrière-plans locaux)
    └── team/           # Portraits de l’équipe CtrlArt
```

## Déploiement (GitHub Pages / Cloudflare Pages / Netlify)

Ce site est **100 % autonome (statique)** : aucun serveur, aucun OTP et aucune dépendance Google Apps Script ou Gmail ne sont requis.
1. Créez un dépôt sur **GitHub** et poussez l’ensemble de ces fichiers à la racine.
2. Activez **GitHub Pages** (`Settings → Pages → Deploy from a branch: main / root`) ou connectez le dépôt à **Cloudflare Pages**.
