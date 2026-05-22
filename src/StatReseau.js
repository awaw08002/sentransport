import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((sum, l) => sum + l.arrets, 0);
  const ligneMax = lignes.reduce((max, l) => l.arrets > max.arrets ? l : max, lignes[0]);

  return (
    <div className="stat-reseau">
      <div className="stat-item">
        <strong>{totalLignes}</strong>
        <span>lignes</span>
      </div>
      <div className="stat-item">
        <strong>{totalArrets}</strong>
        <span>arrêts au total</span>
      </div>
      <div className="stat-item">
        <strong>Ligne {ligneMax.numero}</strong>
        <span>plus d'arrêts ({ligneMax.arrets})</span>
      </div>
    </div>
  );
}

export default StatReseau;