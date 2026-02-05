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

// ☁️ CONFIG CLOUDINARY
const cloudName = "TON_CLOUD_NAME";
const uploadPreset = "TON_UPLOAD_PRESET";

async function ajouterProduit() {
  const vendeur = document.getElementById("vendeurNom").value;
  const nom = document.getElementById("nomProduit").value;
  const prix = document.getElementById("prixProduit").value;
  const description = document.getElementById("descriptionProduit").value;
  const ville = document.getElementById("villeProduit").value;
  const paiement = document.getElementById("modePaiement").value;
  const imageFile = document.getElementById("imageProduit").files[0];

  if (!vendeur || !nom || !prix || !description || !ville || !paiement || !imageFile) {
    alert("Remplis tous les champs !");
    return;
  }

  document.getElementById("message").innerText = "Upload de l'image...";

  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    const imageUrl = data.secure_url;

    await db.collection("produits").add({
      vendeur: vendeur,
      nom: nom,
      prix: prix,
      description: description,
      ville: ville,
      paiement: paiement,
      image: imageUrl,
      date: new Date()
    });

    document.getElementById("message").innerText = "Produit publié avec succès ✅";

    // Reset
    document.getElementById("vendeurNom").value = "";
    document.getElementById("nomProduit").value = "";
    document.getElementById("prixProduit").value = "";
    document.getElementById("descriptionProduit").value = "";
    document.getElementById("villeProduit").value = "";
    document.getElementById("modePaiement").value = "";
    document.getElementById("imageProduit").value = "";

  } catch (error) {
    alert("Erreur : " + error);
  }
}
