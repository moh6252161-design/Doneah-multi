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
const cloudName = "dmwrnpkhw";           // ton Cloud Name
const uploadPreset = "ton_upload_preset"; // ton preset unsigned

async function ajouterProduit() {
  const vendeur = document.getElementById("vendeurNom").value;
  const nom = document.getElementById("nomProduit").value;
  const prix = document.getElementById("prixProduit").value;
  const description = document.getElementById("descriptionProduit").value;
  const ville = document.getElementById("villeProduit").value;
  const mode = document.getElementById("modeTransaction").value;
  const imageFile = document.getElementById("imageProduit").files[0];

  if (!vendeur || !nom || !prix || !description || !ville || !mode || !imageFile) {
    alert("Remplis tous les champs");
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
      vendeur,
      nom,
      prix: Number(prix),
      description,
      ville,
      mode,
      image: imageUrl,
      date: new Date()
    });

    document.getElementById("message").innerText = "Produit publié avec succès ✅";

    // Reset
    document.getElementById("nomProduit").value = "";
    document.getElementById("prixProduit").value = "";
    document.getElementById("descriptionProduit").value = "";
    document.getElementById("villeProduit").value = "";
    document.getElementById("modeTransaction").value = "";
    document.getElementById("imageProduit").value = "";

  } catch (err) {
    console.error(err);
    alert("Erreur : " + err);
  }
}
