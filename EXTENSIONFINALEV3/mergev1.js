const Neutral = [
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino1.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino1.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino6.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/updino1.png')
];

const Happy = [
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino1.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino5.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino6.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino7.png')
];

const Sleep = [
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/sleepingdino1.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/sleepingdino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/sleepingdino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/sleepingdino4.png')
];

const Angry = [
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino3.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino4.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/Happydino2.png'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino1.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino2.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino3.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino4.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino1.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino2.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino3.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino4.PNG'),
    chrome.runtime.getURL('animationPerso/dino/Dinoimg/AngryDino1.PNG'),
]

// Création de la popup pour la définition
const definitionPopup = document.createElement("div");
definitionPopup.id = "definition-popup";
definitionPopup.style.position = "absolute";
definitionPopup.style.display = "none"; // Cacher la popup par défaut
definitionPopup.style.backgroundColor = "#fff"; // Fond blanc pour la popup
definitionPopup.style.border = "4px dashed #d55716"; // Bordure pour mieux visualiser la popup
definitionPopup.style.padding = "10px"; // Padding pour éviter que le texte colle aux bords
document.body.appendChild(definitionPopup);

let spriteInterval;
let spriteImg;
let inactivityTimer;
let isAnimating = false;
let isSleeping = false;

// Fonction pour récupérer les définitions depuis l'API
async function fetchDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}\``);
        const data = await response.json();

        if (data && data.length > 0 && data[0].meanings.length > 0 && data[0].meanings[0].definitions.length > 0) {
            return { definition: data[0].meanings[0].definitions[0].definition, found: true };
        } else {
            return { definition: "Définition non trouvée !", found: false };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la définition :", error);
        return { definition: "Erreur lors de la récupération de la définition.", found: false };
    }
}

// Fonction de validation des mots
function isValidWord(word) {
    const regex = /^[a-zA-Z]+$/;
    return word.length > 0 && word.length < 50 && regex.test(word);
}

// Fonction pour récupérer la sélection de texte nettoyée
function textSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const cleanedText = selectedText.replace(/<\/?[^>]+(>|$)/g, ""); // Supprimer les balises HTML
    return cleanedText.replace(/\s+/g, ' ').trim();
}

// Fonction pour afficher la popup de définition
function showDefinitionPopup(event, definition, state) {
    const posX = event.pageX + 10;
    const posY = event.pageY + 10;
    definitionPopup.innerHTML = <p>${definition}</p>;
    addNote();

    if (spriteImg && definitionPopup.contains(spriteImg)) {
        definitionPopup.removeChild(spriteImg);
    }

    spriteImg = document.createElement("img");
    definitionPopup.appendChild(spriteImg);

    definitionPopup.style.left = $;{posX}px;
    definitionPopup.style.top = $;{posY}px;
    definitionPopup.style.display = "block";

    state ? startAnimation(Happy) : startAnimation(Angry);
}

// Fonction pour cacher la popup
function hideDefinitionPopup() {
    definitionPopup.style.display = "none";
    clearInterval(spriteInterval);
}

// Fonction pour centraliser l'affichage de la définition
async function handleWordDefinition(event) {
    const selectedText = textSelection();
    
    if (selectedText && isValidWord(selectedText)) {
        const word = selectedText.split(" ")[0];
        const result = await fetchDefinition(word);
        showDefinitionPopup(event, result.definition, result.found);
    } else {
        hideDefinitionPopup();
    }
}

// Centralisation de tous les événements "mouseup"
document.addEventListener("mouseup", async (event) => {
    const selectedText = textSelection();

    if (selectedText && event.target.nodeType === Node.ELEMENT_NODE) {
        await handleWordDefinition(event);
    } else {
        hideDefinitionPopup();
    }

    resetInactivityTimer(); // Réinitialisation de l'inactivité
});

// Gestion des événements "mousedown"
document.addEventListener("mousedown", () => {
    hideDefinitionPopup();
    resetInactivityTimer();
});

// Fonction pour ajouter une note à la popup
function addNote() {
    const createNote = document.createElement("textarea");
    createNote.setAttribute("contentEditable", "true");
    createNote.setAttribute("name", "note");
    definitionPopup.appendChild(createNote);
    createNote.focus();

    setTimeout(() => {
        createNote.focus();
    }, 0);

    // Sauvegarde la note dans le localStorage lors de la modification
    createNote.addEventListener('blur', () => {
        const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
        notes.push(createNote.value);
        localStorage.setItem('notes', JSON.stringify(notes));
    });
}

// Animation des sprites
function startAnimation(spriteArray) {
    if (isAnimating) {
        clearInterval(spriteInterval);
        isAnimating = false;
    }

    let countdown = 0;
    let index = 0;
    const maxRepeats = 1;

    isAnimating = true;
    spriteInterval = setInterval(() => {
        spriteImg.src = spriteArray[index];
        index = (index + 1) % spriteArray.length;

        if (index === 0) {
            countdown++;
        }

        if (countdown >= maxRepeats) {
            clearInterval(spriteInterval);
            isAnimating = false;
        }
    }, 150);
}

// Timer d'inactivité pour lancer l'animation "Sleep"
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (!isAnimating) {
            isSleeping = true;
            startAnimation(Sleep);
        }
    }, 20000);
}

// Gestion des notes depuis le localStorage
function loadNotes() {
    const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.textContent = note;
        document.body.appendChild(noteElement);
    });
}

// Appel initial pour charger les notes sauvegardées
window.onload = function() {
    loadNotes();
    resetInactivityTimer(); // Démarre le timer d'inactivité au chargement de la page
}; 

function loadSavedDefinitions() {
    const savedDefinitions = JSON.parse(localStorage.getItem(window.location.href)) || [];
    
    // Supprimer tous les anciens marqueurs avant de recharger
    document.querySelectorAll('.annotated-word').forEach(span => span.remove());

    savedDefinitions.forEach(data => {
        console.log('${data.word}');
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
