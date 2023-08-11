import Map from './Map';
import './App.css';
import { useState } from 'react';

// Austurvöllur square in Reykjavik
const userPosition = { lat: 64.1472, lng: -21.9398 };

const powerPlantList = [
  {
    name: "The Fish Market",
    location: { lat: 64.1508, lng: -21.9536 },
  },
  {
    name: "Bæjarins Beztu Pylsur",
    location: { lat: 64.1502, lng: -21.9519 },
  },
  {
    name: "Grillmarkadurinn",
    location: { lat: 64.1475, lng: -21.9347 },
  },
  {
    name: "Kol PowerPlant",
    location: { lat: 64.1494, lng: -21.9337 },
  },
];

const apikey = 'xoBlx_K0CatZaGkIqHuApq0OgdmABUTTwMbQhkRI9t0'

function App() {
  const [powerPlantPositions, setPowerPlantPositions] = useState(powerPlantList);

  fetch('/api/top/10')
    .then(res => res.json())
    .then(res => setPowerPlantPositions(
      res.map(pos => ({
        ...pos, location: { lat: pos.lat, lng: pos.lon } 
      }))));

  return (
    <div className="App">
      <div>
        <Map
          apikey={apikey}
          userPosition={userPosition}
          powerPlantPositions={powerPlantPositions}
        />
      </div>
    </div>
  );
}

export default App
