<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin - Gestion Produits</title>
apiKey: "TA_CLE_API",
authDomain: "TON_PROJET.firebaseapp.com",
projectId: "TON_PROJET",
storageBucket: "TON_PROJET.appspot.com",
messagingSenderId: "XXXX",
appId: "XXXX"
  body { font-family: Arial; padding:20px; background:#f4f4f4; }
  table { width:100%; border-collapse: collapse; margin-top:20px; }
  th, td { border:1px solid #ddd; padding:10px; text-align:center; }
  th { background:#28a745; color:white; }
  img { width:80px; border-radius:5px; }
</style>
</head>
<body>
<h2>Tableau de bord - Produits</h2>
<table id="tableProduits">
  <thead>
    <tr>
      <th>Produit</th>
      <th>Vendeur</th>
      <th>Prix</th>
      <th>Description</th>
      <th>Ville</th>
      <th>Mode Paiement</th>
      <th>Image</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script src="admin.js"></script>
</body>
</html>
