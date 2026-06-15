import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte';
import Meteo from './Meteo';
import SignalerIncident from './SignalerIncident';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // Fonction extraite : appelable depuis useEffect ET depuis le bouton
  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // Au démarrage, on appelle la fonction
  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

 function handleClickLigne(ligne) {
  // Si on reclique sur la même ligne, on ferme le détail
  if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
    setLigneSelectionnee(null);
    return;
  }

  // Sinon on charge les détails depuis Flask
  fetch(`http://localhost:5000/lignes/${ligne.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur chargement détail : " + response.status);
      }
      return response.json();
    })
    .then(data => {
      setLigneSelectionnee(data);
    })
    .catch(error => {
      console.error("Erreur :", error.message);
    });
}

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            {/* Bouton Recharger visible aussi en cas d'erreur */}
            <button className="btn-recharger" onClick={chargerLignes}>
              Recharger
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">

        {/* Bouton Recharger */}
        <button className="btn-recharger" onClick={chargerLignes}>
          Recharger
        </button>
        <Meteo />
        <Recherche valeur={recherche} onChange={setRecherche} />
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''}{' '}
          trouvee{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}

        {ligneSelectionnee
        && <DetailLigne ligne={ligneSelectionnee} />}
        <Carte /> {/* NOUVEAU */}
       <SignalerIncident />
      </main>
      <Footer />
    </div>
  );
}

export default App;