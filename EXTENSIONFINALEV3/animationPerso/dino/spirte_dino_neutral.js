document.addEventListener("DOMContentLoaded", function() {
    let spritelist = [
        'Dinoimg/updino1.png',
        'Dinoimg/updino2.png',
        'Dinoimg/updino3.png',
        'Dinoimg/updino2.png',
        'Dinoimg/updino1.png',
        'Dinoimg/updino4.png',
        'Dinoimg/updino6.png',
        'Dinoimg/updino4.png',
        'Dinoimg/updino1.png'
    ];

    let spriteimg = document.querySelector(".sprite img");

    let countdown = 0
    let index = 0
    let maxRepeats = 4

    function animateSprite() {
        //coeur de la fonction animateSprite 
        spriteimg.src = spritelist[index]; //injection de l'image slectionner dans le tableau spritelist
        index = (index+ 1) % spritelist.length; //fait avancer mon index est le retour à 0 quand il atteint spritelist.length
        
        if (index === 0) { //On augmente le compteur si on a terminé une boucle complète de sprite 
            countdown ++
        }

        if (countdown < maxRepeats){
            setTimeout (animateSprite,120) //changer de sprite toutes les 0.2s (recall animeteSprite de façon récursive)
        }
    }

    animateSprite() //Démarre l'animation 
            
      
});
