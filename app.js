// ==================== INITIALISATION FIREBASE ====================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

// ==================== VARIABLES ====================
let produits = [];
let panier = [];
let adminLogged = false;

// ==================== DOM ELEMENTS ====================
const listeProduits = document.getElementById("listeProduits");
const listePanier = document.getElementById("listePanier");
const compteurPanier = document.getElementById("compteurPanier");
const totalEl = document.getElementById("total");
const fraisEl = document.getElementById("frais");
const grandTotalEl = document.getElementById("grandTotal");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const themeBtn = document.getElementById("themeBtn");

// ==================== MENU ANIME ====================
menuBtn.addEventListener("click", ()=> menu.classList.add("show"));
closeMenu.addEventListener("click", ()=> menu.classList.remove("show"));
document.querySelectorAll("#menu button[data-go]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const cible = document.getElementById(btn.dataset.go);
    if(cible){
      document.querySelectorAll("section").forEach(s=>s.style.display="none");
      cible.style.display="block";
      menu.classList.remove("show");
    }
  });
});

// ==================== THEME CLAR/SOMBRE ====================
themeBtn.addEventListener("click", ()=> document.body.classList.toggle("theme-dark"));

// ==================== PRODUITS ====================
async function chargerProduits(){
  const snapshot = await getDocs(collection(db,"produits"));
  produits = snapshot.docs.map(doc => ({id:doc.id,...doc.data()}));
  afficherProduits();
}

function afficherProduits(){
  listeProduits.innerHTML = "";
  const recherche = document.getElementById("recherche")?.value.toLowerCase() || "";
  produits.filter(p => p.nom.toLowerCase().includes(recherche))
    .forEach(p=>{
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `
        <img src="${p.image}" />
        <h4>${p.nom}</h4>
        <p>${p.prix} FG</p>
        <p>Stock: ${p.stock || 10}</p>
        <button onclick="ajouterAuPanier('${p.id}')" ${p.stock<=0?'disabled':''}>
          ${p.stock<=0?'Rupture':'Ajouter'}
        </button>
      `;
      listeProduits.appendChild(div);
    });
}

// ==================== PANIER ====================
function calculFrais(ville){ 
  const fraisMap = { Conakry:5000, Boké:8000, Kindia:7000, Labe:10000, Nzérékoré:12000 }; 
  return fraisMap[ville]||15000; 
}

function updatePanierDOM(){
  listePanier.innerHTML = "";
  let total=0;
  panier.forEach((p,i)=>{
    const div = document.createElement("div");
    div.classList.add("produit");
    div.innerHTML = `<h4>${p.nom}</h4><p>${p.prix} FG</p><button onclick="supprimerDuPanier(${i})">❌</button>`;
    listePanier.appendChild(div);
    total+=p.prix;
  });
  const ville=document.getElementById("ville")?.value;
  const frais=calculFrais(ville);
  totalEl.innerText=total;
  fraisEl.innerText=frais;
  grandTotalEl.innerText=total+frais;
  compteurPanier.innerText=panier.length;
}

window.supprimerDuPanier=function(i){ panier.splice(i,1); updatePanierDOM(); }
window.ajouterAuPanier=function(id){ const p=produits.find(x=>x.id===id); panier.push(p); updatePanierDOM(); }

document.getElementById("recherche")?.addEventListener("input", afficherProduits);
document.getElementById("ville")?.addEventListener("change", updatePanierDOM);

// ==================== CHAT IA ====================
const chatHeader=document.getElementById("chatHeader");
const chatBody=document.getElementById("chatBody");
const chatInputContainer=document.getElementById("chatInputContainer");
const chatInput=document.getElementById("chatInput");
const chatSend=document.getElementById("chatSend");

chatHeader?.addEventListener("click", ()=>{
  const visible=chatBody.style.display!=="block";
  chatBody.style.display=visible?"block":"none";
  chatInputContainer.style.display=visible?"flex":"none";
});

chatSend?.addEventListener("click", async ()=>{
  const msg=chatInput.value.trim(); if(!msg) return;
  const divUser=document.createElement("div"); divUser.innerHTML=`<b>Vous:</b> ${msg}`; chatBody.appendChild(divUser);
  try{
    const response=await fetch("/api/chatIA",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg})});
    const data=await response.json();
    const divIA=document.createElement("div"); divIA.innerHTML=`<b>Assistant IA:</b> ${data.reply}`; chatBody.appendChild(divIA);
  }catch(err){
    const divIA=document.createElement("div"); divIA.innerHTML=`<b>Assistant IA:</b> Je n'ai pas pu répondre.`; chatBody.appendChild(divIA);
  }
  chatInput.value=""; chatBody.scrollTop=chatBody.scrollHeight;
});

// ==================== INITIAL LOAD ====================
chargerProduits();
