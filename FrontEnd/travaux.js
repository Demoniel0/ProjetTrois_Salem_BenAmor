const monToken = window.localStorage.getItem("token");
console.log(monToken);

let bloc1 = `
        <div id="modal1" class="modal-wrapper">
            <button class="js-modal-close"><i class="fa-solid fa-xmark"></i></button>
            <h2>Gallerie photo</h2>
            <div class="galleryModal">
            
            </div>
            <button id="Ajouter">Ajouter une photo</button>
        </div>
        `

let bloc2 = `
    <div id="modal2" class="modal-wrapper">
		<button class="js-modal-return"><i class="fa-solid fa-arrow-left"></i></button>
		<button class="js-modal-close"><i class="fa-solid fa-xmark"></i></button>
		<h2>Ajout photo</h2>
		<div class="accueil-photo">
			<div class="cadre-photo">
				<i class="fa-regular fa-image"></i>
    			<button id="ajouter-photo">+ Ajouter photo</button>
				<p>jpg, png: 4mo max</p>
			</div>
			<form class="formulaire-connexion">
				<label for="title">Title</label>
				<input type="text" name="title" id="title"><br>

				<label for="pays">Catégorie</label><br>
				<select name="categorie" id="categorie">
	    			<option value="objets">Objets</option>
					<option value="appartements">Appartements</option>
					<option value="hotels&restaurants">Hôtels & Restaurants</option>
				</select>
        	</form>
		</div>
		<button id="valider">Valider</button>
	</div>
   `

// Fonction pour supprimer des travaux
async function suppressionTravaux(bouton) {
    const idElement = bouton.id;
    const response = await fetch(`http://localhost:5678/api/works/${idElement}`, {
        method: "DELETE",
        headers: { "Content-Type": "*/*", Authorization: `Bearer ${monToken}`}
    })
    console.log(response);
    //Checker si le retour est un succcès. Si oui récupérer la balise HTML et la supprimer
}

const stopPropagation = function (event) {
    event.stopPropagation();
}




async function appel(){
    const reponse = await fetch('http://localhost:5678/api/works');
    console.log(reponse);
    const travaux = await reponse.json();

        //------------ DEBUT ESPACE FONCTIONS ----------//

    // Génération des projets
    function genererTravaux(travaux) {
        for(i = 0; i < travaux.length; i++ ) {
            const article = travaux[i];

            const sectionFiches = document.querySelector(".gallery");

            const travauxElement = document.createElement("figure");

            const imageElement = document.createElement("img");
            imageElement.src = article.imageUrl;

            const nomElement = document.createElement("figcaption");
            nomElement.innerText = article.title;

            sectionFiches.appendChild(travauxElement);
            travauxElement.appendChild(imageElement);
            travauxElement.appendChild(nomElement);
        } 
    }

    // Génération des photos des projets pour la modale
    function genererTravauxModal (travaux) {
        for(i = 0; i < travaux.length; i++ ) {
            const article = travaux[i];

            const sectionModal = document.querySelector(".galleryModal");

            const divImage = document.createElement("div");
            divImage.classList.add("blocImage");
            const imageModal = document.createElement("img");
            imageModal.src = article.imageUrl;

            let poubelle =`
                        <button id="${article.id}" class="supprimerProjet"><i id="${article.id}" class="fa-solid fa-trash-can"></i></button>
                        `
            divImage.innerHTML = poubelle;
            divImage.appendChild(imageModal)
            sectionModal.appendChild(divImage);
        } 
    }

    function GERER_MODAL_1() {
        const Modal = document.querySelector("#modal");
        Modal.innerHTML ="";
        Modal.innerHTML = bloc1;

        const ouvrirModal = document.querySelector(".js-modal");
        const Modal1 = document.querySelector("#modal1");
        const fermerModal = document.querySelector(".js-modal-close");
    
        ouvrirModal.addEventListener("click", (event) => {
            Modal.style.display = null;
        });
    
        Modal.addEventListener("click", (event) => {
            Modal.style.display = "none";
        });
    
        fermerModal.addEventListener("click", (event) => {
            Modal.style.display = "none";
        });
    
        Modal1.addEventListener("click", stopPropagation);
    
        genererTravauxModal(travaux);

        const bouton_Poubelle = document.querySelectorAll(".supprimerProjet");

        bouton_Poubelle.forEach((bouton) => {
            bouton.addEventListener("click", (event) => {
                event.preventDefault();
                suppressionTravaux(bouton);

            });
        })

        const ajouterPhoto = document.querySelector("#Ajouter");
        
        ajouterPhoto.addEventListener("click", (event) => {
            GERER_MODAL_2(Modal);
        })
    }

    function GERER_MODAL_2(Modal){
        Modal.innerHTML ="";
        Modal.innerHTML = bloc2;

        const fermerModal = document.querySelector(".js-modal-close");
        const retour = document.querySelector(".js-modal-return");
        const Modal2 = document.querySelector("#modal2");
    
        fermerModal.addEventListener("click", (event) => {
            Modal.style.display = "none";
        });

        retour.addEventListener("click", (event) => {
            GERER_MODAL_1();
        });
            
        Modal2.addEventListener("click", stopPropagation);
    }

        //------------ FIN ESPACE FONCTIONS ----------//


    genererTravaux(travaux);

    //Création du mode édition
    if(monToken){
        const integrationBody = document.querySelector("body");
        const avant = document.querySelector(".main-container");

        const modEdition = document.createElement("div");
        modEdition.classList.add("Edition");
        integrationBody.appendChild(modEdition);
        avant.before(modEdition);

        let bandeau =`
                    <i class="fa-regular fa-pen-to-square"></i>
                    <p>Mode Edition</p>
                     `
        modEdition.innerHTML = bandeau;

        const projetModifier = document.querySelector(".modifier");
        const modificateur = document.createElement("div");
        projetModifier.appendChild(modificateur);
        let Texte =`
                    <i class="fa-regular fa-pen-to-square"></i>
                    <a class="js-modal">modifier</a>
                    `
        modificateur.innerHTML = Texte;

        //------------ DEBUT GERER MODAL ----------//

        GERER_MODAL_1();
      
        //------------ FIN GERER MODAL ----------//
    }

        
    // Début de la gestion des boutons
    const boutonTous = document.querySelector(".btn-tous");

    boutonTous.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML="";
        genererTravaux(travaux);
    });

    const boutonObjets = document.querySelector(".btn-objets");

    boutonObjets.addEventListener("click", () => {
        const objetsFiltree = travaux.filter((projet) => {
            return projet.category.name === "Objets";
        });
        console.log(objetsFiltree);
        document.querySelector(".gallery").innerHTML="";
        genererTravaux(objetsFiltree);
    });

    const boutonAppartements = document.querySelector(".btn-appartements");

    boutonAppartements.addEventListener("click", () => {
        const appartementsFiltree = travaux.filter((projet) => {
            return projet.category.name === "Appartements";
        });
        console.log(appartementsFiltree);
        document.querySelector(".gallery").innerHTML="";
        genererTravaux(appartementsFiltree);
    });

    const boutonHotel = document.querySelector(".btn-hotel");

    boutonHotel.addEventListener("click", () => {
        const hotelFiltree = travaux.filter((projet) => {
            return projet.category.name === "Hotels & restaurants";
        });
        console.log(hotelFiltree);
        document.querySelector(".gallery").innerHTML="";
        genererTravaux(hotelFiltree);
    });
    //Fin de la gestion des boutons

}

appel();


/*const ajouterPhoto = document.querySelector("#Ajouter");
        
        ajouterPhoto.addEventListener("click", (event) => {
            Modal.innerHTML ="";
            Modal.innerHTML = bloc2;

            const retour = document.querySelector(".js-modal-return");
            const Modal2 = document.querySelector("#modal2");
    
            retour.addEventListener("click", (event) => {
                Modal.innerHTML ="";
                Modal.innerHTML = bloc1;
            });
            
            Modal2.addEventListener("click", stopPropagation);
        });*/