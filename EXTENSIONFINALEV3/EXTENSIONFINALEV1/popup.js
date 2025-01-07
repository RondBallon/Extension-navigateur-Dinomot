// Crée et ajoute l'élément "popup" pour afficher la définition // 
const definitionPopup = document.createElement("div");
definitionPopup.id = "definition-popup";
definitionPopup.style.position = "absolute"; // Assure que la popup est correctement positionnée  //
definitionPopup.style.display = "none"; // Si pas de sélection elle est cachée lalala // 
document.body.appendChild(definitionPopup);

function showDefinitionPopup(event, definition) {
    const popup = document.getElementById("definition-popup");
    popup.style.display = "block"; // Afficher la popup //  
    popup.style.left = `${event.pageX + 10}px`; // Position de la popup +10px a gauche du mot pour pas que ça se chevauche //
    popup.style.top = `${event.pageY + 10}px`; // Position de la popup +10px au dessus du mot pour pas que ça se chevauche//
    popup.textContent = definition; // Ajouter la définition au contenu de la popup //
}

function hideDefinitionPopup() {
    const popup = document.getElementById("definition-popup");
    popup.style.display = "none"; // Cacher la popup lalala// 
}

 // Récupérer la définition du mot
 const definition = await fetchDefinition(word);
 if (definition) {
     // Affiche la popup avec la définition car appelle la fonction //
     showDefinitionPopup(event, definition);
 }
