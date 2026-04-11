let projets = [];
const API_URL = "http://localhost:3000/projets";

// Définition de la fonction creerProjet()

function creerProjet(id, libelle, image) {
  const article = document.createElement("article");
  article.id = "projet-" + id;
  article.className = "group bg-gray-800/75 rounded-xl overflow-hidden border border-transparent hover:border-teal-400 shadow-lg hover:shadow-xl transition-shadow duration-300";

  article.innerHTML = `
    <img src="${image}" alt="${libelle}" class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110">
    <div class="p-4">
      <h3 class="text-white text-2xl font-semibold mb-1">${libelle}</h3>
    </div>
    <div class="m-4 flex gap-2">
      <button onclick="detaillerProjet('${id}')"
        class="px-4 py-2 bg-teal-400 text-gray-900 rounded-lg font-medium hover:shadow-xl hover:shadow-teal-400/75 transition duration-300">
        Voir détails
      </button>
      <button onclick="supprimerProjet('${id}')"
        class="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-700 hover:text-white transition duration-300">
        Supprimer
      </button>
    </div>
  `;

  const grille = document.getElementById("grille-projets");
  grille.insertBefore(article, grille.firstChild);

  return article;
}


