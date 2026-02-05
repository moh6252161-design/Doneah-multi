// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Afficher les produits
async function afficherProduits() {
  const container = document.getElementById("produitsClient");
  container.innerHTML = "";

  const snapshot = await db.collection("produits").orderBy("date","desc").get();
  snapshot.forEach(doc => {
    const p = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.nom}">
      <h3>${p.nom}</h3>
      <p><b>Prix :</b> ${p.prix} GNF</p>
      <p><b>Description :</b> ${p.description}</p>
      <p><b>Vendeur :</b> ${p.vendeur}</p>
      <p><b>Ville :</b> ${p.ville}</p>
      <p><b>Mode :</b> ${p.mode}</p>
      <button onclick="commander('${doc.id}','${p.nom}','${p.vendeur}')">Commander</button>
    `;
    container.appendChild(div);
  });
}

afficherProduits();

// Commander un produit
async function commander(idProduit, nomProduit, vendeur) {
  const client = prompt("Entrez votre nom pour commander :");
  const numero = prompt("Entrez votre numéro pour le paiement :");
  if (!client || !numero) return alert("Nom et numéro requis");

  await db.collection("commandes").add({
    idProduit,
    nomProduit,
    vendeur,
    client,
    numero,
    date: new Date()
  });

  alert("Commande passée ✅");
        }
