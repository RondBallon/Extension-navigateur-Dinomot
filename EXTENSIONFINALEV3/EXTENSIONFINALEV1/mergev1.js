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
function showDefinitionPopup(posX, posY, definition) {
    const popup = document.createElement("div");
    popup.classList.add("definition-popup");
    popup.style.position = "absolute";
    popup.style.left = `${posX}px`;
    popup.style.top = `${posY}px`;
    popup.style.backgroundColor = "#fff";
    popup.style.border = "1px solid #000";
    popup.style.padding = "10px";
    popup.style.zIndex = "1000";
    popup.innerHTML = `<p>${definition}</p><img src="${spriteList[0]}" alt="Sprite">`;
    document.body.appendChild(popup);
}

// Fonction pour cacher la popup
function hideDefinitionPopup() {
    const popups = document.querySelectorAll(".definition-popup");
    popups.forEach(popup => popup.remove());
}

// Fonction pour sauvegarder les définitions dans le localStorage
function saveToLocalStorage(word, definition, posX, posY) {
    let savedDefinitions = JSON.parse(localStorage.getItem("definitions")) || [];
    savedDefinitions.push({ word, definition, posX, posY });
    localStorage.setItem("definitions", JSON.stringify(savedDefinitions));
}

// Fonction pour ajouter un marqueur à un mot
function addMarkerToWord(word) {
    const bodyText = document.body.innerHTML;
    const annotatedText = `
        <span class="annotated-word" data-word="${word}">
            ${word}
            <span class="marker" title="Définition disponible">ⓘ</span>
        </span>
    `;
    
    document.body.innerHTML = bodyText.split(word).join(annotatedText);
}

// Fonction pour gérer la sélection de texte et ajouter un marqueur
document.addEventListener('mouseup', async (event) => {
    hideDefinitionPopup();

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
        const definition = await fetchDefinition(selectedText);
        const posX = event.pageX;
        const posY = event.pageY;

        // Sauvegarde le mot et la définition dans le localStorage
        saveToLocalStorage(selectedText, definition, posX, posY);

        // Affiche une popup avec la définition
        showDefinitionPopup(posX, posY, definition);
    }
});

// Afficher la popup lors du survol d'un marqueur
document.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('marker')) {
        const word = event.target.parentElement.getAttribute('data-word');
        const savedDefinitions = JSON.parse(localStorage.getItem("definitions")) || [];
        const definitionData = savedDefinitions.find(data => data.word === word);
        if (definitionData) {
            showDefinitionPopup(event.pageX, event.pageY, definitionData.definition);
        }
    }
});

// Cacher la popup sur sortie de survol
document.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('marker')) {
        hideDefinitionPopup();
    }
});

// Fonction pour recharger les définitions sauvegardées et ajouter des marqueurs
function loadSavedDefinitions() {
    const savedDefinitions = JSON.parse(localStorage.getItem("definitions")) || [];
    
    savedDefinitions.forEach(data => {
        addMarkerToWord(data.word);
    });

    if (savedDefinitions.length > 0) {
        console.log("Mots sauvegardés :", savedDefinitions);
    } else {
        console.log("Aucune définition sauvegardée.");
    }
}

// Charger les définitions sauvegardées au chargement de la page
window.onload = loadSavedDefinitions;

// CSS pour les marqueurs et les popups
const style = document.createElement('style');
style.textContent = `
    .annotated-word {
        position: relative;
        display: inline;
        background-color: rgba(255, 255, 0, 0.3); /* Surlignement discret */
        padding: 0 3px;
    }
    .marker {
        font-size: 0.8em;
        color: blue;
        cursor: help;
        border-bottom: 1px dotted;
        margin-left: 5px;
    }
    .definition-popup {
        position: absolute;
        background-color: #fff;
        border: 1px solid #000;
        padding: 10px;
        z-index: 1000;
    }
`;
document.head.appendChild(style);
