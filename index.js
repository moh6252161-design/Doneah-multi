// 🔥 CONFIG FIREBASE
var firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function afficherProduits() {
  var container = document.getElementById("produitsContainer");
  container.innerHTML = "";

  db.collection("produits").orderBy("date", "desc").get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      var produit = doc.data();
      container.innerHTML += `
        <div class="product">
          <img src="${produit.image}" alt="${produit.nom}">
          <h3>${produit.nom} (${produit.prix} GNF)</h3>
          <p>${produit.description}</p>
          <p>Vendeur : ${produit.vendeur}</p>
        </div>
      `;
    });
  })
  .catch(error => console.log("Erreur : " + error));
}

afficherProduits();
