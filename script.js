// 🔹 CONFIGURATION FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDB32ZuCfKfiQdAxIbSfDUM5xRqJehqy48",
  authDomain: "services-locaux.firebaseapp.com",
  projectId: "services-locaux",
  storageBucket: "services-locaux.firebasestorage.app",
  messagingSenderId: "377929707274",
  appId: "1:377929707274:web:c08d0e246f4ae0084c54f3",
  measurementId: "G-XTQQ1CPMLB"
};

// 🔹 INITIALISATION
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.database();

// 🔹 MÉTIERS PAR CATÉGORIE
const metiersParCategorie = {
  "Bâtiment": ["Maçon", "Menuisier", "Plombier", "Électricien", "Peintre", "Carreleur"],
  "Services Personnels": ["Coiffeur", "Cordonnier", "Baby-sitter", "Coursier", "Nettoyeur"],
  "Transport": ["Taxi", "Chauffeur", "Livreur"],
  "Informatique": ["Développeur", "Designer", "Technicien Réseau"],
  "Santé": ["Infirmier", "Médecin", "Kinésithérapeute"]
};

// 🔹 DROPDOWN MÉTIERS DYNAMIQUE
const categorieSelect = document.getElementById('categorie');
const metierSelect = document.getElementById('metier');

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

// 🔹 MESSAGE DE CONFIRMATION
const messageInscription = document.getElementById('messageInscription');

// 🔹 INSCRIPTION PRESTATAIRE
const form = document.getElementById('inscriptionForm');
form.addEventListener('submit', e => {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const metier = document.getElementById('metier').value;
  const categorie = document.getElementById('categorie').value;
  const zone = document.getElementById('zone').value;
  const telephone = document.getElementById('telephone').value;

  const newPrestataire = { nom, metier, categorie, zone, telephone, statut: "Disponible" };

  firebase.database().ref('prestataires').push(newPrestataire)
    .then(() => {
      // Message pour le prestataire
      messageInscription.textContent = `✅ Inscription réussie ! Bienvenue, ${nom} !`;
      messageInscription.style.color = "green";

      // Effacer le message après 5 secondes
      setTimeout(() => {
        messageInscription.textContent = "";
      }, 5000);
    })
    .catch(err => {
      messageInscription.textContent = `❌ Erreur lors de l'inscription : ${err}`;
      messageInscription.style.color = "red";
    });

  form.reset();
});

// 🔹 AFFICHAGE DES PRESTATAIRES
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('prestatairesResults');

function afficherPrestataires() {
  const query = searchInput.value.toLowerCase();
  firebase.database().ref('prestataires').on('value', snapshot => {
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

// 🔹 HISTORIQUE CONTACTS
function enregistrerContact(prestataireId, clientNom){
  const date = new Date().toISOString();
  firebase.database().ref(`prestataires/${prestataireId}/contacts`).push({ client: clientNom, date });
}
