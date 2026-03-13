// 🔹 Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// 🔹 Ta configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDB32ZuCfKfiQdAxIbSfDUM5xRqJehqy48",
  authDomain: "services-locaux.firebaseapp.com",
  projectId: "services-locaux",
  storageBucket: "services-locaux.firebasestorage.app",
  messagingSenderId: "377929707274",
  appId: "1:377929707274:web:c08d0e246f4ae0084c54f3",
  measurementId: "G-XTQQ1CPMLB"
};

// 🔹 Initialisation Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// 🔹 Gestion des métiers par catégorie
const metiersParCategorie = {
  "Bâtiment": ["Maçon", "Menuisier", "Plombier", "Électricien", "Peintre", "Carreleur"],
  "Services Personnels": ["Coiffeur", "Cordonnier", "Baby-sitter", "Coursier", "Nettoyeur"],
  "Transport": ["Taxi", "Chauffeur", "Livreur"],
  "Informatique": ["Développeur", "Designer", "Technicien Réseau"],
  "Santé": ["Infirmier", "Médecin", "Kinésithérapeute"]
};

// 🔹 Sélection des dropdowns
const categorieSelect = document.getElementById('categorie');
const metierSelect = document.getElementById('metier');

// 🔹 Remplissage des métiers selon catégorie
categorieSelect.addEventListener('change', () => {
  const cat = categorieSelect.value;
  metierSelect.innerHTML = '<option value="">Choisir un métier</option>';
  if(metiersParCategorie[cat]){
    metiersParCategorie[cat].forEach(m => {
      const option = document.createElement('option');
      option.value = m;
      option.textContent = m;
      metierSelect.appendChild(option);
    });
  }
});

// 🔹 Inscription prestataire
const form = document.getElementById('inscriptionForm');
form.addEventListener('submit', e => {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const metier = document.getElementById('metier').value;
  const categorie = document.getElementById('categorie').value;
  const zone = document.getElementById('zone').value;
  const telephone = document.getElementById('telephone').value;

  const newPrestataire = { nom, metier, categorie, zone, telephone, statut: "Disponible" };

  push(ref(db, 'prestataires'), newPrestataire)
    .then(() => alert('Inscription réussie !'))
    .catch(err => alert('Erreur : ' + err));

  form.reset();
});

// 🔹 Affichage prestataires + filtre
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('prestatairesResults');

function afficherPrestataires() {
  const query = searchInput.value.toLowerCase();
  onValue(ref(db, 'prestataires'), snapshot => {
    const data = snapshot.val();
    resultsDiv.innerHTML = '';
    if(!data) return resultsDiv.innerHTML = '<p>Aucun prestataire inscrit.</p>';

    for (let key in data) {
      const p = data[key];
      if(p.statut === "Disponible" && p.metier.toLowerCase().includes(query)){
        resultsDiv.innerHTML += `
          <div class="prestataire">
            <p><strong>${p.nom}</strong> - ${p.metier} - Zone: ${p.zone}</p>
            <p><a href="https://wa.me/${p.telephone}" target="_blank" onclick="enregistrerContact('${key}','Client')">Contacter via WhatsApp</a></p>
          </div>`;
      }
    }
    if(resultsDiv.innerHTML==='') resultsDiv.innerHTML='<p>Aucun prestataire trouvé.</p>';
  });
}

searchInput.addEventListener('input', afficherPrestataires);
afficherPrestataires();

// 🔹 Historique contacts
function enregistrerContact(prestataireId, clientNom){
  const date = new Date().toISOString();
  push(ref(db, `prestataires/${prestataireId}/contacts`), { client: clientNom, date });
        }
