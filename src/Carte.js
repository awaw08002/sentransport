 import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap }
  from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Exercice 1 
const iconeOrange = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(
    Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Exercice 2 
function BoutonCentrer({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button
      className="bouton-centrer"
      onClick={() => map.setView(position, 15)}
    >
      Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur]
    = useState(null);
  const [arretsProches, setArretsProches] = useState([]); // Exercice 3

  const DAKAR = [14.6928, -17.4467];

  // Charger les arrets depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err =>
        console.error("Erreur arrets :", err));
  }, []);

  // Geolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

  // Exercice 3 
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const tries = arrets
        .map(a => ({
          ...a,
          distance: calculerDistance(
            positionUtilisateur[0],
            positionUtilisateur[1],
            a.lat, a.lon
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      setArretsProches(tries);
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrets</h2>

      {/* Exercice 3 : liste des 3 arrets les plus proches */}
      {arretsProches.length > 0 && (
        <div className="arrets-proches-liste">
          <p><strong>Les 3 arrêts les plus proches :</strong></p>
          {arretsProches.map((a, i) => (
            <p key={a.id} className="arret-proche">
              {i + 1}. {a.nom} — {a.distance.toFixed(1)} km
            </p>
          ))}
        </div>
      )}

      <MapContainer center={DAKAR} zoom={13}
        className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Exercice 2 : bouton centrer */}
        <BoutonCentrer position={positionUtilisateur} />

        {/* Exercice 1 : marqueur orange pour le plus proche */}
        {arrets.map(a => (
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            icon={
              arretsProches[0]?.id === a.id
                ? iconeOrange
                : new L.Icon.Default()
            }
          >
            <Popup>
              <strong>{a.nom}</strong><br/>
              Lignes : {a.lignes.join(", ")}
            </Popup>
          </Marker>
        ))}

        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous etes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;