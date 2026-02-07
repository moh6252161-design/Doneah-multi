// ===== IMPORT FIREBASE =====
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit, startAfter } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyuJO9uwn3nTuYS-AsznAKsLtBKSnWjjo",
  authDomain: "doneah-multi.firebaseapp.com",
  projectId: "doneah-multi",
  storageBucket: "doneah-multi.appspot.com",
  messagingSenderId: "462776568623",
  appId: "1:462776568623:web:60272d31e00bbe156a2fda",
  measurementId: "G-BFEV0V6XQR"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== VARIABLES =====
let produits = [], panier = [], adminLogged = false, lastVisible = null;
const pageSize = 10;

// ===== DOM =====
const listeProduits = document.getElementById("listeProduits");
const listePanier = document.getElementById("listePanier");
const compteurPanier = document.getElementById("compteurPanier");
const totalEl = document.getElementById("total");
const grandTotalEl = document.getElementById("grandTotal");
const fraisEl = document.getElementById("frais");
const okEl = document.getElementById("ok");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const themeBtn = document.getElementById("themeBtn");

// ===== DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {

  // ===== MENU =====
  menuBtn.addEventListener("click", () => menu.classList.add("show"));
  closeMenu.addEventListener("click", () => menu.classList.remove("show"));
  document.querySelectorAll("#menu button[data-go]").forEach(btn => {
    btn.addEventListener("click", () => {
      const cible = document.getElementById(btn.dataset.go);
      if (cible) {
        document.querySelectorAll("section").forEach(s => s.style.display = "none");
        cible.style.display = "block";
        menu.classList.remove("show");
      }
    });
  });

  // ===== THEME =====
  themeBtn.addEventListener("click", () => document.body.classList.toggle("theme-dark"));

  // ===== PANIER =====
  function updatePanierDOM() {
    listePanier.innerHTML = "";
    let total = 0;
    panier.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `<h4>${p.nom}</h4><p>${p.prix} FG</p><button>❌</button>`;
      div.querySelector("button").addEventListener("click", () => {
        panier.splice(i, 1);
        updatePanierDOM();
      });
      listePanier.appendChild(div);
      total += Number(p.prix);
    });
    totalEl.innerText = total;
    const frais = Math.ceil(total * 0.05);
    fraisEl.innerText = frais;
    grandTotalEl.innerText = total + frais;
    compteurPanier.innerText = panier.length;
  }

  // ===== PRODUITS =====
  async function chargerProduits() {
    let q = query(collection(db, "produits"), limit(pageSize));
    if (lastVisible) q = query(collection(db, "produits"), startAfter(lastVisible), limit(pageSize));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length === 0) return;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    snapshot.forEach(doc => produits.push({ id: doc.id, ...doc.data(), prix: Number(doc.data().prix) }));
    afficherProduits();
  }

  function afficherProduits() {
    listeProduits.innerHTML = "";
    const recherche = document.getElementById("recherche").value.toLowerCase();
    produits.filter(p => p.nom.toLowerCase().includes(recherche)).forEach(p => {
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `<img src="${p.image}" alt="${p.nom}"><h4>${p.nom}</h4><p>${p.prix} FG</p><button>Ajouter</button>`;
      div.querySelector("button").addEventListener("click", () => {
        panier.push(p);
        updatePanierDOM();
      });
      listeProduits.appendChild(div);
    });
  }
  document.getElementById("recherche").addEventListener("input", afficherProduits);

  // ===== AJOUT PRODUIT VENDEUR =====
  document.getElementById("ajouterProduit").addEventListener("click", async () => {
    const nom = document.getElementById("pNom").value;
    const prix = parseInt(document.getElementById("pPrix").value);
    const file = document.getElementById("pImage").files[0];
    if (!nom || !prix || !file) return alert("Tous les champs sont obligatoires");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "doneah-multi");
    const res = await fetch(`https://api.cloudinary.com/v1_1/dmwrnpkhw/image/upload`, { method: "POST", body: formData });
    const data = await res.json();
    await addDoc(collection(db, "produits"), { nom, prix, image: data.secure_url });
    produits = []; lastVisible = null; await chargerProduits();
  });

  // ===== ADMIN =====
  document.getElementById("loginAdmin").addEventListener("click", async () => {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;
    if (user === "papasta" && pass === "papasta3494") adminLogged = true;
    if (!adminLogged) return alert("Infos incorrectes");
    const snapshot = await getDocs(collection(db, "commandes"));
    const adminDiv = document.getElementById("adminCommandes");
    adminDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const c = doc.data();
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `<h4>${c.nomClient} -> ${c.nomProduit}</h4><p>Vendeur: ${c.vendeur}</p><p>Adresse: ${c.ville} | ${c.recepteurNom}</p><p>Total: ${c.total} FG</p>`;
      adminDiv.appendChild(div);
    });
  });

  // ===== VALIDATION COMMANDE =====
  document.getElementById("valider").addEventListener("click", async () => {
    const nomClient = document.getElementById("clientNom").value;
    const nomProduit = panier.map(p => p.nom).join(", ");
    const vendeur = "Vendeur";
    const ville = document.getElementById("ville").value;
    const recepteurNom = document.getElementById("recepteurNom").value;
    const total = parseInt(grandTotalEl.innerText);
    if (!nomClient || !nomProduit || !ville || !recepteurNom) return alert("Tous les champs sont obligatoires");
    await addDoc(collection(db, "commandes"), { nomClient, nomProduit, vendeur, ville, recepteurNom, total });
    panier = []; updatePanierDOM();
    okEl.innerText = "✅ Commande validée !";
  });

  // ===== CHAT IA (OpenAI fetch côté client) =====
  const chatHeader = document.getElementById("chatHeader");
  const chatBody = document.getElementById("chatBody");
  const chatInputContainer = document.getElementById("chatInputContainer");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  chatHeader.addEventListener("click", () => {
    const visible = chatBody.style.display !== "block";
    chatBody.style.display = visible ? "block" : "none";
    chatInputContainer.style.display = visible ? "flex" : "none";
  });

  chatSend.addEventListener("click", async () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    const divUser = document.createElement("div");
    divUser.innerHTML = `<b>Vous:</b> ${msg}`;
    chatBody.appendChild(divUser);

    try {
      // ===== Utilise fetch vers OpenAI API publique avec ta clé ====
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer VOTRE_CLE_OPENAI` // ⚠️ à remplacer
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: msg }],
          max_tokens: 200
        })
      });
      const data = await response.json();
      const divIA = document.createElement("div");
      divIA.innerHTML = `<b>Assistant IA:</b> ${data.choices[0].message.content}`;
      chatBody.appendChild(divIA);
    } catch (err) {
      const divIA = document.createElement("div");
      divIA.innerHTML = `<b>Assistant IA:</b> Je n'ai pas pu répondre.`;
      chatBody.appendChild(divIA);
    }

    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  });

  // ===== CONTACT (enregistre Firebase) =====
  document.getElementById("envoyerMessage").addEventListener("click", async () => {
    const nom = document.getElementById("contactNom").value;
    const email = document.getElementById("contactEmail").value;
    const msg = document.getElementById("contactMessage").value;
    if (!nom || !email || !msg) return alert("Tous les champs sont obligatoires");
    await addDoc(collection(db, "messages"), { nom, email, msg, date: new Date().toISOString() });
    document.getElementById("contactOk").innerText = "✅ Message envoyé !";
    document.getElementById("contactNom").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
  });

  // ===== CHARGEMENT INITIAL =====
  chargerProduits();
});
