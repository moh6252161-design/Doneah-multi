// Pour l’inscription prestataire
document.getElementById('prestataireForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(this);
    const prestataire = Object.fromEntries(formData.entries());
    console.log('Nouveau prestataire:', prestataire);
    document.getElementById('message').innerText = "Inscription réussie ! (Simulation)";
    this.reset();
});

// Pour la recherche client
document.getElementById('searchForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(this);
    const recherche = Object.fromEntries(formData.entries());
    console.log('Recherche client:', recherche);
    // Simulation de résultats
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Résultats pour ${recherche.metier || 'tous métiers'} à ${recherche.zone || 'toute la zone'}</p>
                            <ul>
                                <li>Alpha - Plombier - Zone Conakry - <a href="https://wa.me/625000000">WhatsApp</a></li>
                                <li>Beta - Jardinier - Zone Matoto - <a href="https://wa.me/625111111">WhatsApp</a></li>
                            </ul>`;
});
