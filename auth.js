// auth.js
import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Email / Password
export async function registerEmail(nom, metier, telephone, quartier, email, password){
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    const uid = userCredential.user.uid;
    await set(ref(db,'prestataires/'+uid), { nom, metier, telephone, quartier, email });
    alert("Compte créé !");
}

export async function loginEmail(email,password){
    await signInWithEmailAndPassword(auth,email,password);
    alert("Connexion réussie !");
    window.location.href="dashboard.html";
}

// Téléphone + SMS OTP
export function setupPhoneAuth(){
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
}

export function sendOTP(phoneNumber){
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then(confirmationResult => { window.confirmationResult = confirmationResult; alert("Code envoyé !"); })
      .catch(error => alert(error.message));
}

export function verifyOTP(code){
    window.confirmationResult.confirm(code)
      .then(result => alert("Connexion réussie !"))
      .catch(error => alert(error.message));
}

// Google
export function loginGoogle(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth,provider)
      .then(result => {
        const user = result.user;
        set(ref(db,'prestataires/'+user.uid), {
            nom:user.displayName,
            email:user.email,
            metier:"",
            telephone:"",
            quartier:""
        });
        alert("Connexion Google réussie !");
        window.location.href="dashboard.html";
      })
      .catch(error => alert(error.message));
}
