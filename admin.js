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

async function afficherProduits() {
  const tbody = document.getElementById("produitsListe");
  tbody.innerHTML = "";

  const snapshot = await db.collection("produits").orderBy("date","desc").get();
  snapshot.forEach(doc => {
    const p = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.vendeur}</td>
      <td>${p.nom}</td>
      <td>${p.prix}</td>
      <td>${p.description}</td>
      <td>${p.ville}</td>
      <td>${p.mode}</td>
      <td><a href="${p.image}" target="_blank"><img src="${p.image}"></a></td>
    `;
    tbody.appendChild(tr);
  });
}

afficherProduits();
