var nb_colones = 90;
var nb_lignes = 30; // Ces attributs sont bien adaptés à ma page, à vous de modifier pour votre page, on pourrait les adapter
var nbpx_carre = 15; // automatiquement grâce au css mais manque de temps
// dimensions de chaque "carré" et du coup du nb ligne et nb colone du jeu

var score = document.getElementById("score");
var canvas = document.getElementById("zone_snake");
var context = canvas.getContext("2d");

canvas.width=nb_colones*nbpx_carre;
canvas.height=nb_lignes*nbpx_carre;

context.fillStyle="#FF0000";

const btn = document.getElementById("btn");

// on lance le jeu quand on clique sur lancer jeu
btn.addEventListener("click", () => {
    var niveau;
    var elements = document.querySelectorAll("input");
    for (var j = 0; j < elements.length; j++) {
        if (elements[j].checked) {
            break;
        }
    }
    switch(elements[j].value) {
        case "lvl1":
            niveau = 100;
            break;
        case "lvl2":
            niveau = 60;
            break;
        case "lvl3":
            niveau = 35;
            break;
        // pas de default car pas de possibilités
    }

    // position initial et taille initial du snake (si on modifie la taille du serpent à changer dans majScore)
    var snake=[[4,3],[3,3],[2,3],[1,3],[0,3]];
    //le snake commence à partir vers la droite, à changer peut être
    var snakeVersX=1;
    var snakeVersY=0;
    
    // dessine l'ensemble du jeu
    function dessine_jeu(){
        context.clearRect(0,0,canvas.width,canvas.height);

        /*dessine le quadrillage
        //lignes
        for(var h = nbpx_carre ; h < canvas.height ; h += nbpx_carre) {
            context.moveTo(0, h); //déplacer le pinceau à (x,y) sans tracer
            context.lineTo(canvas.width, h);
            context.fillStyle="#FF0000" //tracer jusqu'à (x,y)
        }
        //colonnes
        for(var w = nbpx_carre ; w < canvas.width ; w += nbpx_carre) {
            context.moveTo(w, 0);
            context.lineTo(w, canvas.height);
            context.fillStyle="#FF0000" 
        }
        context.stroke(); 

        Je voulais créer un quadrillage mais je sais pas comment ne pas clear les lignes dans le clearRect et dessiner
        le quadrillage à chaque fois fait buger le navigateur...

        */

        for(var i=0;i<snake.length;i++){
            context.fillStyle="#FF0000"; // desine en rouge le snake
            context.fillRect(snake[i][0]*nbpx_carre,snake[i][1]*nbpx_carre,nbpx_carre,nbpx_carre);
        }
    
        context.fillStyle="#000000" // dessin en noir le bonbon
        context.fillRect(bonbon[0]*nbpx_carre,bonbon[1]*nbpx_carre,nbpx_carre,nbpx_carre);	
    }
    
    // met à jour le score
    function majScore(s){
        score.innerHTML=s;
    }
    
    function finPartie(){
        clearInterval(timerJeu);
        alert("Tu as perdu, clique sur fermer si tu veux recommencer une partie ! ");
        location.reload();
    }
    
    function boucleJeu(){
        if(step()){
            dessine_jeu();
        } else{
            finPartie();
        }
    }
    
    window.onkeydown=function(event){
        switch (event.key) {
            case "ArrowLeft":
                if(snakeVersX==0){ // on peut aller à gauche seulement si on va en haut ou en bas donc quand le snake ne bouge pas en x
                    snakeVersX=-1;
                    snakeVersY=0
                }
                break;
            case "ArrowRight":
                if(snakeVersX==0){ // on peut aller à droite seulement si on va en haut ou en bas donc quand le snake ne bouge pas en x
                    snakeVersX=1;
                    snakeVersY=0
                }
                break;
            case "ArrowUp":
                if(snakeVersY==0){ // on peut aller en haut seulement si on va a droite ou a gauche donc quand le snake ne bouge pas en y
                    snakeVersX=0;
                    snakeVersY=-1
                }
                break;
            case "ArrowDown":
                if(snakeVersY==0){ // on peut aller en bas seulement si on va a droite ou a gauche donc quand le snake ne bouge pas en y
                    snakeVersX=0;
                    snakeVersY=1;
                }
                break;
        }
    }
    
    // Place un bonbon au hasard dans la zone_snake
    function placeBonbon(){
        var flag = true;
        while (flag) {
            flag = false
            var bonbonx = 1+Math.floor((nb_colones-2)*Math.random());
            var bonbony = 1+Math.floor((nb_lignes-2)*Math.random());
            bonbon=[bonbonx, bonbony];
            for (var i=0; i<snake.length; i++) {
                if (snake[i][0] == bonbonx && snake[i][1] == bonbony) {
                    flag = true;
                } 
            }
        }
        // le flag permet de tester si le bonbon apparait dans le snake
    }	
    
    // gère la mécanique du jeu : 
    function step(){
        var tete=[snake[0][0]+snakeVersX,snake[0][1]+snakeVersY];
        
        // si le snake sort du cadre
        if(tete[0]==-1||tete[0]==nb_colones||tete[1]==-1||tete[1]==nb_lignes) {
            return false;
        } 
    
        // si le snake se rentre dedans
        for(var i=0; i<snake.length;i++) {
            if((tete[0]==snake[i][0])&&(tete[1]==snake[i][1])) {
                return false;
            }
        }
    
        // si la tete mange un bonbon -> maj du score et replace un bonbon et s'agrandit 
        if((tete[0]==bonbon[0])&&(tete[1]==bonbon[1])){
            placeBonbon();
            majScore(snake.length-4);
        }else{
            snake.pop(); // -1 au snake (passe ici quand il rentre pas dans un bonbon donc est enlever par le unshift apres)
        }
    
        snake.unshift(tete); // +1 au snake
        return true;
    }
    
    placeBonbon();
    var timerJeu=setInterval(boucleJeu,niveau); // set la difficulté du jeu en fonction du niveau choisi
})


