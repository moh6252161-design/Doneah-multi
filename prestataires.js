// prestataires.js
import { db } from './firebaseConfig.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export function afficherPrestataires(metierRecherche, quartierRecherche, containerId){
    get(ref(db,'prestataires')).then(snapshot=>{
        if(snapshot.exists()){
            const data = snapshot.val();
            const container = document.getElementById(containerId);
            container.innerHTML = "";
            for(let uid in data){
                const prestataire = data[uid];
                if(prestataire.metier===metierRecherche && prestataire.quartier===quartierRecherche){
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>${prestataire.nom}</h3>
                        <p>Métier: ${prestataire.metier}</p>
                        <p>Quartier: ${prestataire.quartier}</p>
                        <p>Téléphone: ${prestataire.telephone}</p>
                        <a href="https://wa.me/${prestataire.telephone}" target="_blank">Contacter sur WhatsApp</a>
                    `;
                    container.appendChild(div);
                }
            }
        }
    });
}
