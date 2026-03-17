import { registerEmail } from './auth.js';
import { db } from './firebaseConfig.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// INSCRIPTION
document.getElementById("btnRegister").addEventListener("click", async () => {

const nom = document.getElementById("nom").value.trim();
const metier = document.getElementById("metier").value.trim();
const quartier = document.getElementById("quartier").value.trim();
const telephone = document.getElementById("telephone").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

// Vérification simple
if(nom === "" || metier === "" || quartier === "" || telephone === "" || email === "" || password === ""){
alert("Remplis tous les champs !");
return;
}

if(password.length < 6){
alert("Mot de passe trop court !");
return;
}

// Enregistrement automatique
await registerEmail(nom, metier, telephone, quartier, email, password);

});


// RECHERCHE
document.getElementById("btnSearch").addEventListener("click", async () => {

const metier = document.getElementById("searchMetier").value.toLowerCase();
const ville = document.getElementById("searchVille").value.toLowerCase();

const snapshot = await get(ref(db, "prestataires"));
const data = snapshot.val();

let resultsHTML = "";

for(let id in data){
let p = data[id];

if(
p.metier.toLowerCase().includes(metier) &&
p.quartier.toLowerCase().includes(ville)
){
resultsHTML += `
<div>
<b>${p.nom}</b><br>
📌 ${p.metier}<br>
📍 ${p.quartier}<br>
📞 ${p.telephone}
<hr>
</div>
`;
}
}

document.getElementById("results").innerHTML = resultsHTML || "Aucun résultat.";

});
