// 🔥 CONFIG FIREBASE
var firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// ☁️ CONFIG CLOUDINARY
var cloudName = "TON_CLOUD_NAME";
var uploadPreset = "TON_UPLOAD_PRESET";

function ajouterProduit() {
  var vendeur = document.getElementById("vendeurNom").value.trim();
  var nom = document.getElementById("nomProduit").value.trim();
  var prix = document.getElementById("prixProduit").value.trim();
  var description = document.getElementById("descriptionProduit").value.trim();
  var imageFile = document.getElementById("imageProduit").files[0];

  if (!vendeur || !nom || !prix || !description || !imageFile) {
    alert("Remplis tous les champs");
    return;
  }

  document.getElementById("message").innerText = "Upload de l'image...";

  var formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);

  fetch("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    var imageUrl = data.secure_url;
    return db.collection("produits").add({
      vendeur: vendeur,
      nom: nom,
      prix: prix,
      description: description,
      image: imageUrl,
      date: new Date()
    });
  })
  .then(() => {
    document.getElementById("message").innerText = "Produit publié avec succès ✅";
  })
  .catch(error => alert("Erreur: " + error));
}
