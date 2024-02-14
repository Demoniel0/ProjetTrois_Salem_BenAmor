async function passwordOK(chargeUtile) {
    const reponsed = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    })
    console.log(reponsed)
    if(reponsed.ok){
        const clef = await reponsed.json()
        console.log(clef)
        window.localStorage.setItem("token", clef.token);
        window.location = "index.html";
    }else{
        console.log("L'email ou le mot de passe est incorrect")
    }
}

function connexion() {

    window.localStorage.removeItem("token");
    const formulaireConnexion = document.querySelector(".formulaire-connexion");
    formulaireConnexion.addEventListener("submit", (event) => {
        event.preventDefault();

        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=motDePasse").value,
        };


        const chargeUtile = JSON.stringify(identifiant);
        console.log(chargeUtile);

        passwordOK(chargeUtile);
        
    });
}

connexion();

