import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDB32ZuCfKfiQdAxIbSfDUM5xRqJehqy48",
  authDomain: "services-locaux.firebaseapp.com",
  projectId: "services-locaux",
  storageBucket: "services-locaux.firebasestorage.app",
  messagingSenderId: "377929707274",
  appId: "1:377929707274:web:c08d0e246f4ae0084c54f3",
  measurementId: "G-XTQQ1CPMLB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");
  const [providers, setProviders] = useState([]);

  const loginAdmin = async () => {
    if (password !== "Papasta3494") {
      alert("Mot de passe incorrect");
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const addProvider = async () => {
    await addDoc(collection(db, "providers"), {
      service,
      address
    });
    alert("Prestataire ajouté");
  };

  const fetchProviders = async () => {
    const querySnapshot = await getDocs(collection(db, "providers"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    setProviders(list);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services Locaux</h1>

      {!user ? (
        <div>
          <h2>Connexion Admin</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 m-2"
          />
          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 m-2"
          />
          <button onClick={loginAdmin} className="bg-blue-500 text-white p-2">
            Se connecter
          </button>
        </div>
      ) : (
        <div>
          <h2>Ajouter un prestataire</h2>
          <input
            placeholder="Service (ex: plombier)"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border p-2 m-2"
          />
          <input
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 m-2"
          />
          <button onClick={addProvider} className="bg-green-500 text-white p-2">
            Ajouter
          </button>

          <h2 className="mt-6">Rechercher prestataires</h2>
          <button onClick={fetchProviders} className="bg-gray-500 text-white p-2">
            Charger
          </button>

          <ul>
            {providers.map((p, i) => (
              <li key={i} className="border p-2 m-2">
                {p.service} - {p.address}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
