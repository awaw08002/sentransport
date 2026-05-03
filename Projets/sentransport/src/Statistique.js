function Statistique({ chiffre, libelle }) {
  return (
    <div className="statistique">
      <strong>{chiffre}</strong>
      <span>{libelle}</span>
    </div>
  );
}

export default Statistique;