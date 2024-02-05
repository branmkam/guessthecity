import { useState, useEffect } from "react";
import "./index.css";
import c from "../../data/worldcities.json";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CityAutocomplete from "./components/CityAutocomplete";

const ids = Object.keys(c["city_ascii"]);

function App() {
  const [id, setId] = useState(ids[parseInt(Math.random() * ids.length)]);
  const [selected, setSelected] = useState(null);
  const lat = c.lat[id];
  const lng = c.lng[id];
  const [ac, setAc] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [end, setEnd] = useState(false);

  function randomId() {
    return ids[parseInt(Math.random() * ids.length)];
  }

  const RecenterAutomatically = () => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.panTo([lat, lng]);
      }
    }, [lat, lng, map]);
    return null;
  };

  //winner
  useEffect(() => {
    console.log(guesses,id);
    if(guesses.includes(id.toString())) {
      setEnd(true);
    }
  }, [guesses, id]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      {/* give up */}
      {end && (
        <div className="z-50 flex flex-col items-center justify-center gap-6 p-10 text-center rounded-xl bg-slate-200">
          {guesses.includes(id.toString()) ? (
            <p className="text-5xl text-green-700">
              You got it in <br /> {guesses.length} guess{guesses.length !== 1 && 'es'}!
            
            </p>
          ) : (
            <p className="text-5xl text-red-600">Good try!</p>
          )}
          <p className="text-2xl">The city was:</p>
          <p className="text-3xl text-slate-900">
            {c.city_ascii[id]}, {c.admin_name[id] && c.admin_name[id] + ", "}{" "}
            {c.country[id]}
          </p>
          <p className="text-lg">Metro Population of {c.population[id]}</p>
          <button
            onClick={() => {
              setSelected(null);
              setAc("");
              setEnd(false);
              setId(randomId());
              setGuesses([]);
            }}
            className="px-4 py-2 text-xl text-white bg-blue-700 hover:bg-blue-500"
          >
            Play again
          </button>
        </div>
      )}

      <div className="fixed z-40 flex p-2 flex-col bg-[#00000099] items-end top-2 right-2">
        {guesses.map((g, i) => (
          <p key={"name" + i} className="z-40 text-white">
            {i + 1}. {c.city_ascii[g]},{" "}
            {c.admin_name[g] && c.admin_name[g] + ", "} {c.country[g]}
          </p>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 z-20 flex flex-row items-end justify-center gap-4 px-6 m-6">
        <div className="flex flex-col gap-1">
          <CityAutocomplete
            value={ac}
            setValue={setAc}
            c={c}
            onChange={(e) => {
              setAc(e.target.value);
              setSelected(null);
            }}
            setSelected={setSelected}
            selected={selected}
            guesses={guesses}
          />
          <div className="flex flex-row flex-wrap items-center justify-start gap-1 w-96">
            {/* right continent */}
            {guesses.map((i) => c.continent[i]).includes(c.continent[id]) && (
              <p className="px-2 py-1 text-sm text-white bg-green-800">
                {c.continent[id]}
              </p>
            )}
            {guesses.map((i) => c.region[i]).includes(c.region[id]) && (
              <p className="px-2 py-1 text-sm text-white bg-green-800">
                {c.region[id]}
              </p>
            )}
            {/* right country */}
            {guesses.map((i) => c.country[i]).includes(c.country[id]) && (
              <p className="px-2 py-1 text-sm text-white bg-green-800">
                {c.country[id]}
              </p>
            )}
            {/* right subdivision */}
            {guesses.map((i) => c.admin_name[i]).includes(c.admin_name[id]) &&
              guesses.map((i) => c.country[i]).includes(c.country[id]) && (
                <p className="px-2 py-1 text-sm text-white bg-green-800">
                  {c.admin_name[id]}
                </p>
              )}
          </div>
        </div>
        <button
          onClick={() => {
            if (!guesses.includes(selected)) {
              //not in array already
              setGuesses((g) => [...g, selected]);
            }
            setSelected(null);
            setAc("");
          }}
          className="px-4 py-2 bg-blue-300 rounded-lg hover:bg-blue-600 "
        >
          select
        </button>{" "}
        <button
          onClick={() => {
            setEnd(true);
          }}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-800 "
        >
          give up
        </button>
        {/* <button
          onClick={() => {
            setId(randomId());
            setGuesses([]);
          }}
          className="px-4 py-2 bg-blue-300 rounded-lg hover:bg-blue-600 "
        >
          reset
        </button> */}
      </div>
      <MapContainer
        className="fixed top-0 left-0 z-0 w-screen h-screen m-0"
        center={[lat, lng]}
        minZoom={10}
        maxZoom={15}
        zoom={12}
        zoomControl={false}
      >
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker position={[lat, lng]}></Marker>
        <RecenterAutomatically lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

export default App;
