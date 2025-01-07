// Définition de spriteList
const spriteList = [
    chrome.runtime.getURL("img/perso1.PNG"),
    chrome.runtime.getURL("img/perso2.PNG"),
    chrome.runtime.getURL("img/perso3.PNG"),
    chrome.runtime.getURL("img/perso4.PNG")
];

// Fonction pour récupérer la définition depuis l'API
async function fetchDefinition(word) {
    console.log(`Tentative de récupération de la définition pour le mot : ${word}`);
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        console.log('Données reçues de l\'API :', data);
        if (data && data.length > 0 && data[0].meanings.length > 0 && data[0].meanings[0].definitions.length > 0) {
            return data[0].meanings[0].definitions[0].definition;
        } else {
            return "Définition non trouvée.";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la définition :", error);
        return "Erreur lors de la récupération de la définition.";
    }
}

// Fonction pour afficher la popup
function showDefinitionPopup(posX, posY, definition, word) {
    console.log(`Affichage de la popup pour le mot '${word}' à (${posX}, ${posY})`);
    hideDefinitionPopup(); // Cache les popups précédentes

    const popup = document.createElement("div");
    popup.classList.add("definition-popup");
    popup.style.position = "absolute";
    popup.style.left = `${posX}px`;
    popup.style.top = `${posY}px`;
    popup.style.backgroundColor = "#fff";
    popup.style.border = "1px solid #000";
    popup.style.padding = "10px";
    popup.style.zIndex = "1000";
    popup.innerHTML = `
        <p>${definition}</p>
        <img src="${spriteList[0]}" alt="Sprite">
    `;
    document.body.appendChild(popup);
}
// Fonction pour cacher la popup
function hideDefinitionPopup() {
    console.log("Cache toutes les popups");
    const popups = document.querySelectorAll(".definition-popup");
    popups.forEach(popup => popup.remove());
}


// Fonction pour sauvegarder les définitions dans le localStorage
function saveToLocalStorage(word, definition, posX, posY) {
    const url = window.location.href;
    let savedDefinitions = JSON.parse(localStorage.getItem(url)) || [];

    // Vérifie si le mot est déjà sauvegardé pour cette page
    if (!savedDefinitions.some(entry => entry.word === word)) {
        savedDefinitions.push({ word, definition, posX, posY });
        localStorage.setItem(url, JSON.stringify(savedDefinitions));
        console.log(`Mot '${word}' enregistré pour cette page.`);

        // Ajouter le marqueur au mot
        addMarkerToWord(word);
    } else {
        console.log(`Le mot '${word}' est déjà enregistré pour cette page.`);
    }
}

// Fonction pour ajouter un marqueur à un mot
function addMarkerToWord(word) {
    console.log(`Ajout du marqueur pour le mot '${word}'`);

    // Utiliser une expression régulière pour ajouter le marqueur seulement si le mot est seul ou entouré d'espaces
    const bodyText = document.body.innerHTML;
    const annotatedText = `
        <span class="annotated-word" data-word="${word}">
            ${word}
            <span class="marker" title="Définition disponible">📘</span>
        </span>
    `;

    // Remplace la première occurrences du mot avec le texte annoté
    // Utiliser une expression régulière pour trouver les mots entiers uniquement
    const regex = new RegExp(`\\b${word}\\b`);
    document.body.innerHTML = bodyText.replace(regex, annotatedText);
}

// Fonction pour gérer la sélection de texte et ajouter un marqueur
document.addEventListener('mouseup', async (event) => {
    hideDefinitionPopup(); // Cacher toute popup précédente

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
        console.log(`Texte sélectionné : '${selectedText}'`);
        const definition = await fetchDefinition(selectedText);
        const posX = event.pageX;
        const posY = event.pageY;

        // Sauvegarde le mot et la définition dans le localStorage
        saveToLocalStorage(selectedText, definition, posX, posY);

        // Affiche une popup avec la définition
        showDefinitionPopup(posX, posY, definition, selectedText);
    }
});

// Afficher la popup lors du survol d'un marqueur
document.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('marker')) {
        const word = event.target.parentElement.getAttribute('data-word');
        console.log(`Survol du marqueur pour le mot '${word}'`);
        const savedDefinitions = JSON.parse(localStorage.getItem(window.location.href)) || [];
        const definitionData = savedDefinitions.find(data => data.word === word);
        if (definitionData) {
            showDefinitionPopup(event.pageX, event.pageY, definitionData.definition, word);
        }
    }
});

/* Gerer la popup + possibilité de click sur le bouton à l'intérieur
document.addEventListener('click', (event) => {
    // Vérifier si l'utilisateur a cliqué à l'extérieur de la popup
    const popup = document.querySelector('.definition-popup');
    
    if (popup && !popup.contains(event.target)) {
        hideDefinitionPopup();  // Ferme la popup si le clic n'est pas dans la popup
    }
    
    // Vérifier si c'est un clic sur le bouton de suppression
    if (event.target.classList.contains('delete-button')) {
        const word = event.target.getAttribute('data-word');
        console.log(`Bouton de suppression cliqué pour le mot '${word}'`);
        deleteFromLocalStorage(word);
        hideDefinitionPopup();  // Cache la popup après suppression
    }
});*/

// Fonction pour recharger les définitions sauvegardées et ajouter des marqueurs
function loadSavedDefinitions() {
    const savedDefinitions = JSON.parse(localStorage.getItem(window.location.href)) || [];
    
    // Supprimer tous les anciens marqueurs avant de recharger
    document.querySelectorAll('.annotated-word').forEach(span => span.remove());

    savedDefinitions.forEach(data => {
        console.log(`Rechargement du marqueur pour le mot '${data.word}'`);
        addMarkerToWord(data.word);
    });

    if (savedDefinitions.length > 0) {
        console.log("Mots sauvegardés :", savedDefinitions);
    } else {
        console.log("Aucune définition sauvegardée.");
    }
}

// Fonction pour ajouter un bouton "Supprimer tout" en haut à droite
function addDeleteAllButton() {
    const deleteAllButton = document.createElement("button");
    deleteAllButton.textContent = "Supprimer tout";
    deleteAllButton.style.position = "fixed";
    deleteAllButton.style.top = "10px";
    deleteAllButton.style.right = "10px";
    deleteAllButton.style.backgroundColor = "#ff4d4d";
    deleteAllButton.style.color = "#fff";
    deleteAllButton.style.border = "none";
    deleteAllButton.style.padding = "10px";
    deleteAllButton.style.cursor = "pointer";
    deleteAllButton.style.zIndex = "1000";
    
    document.body.appendChild(deleteAllButton);

    // Événement pour supprimer tout le localStorage
    deleteAllButton.addEventListener("click", () => {
        if (confirm("Es-tu sûr de vouloir supprimer toutes les définitions sauvegardées ?")) {
            localStorage.clear();  // Supprime tout le localStorage
            console.log("Tout le contenu du localStorage a été supprimé.");

            // Supprimer tous les marqueurs de mots
            document.querySelectorAll('.annotated-word').forEach(span => span.remove());

            alert("Toutes les définitions ont été supprimées.");
        }
    });
}



// Charger les définitions sauvegardées et ajouter le bouton de suppression tout au chargement de la page
window.onload = function() {
    loadSavedDefinitions();  // Recharge les définitions sauvegardées
    addDeleteAllButton();    // Ajoute le bouton "Supprimer tout"
};



