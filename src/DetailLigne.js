function DetailLigne({ ligne }) {
  return (
    <div className="detail-ligne">
      <h2>Ligne {ligne.numero} — Détails</h2>
      <p><strong>Départ :</strong> {ligne.depart}</p>
      <p><strong>Arrivée :</strong> {ligne.arrivee}</p>
      <p><strong>Nombre d'arrêts :</strong> {ligne.arrets}</p>
      <h3>Liste des arrêts :</h3>
      <ol>
        {ligne.listeArrets.map((arret, index) => (
          <li key={index}>{arret}</li>
        ))}
      </ol>
    </div>
  );
}

export default DetailLigne;