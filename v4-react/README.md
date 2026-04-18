#  Portfolio FullStack — SPA React

Application Web SPA (Single Page Application) de gestion de portfolio développée avec React JS + JSON Server comme API REST factice.

---

  Architecture des composants

```
App.jsx              → Composant racine : état global, CRUD, navigation
│
├── Navbar.jsx       → Barre de navigation fixe avec liens SPA
├── Accueil.jsx      → Section d'accueil (hero)
├── Dossier.jsx      → Gestion de la liste des projets (stocker, afficher, rechercher, supprimer)
│   └── Projet.jsx   → Carte d'un projet (libellé, image, bouton Supprimer)
├── AjouterProjet.jsx→ Formulaire d'ajout ET d'édition d'un projet
├── DetaillerProjet.jsx → Détail complet d'un projet (boutons Annuler, Éditer, Supprimer)
├── Contact.jsx      → Formulaire de contact
└── Footer.jsx       → Pied de page avec liens et réseaux sociaux
```

---

  Installation et lancement

# Prérequis
- Node.js 18+
- npm 9+

# 1. Installer les dépendances
```bash
npm install
```

# 2. Lancer l'application (dev + json-server simultanément)
```bash
npm run start
```

Cela lance :
- React (Vite) sur `http://localhost:5173`
- JSON Server sur `http://localhost:3001`

# Lancer séparément (si besoin)
```bash
# Terminal 1 — API REST
npm run server

# Terminal 2 — Application React
npm run dev
```

---

  API REST (JSON Server)

Base URL : `http://localhost:3001`

| Méthode | Endpoint          | Description              |
|---------|-------------------|--------------------------|
| GET     | `/projets`        | Liste tous les projets   |
| GET     | `/projets/:id`    | Détail d'un projet       |
| POST    | `/projets`        | Ajouter un projet        |
| PUT     | `/projets/:id`    | Modifier un projet       |
| DELETE  | `/projets/:id`    | Supprimer un projet      |

---

 Fonctionnalités

-  Affichage des projets en grille responsive
-  Ajout d'un projet (libellé, description, image/URL, technologies)
-  Suppression avec confirmation
-  Détail d'un projet (clic sur le libellé = ancre)
-  Édition d'un projet depuis le détail
-  Recherche en temps réel (libellé + technologies)
-  Persistance via json-server (REST API)
-  Upload d'image (base64) ou URL externe
-  Notifications toast (succès / erreur)
-  Navigation SPA sans rechargement de page

---

  Structure des données (`db.json`)

```json
{
  "projets": [
    {
      "id": 1,
      "libelle": "Nom du projet",
      "description": "Description détaillée...",
      "image": "https://...",
      "technologies": ["React", "Node.js"],
      "date": "2024-03-15"
    }
  ]
}
```

---

  Stack technique

- React 18 — UI composants
- Vite 5 — Bundler ultra-rapide
- Tailwind CSS 3 — Styles utilitaires
- JSON Server — API REST factice
- concurrently — Lancement simultané dev + server
- Font Awesome 6 — Icônes
- Google Fonts — Syne (titres) + DM Sans (texte)
