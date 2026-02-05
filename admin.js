var firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function afficherCommandes() {
  var container = document.getElementById("commandesContainer");
  container.innerHTML = "";

  db.collection("commandes").orderBy("date", "desc").get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      var c = doc.data();
      container.innerHTML += `
        <tr>
          <td>${c.nomClient || "-"}</td>
          <td>${c.telephone || "-"}</td>
          <td>${c.ville || "-"}</td>
          <td>${c.nomProduit || "-"}</td>
          <td>${c.prix || "-"}</td>
          <td>${c.vendeur || "-"}</td>
          <td>${new Date(c.date.seconds*1000).toLocaleString()}</td>
        </tr>
      `;
    });
  })
  .catch(error => console.log("Erreur: " + error));
}

afficherCommandes();
