// ==================== INITIALISATION FIREBASE ====================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

// ==================== VARIABLES ====================
let produits = [];
let panier = [];
let vendeurs = [];
let adminLogged = false;

// ==================== DOM ELEMENTS ====================
const listeProduits = document.getElementById("listeProduits");
const listePanier = document.getElementById("listePanier");
const compteurPanier = document.getElementById("compteurPanier");
const totalEl = document.getElementById("total");
const grandTotalEl = document.getElementById("grandTotal");
const fraisEl = document.getElementById("frais");
const okEl = document.getElementById("ok");

document.addEventListener("DOMContentLoaded", () => {

  // ==================== MENU ====================
  const menuBtn = document.getElementById("menuBtn");
  const closeMenu = document.getElementById("closeMenu");
  const menu = document.getElementById("menu");

  if(menuBtn && closeMenu && menu){
    menuBtn.addEventListener("click", ()=> menu.style.display="block");
    closeMenu.addEventListener("click", ()=> menu.style.display="none");

    document.querySelectorAll("#menu button[data-go]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("section").forEach(s => s.style.display = "none");
        const cible = document.getElementById(btn.dataset.go);
        if(cible) cible.style.display = "block";
        menu.style.display = "none";
      });
    });
  }

  // ==================== MINI PANIER ====================
  function updatePanierDOM() {
    listePanier.innerHTML = "";
    let total = 0;
    panier.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `
        <h4>${p.nom}</h4>
        <p>${p.prix} FG</p>
        <button onclick="supprimerDuPanier(${i})">❌</button>
      `;
      listePanier.appendChild(div);
      total += p.prix;
    });
    totalEl.innerText = total;
    fraisEl.innerText = Math.ceil(total * 0.05);
    grandTotalEl.innerText = total + Math.ceil(total * 0.05);
    compteurPanier.innerText = panier.length;
  }

  window.supprimerDuPanier = function(index) {
    panier.splice(index,1);
    updatePanierDOM();
  }

  // ==================== PRODUITS ====================
  async function chargerProduits() {
    const snapshot = await getDocs(collection(db,"produits"));
    produits = [];
    snapshot.forEach(doc => produits.push({id:doc.id,...doc.data()}));
    afficherProduits();
  }

  function afficherProduits() {
    listeProduits.innerHTML = "";
    const recherche = document.getElementById("recherche").value.toLowerCase();
    produits.filter(p => p.nom.toLowerCase().includes(recherche))
      .forEach(p => {
        const div = document.createElement("div");
        div.classList.add("produit");
        div.innerHTML = `
          <img src="${p.image}" />
          <h4>${p.nom}</h4>
          <p>${p.prix} FG</p>
          <button onclick="ajouterAuPanier('${p.id}')">Ajouter</button>
        `;
        listeProduits.appendChild(div);
      });
  }

  window.ajouterAuPanier = function(id) {
    const p = produits.find(x=>x.id===id);
    panier.push(p);
    updatePanierDOM();
  }

  document.getElementById("recherche").addEventListener("input", afficherProduits);

  // ==================== VENDEUR ====================
  document.getElementById("ajouterProduit").addEventListener("click", async ()=>{
    const nom = document.getElementById("pNom").value;
    const prix = parseInt(document.getElementById("pPrix").value);
    const file = document.getElementById("pImage").files[0];

    if(!nom || !prix || !file) return alert("Tous les champs sont obligatoires");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "doneah-multi");
    const res = await fetch(`https://api.cloudinary.com/v1_1/dmwrnpkhw/image/upload`,{
      method:"POST",
      body:formData
    });
    const data = await res.json();

    const produit = {nom, prix, image:data.secure_url};
    await addDoc(collection(db,"produits"),produit);
    chargerProduits();
  });

  // ==================== ADMIN ====================
  document.getElementById("loginAdmin").addEventListener("click", async ()=>{
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;
    if(user==="papasta" && pass==="papasta3494") adminLogged=true;
    if(!adminLogged) return alert("Infos incorrectes");

    const snapshot = await getDocs(collection(db,"commandes"));
    const adminDiv = document.getElementById("adminCommandes");
    adminDiv.innerHTML = "";
    snapshot.forEach(doc=>{
      const c = doc.data();
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `
        <h4>${c.nomClient} -> ${c.nomProduit}</h4>
        <p>Vendeur: ${c.vendeur}</p>
        <p>Adresse: ${c.ville} | ${c.recepteurNom}</p>
        <p>Total: ${c.total} FG</p>
      `;
      adminDiv.appendChild(div);
    });
  });

  // ==================== VALIDATION COMMANDE ====================
  document.getElementById("valider").addEventListener("click", async ()=>{
    const nomClient = document.getElementById("clientNom").value;
    const nomProduit = panier.map(p=>p.nom).join(", ");
    const vendeur = "Vendeur";
    const ville = document.getElementById("ville").value;
    const recepteurNom = document.getElementById("recepteurNom").value;
    const total = parseInt(grandTotalEl.innerText);

    if(!nomClient || !nomProduit || !ville || !recepteurNom) return alert("Tous les champs sont obligatoires");

    await addDoc(collection(db,"commandes"),{
      nomClient, nomProduit, vendeur, ville, recepteurNom, total
    });
    panier = [];
    updatePanierDOM();
    okEl.innerText="✅ Commande validée !";
  });

  // ==================== CHAT IA ====================
  const chatHeader = document.getElementById("chatHeader");
  const chatBody = document.getElementById("chatBody");
  const chatInputContainer = document.getElementById("chatInputContainer");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  if(chatHeader && chatBody && chatInputContainer && chatInput && chatSend){
    chatHeader.addEventListener("click", ()=>{
      const visible = chatBody.style.display !== "none";
      chatBody.style.display = visible ? "none" : "block";
      chatInputContainer.style.display = visible ? "none" : "flex";
    });

    chatSend.addEventListener("click", ()=>{
      const msg = chatInput.value.trim();
      if(!msg) return;

      const divUser = document.createElement("div");
      divUser.innerHTML = `<b>Vous:</b> ${msg}`;
      chatBody.appendChild(divUser);

      const divIA = document.createElement("div");
      divIA.innerHTML = `<b>Assistant IA:</b> Je peux vous aider avec votre marketplace.`;
      chatBody.appendChild(divIA);

      chatInput.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }

  // ==================== INITIAL ====================
  chargerProduits();

}); // FIN DOMContentLoaded
