function Recherche({ valeur, onChange }) {
  return (
    <div className="recherche">
      <input
        type="text"
        placeholder="Rechercher une ligne, un départ, une arrivée..."
        value={valeur}
        onChange={e => onChange(e.target.value)}
        className="input-recherche"
      />
    </div>
  );
}

export default Recherche;