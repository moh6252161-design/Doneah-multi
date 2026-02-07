import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// 🔹 Config Firebase publique
const firebaseConfig = {
  apiKey: "AIzaSyDyuJO9uwn3nTuYS-AsznAKsLtBKSnWjjo",
  authDomain: "doneah-multi.firebaseapp.com",
  projectId: "doneah-multi",
  storageBucket: "doneah-multi.appspot.com",
  messagingSenderId: "462776568623",
  appId: "1:462776568623:web:60272d31e00bbe156a2fda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Produits fictifs pour test
let produits = [
  {id:"p1", nom:"Téléphone Samsung A32", prix:700000, image:"images/produit1.jpg"},
  {id:"p2", nom:"Télévision écran 32\"", prix:530000, image:"images/produit2.jpg"},
  {id:"p3", nom:"Casque audio JBL", prix:120000, image:"images/produit3.jpg"}
];

let panier = [];

const listeProduits = document.getElementById("listeProduits");
const listePanier = document.getElementById("listePanier");
const totalEl = document.getElementById("total");
const grandTotalEl = document.getElementById("grandTotal");
const sliderProduits = document.getElementById("sliderProduits");

// ==================== PRODUITS ====================
function afficherProduits(){
  listeProduits.innerHTML="";
  produits.forEach(p=>{
    const div = document.createElement("div");
    div.classList.add("produit");
    div.innerHTML=`
      <img src="${p.image}" />
      <h4>${p.nom}</h4>
      <p>${p.prix} FG</p>
      <button onclick="ajouterAuPanier('${p.id}')">Ajouter <i class="fa-solid fa-cart-plus"></i></button>
    `;
    listeProduits.appendChild(div);
  });
}

function afficherSlider(){
  sliderProduits.innerHTML="";
  produits.forEach(p=>{
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML=`<img src="${p.image}">`;
    sliderProduits.appendChild(slide);
  });
  new Swiper(".mySwiper", {loop:true, pagination:{el:".swiper-pagination", clickable:true}});
}

// ==================== PANIER ====================
window.ajouterAuPanier = function(id){
  const p = produits.find(x=>x.id===id);
  panier.push(p);
  updatePanier();
}

function updatePanier(){
  listePanier.innerHTML="";
  let total = 0;
  panier.forEach(p=>{
    const div = document.createElement("div");
    div.innerText = `${p.nom} - ${p.prix} FG`;
    listePanier.appendChild(div);
    total += p.prix;
  });
  totalEl.innerText=total;
  grandTotalEl.innerText=total;
}

// ==================== CONTACT ====================
document.getElementById("envoyerMessage").addEventListener("click", async ()=>{
  const nom = document.getElementById("contactNom").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;
  if(!nom || !email || !message) return alert("Tous les champs sont obligatoires");
  await addDoc(collection(db,"messages"), {nom,email,message,date:new Date()});
  document.getElementById("contactOk").innerText="✅ Message envoyé !";
  document.getElementById("contactNom").value="";
  document.getElementById("contactEmail").value="";
  document.getElementById("contactMessage").value="";
});

// ==================== THEME ====================
document.getElementById("themeBtn").addEventListener("click", ()=>{
  document.body.classList.toggle("theme-dark");
});

// ==================== INIT ====================
afficherProduits();
afficherSlider();
