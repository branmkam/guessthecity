import { useState, useEffect } from "react";
import "./index.css";
import c from "../../data/worldcities.json";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CityAutocomplete from "./components/CityAutocomplete";
import L from "leaflet";
import marker from "./assets/marker.svg";
import AnimatedNumber from "./components/AnimatedNumber";
import RegionMap from "./components/RegionMap";
import haversine from "./utils/haversine";
import distpts from "./utils/distpts";

const ids = Object.keys(c["city_ascii"]);

function App() {
  const [minPop, setMinPop] = useState(200000);
  const [id, setId] = useState(randomId(200000));
  const [selected, setSelected] = useState(null);
  const [ac, setAc] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [end, setEnd] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const lat = c.lat[id];
  const lng = c.lng[id];

  function getDistances(guesses) {
    return guesses.map((g) => haversine([lat, lng], [c.lat[g], c.lng[g]]));
  }

  function closestindex(distances) {
    return distances.indexOf(Math.min(...distances));
  }

  //closest index
  function calcPts(guesses) {
    return (
      -20 * guesses.length +
      (guesses.includes(id.toString())
        ? 1020
        : 120 * guesses.map((i) => c.continent[i]).includes(c.continent[id]) +
          120 * guesses.map((i) => c.region[i]).includes(c.region[id]) +
          160 * guesses.map((i) => c.country[i]).includes(c.country[id]) +
          (c.admin_name[id]
            ? 60 *
              guesses.map((i) => c.admin_name[i]).includes(c.admin_name[id])
            : 0) +
          (guesses.length > 0
            ? distpts(
                getDistances(guesses)[closestindex(getDistances(guesses))]
              )
            : 0))
    );
  }

  const prevpoints =
    guesses.length < 1
      ? 0
      : Math.max(0, calcPts(guesses.slice(0, guesses.length - 1)));
  const points = Math.max(0, calcPts(guesses));

  function randomId(minPop = 200000) {
    let valids = ids.filter((i) => c.population[i] >= minPop);
    //every region equal chance
    const areas = Array.from(new Set(valids.map((v) => c.region[v])));
    let area = areas[parseInt(Math.random() * areas.length)];
    //must have required pop
    let cities = valids.filter((i) => c.region[i] == area);
    let chosen = cities[parseInt(Math.random() * cities.length)];
    return chosen;
  }

  const markerIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    iconAnchor: [16, 45],
    iconSize: [32, 45],
  });

  const RecenterAutomatically = () => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.panTo([lat, lng]);
      }
    }, [map]);
    return null;
  };

  //winner
  useEffect(() => {
    if (guesses.includes(id.toString())) {
      setEnd(true);
    }
  }, [guesses, id]);

  function escFunction(e) {
    if (e.key === "Escape") {
      setShowSettings(false);
      setShowMap(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", escFunction);
    return () => window.removeEventListener("keydown", escFunction);
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen font-oxygen ">
      <div className="fixed z-50 top-0 right-0 p-3 text-right flex flex-col rounded-xl bg-[#00000099]">
        <p className="z-50 text-xl font-bold text-right text-green-500 font-catamaran md:text-2xl lg:text-5xl">
          Guess the City
        </p>
        <a
          href="https://brandonkaminski.dev"
          rel="noreferrer"
          target="_blank"
          className="pt-1 pb-3 text-sm text-blue-400 underline hover:text-blue-200"
        >
          by Brandon Kaminski
        </a>
        <p className="text-white underline hover:cursor-pointer md:hidden">
          {guesses.length} tries
        </p>

        {guesses.length > 0 && (
          <p className="hidden px-2 text-xl text-green-600 md:block">
            Guesses:
          </p>
        )}
        <div className="hidden overflow-y-auto md:flex md:flex-col md:gap-1 max-h-16 md:max-h-32">
          {guesses.map((g, i) => (
            <p key={"name" + i} className="z-50 px-1 text-white">
              {i + 1}. {c.city_ascii[g]},{" "}
              {c.admin_name[g] && c.admin_name[g] + ", "} {c.country[g]}
            </p>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="animate-fadein z-50 flex flex-col gap-3 items-center justify-center p-4 bg-[#ffffffdd] w-5/6 rounded-xl sm:w-1/2 h-[350px]">
          <div className="flex flex-col items-center justify-between w-full gap-4 text-center">
            <p className="text-4xl font-bold text-slate-900">Settings</p>
            <span>
              Minimum Population: {minPop} (
              {ids.filter((i) => c.population[i] >= minPop).length} cities){" "}
            </span>
            <input
              className="w-3/4"
              onChange={(e) => {
                setMinPop(e.target.value);
                setSelected(null);
                setAc("");
              }}
              value={minPop}
              type="range"
              min="200000"
              max="3000000"
              step="100000"
            />
            <span className="flex flex-row gap-4">
              <button
                onClick={() => {
                  setSelected(null);
                  setAc("");
                  setEnd(false);
                  setId(randomId(minPop));
                  setShowMap(false);
                  setShowSettings(false);
                }}
                className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-500"
              >
                update
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                }}
                className="px-4 py-2 text-lg text-white bg-red-700 rounded-lg hover:bg-red-500"
              >
                cancel
              </button>
            </span>
          </div>
        </div>
      )}

      {showMap && !end && (
        <div className="z-50 flex flex-col md:flex-row gap-3 items-center justify-between p-4 bg-[#ffffffdd] w-5/6 rounded-xl sm:w-1/2 h-[350px]">
          <div className="flex flex-row items-center justify-between w-full gap-2 text-center md:flex-col">
            <p>Mouse over a country to see the region it's categorized in.</p>
            <button
              onClick={() => setShowMap(false)}
              className="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-400 hover:cursor-pointer"
            >
              Back
            </button>
          </div>
          <RegionMap className="h-64" />
        </div>
      )}

      {/* give up */}
      {end && (
        <div className="animate-fadein z-50 flex flex-col items-center justify-center gap-3 p-6 text-center rounded-xl md:w-96 bg-[#ccccccee]">
          {guesses.includes(id.toString()) ? (
            <p className="text-4xl text-green-700 font-catamaran">
              You got it in <br /> {guesses.length} guess
              {guesses.length !== 1 && "es"}!
            </p>
          ) : (
            <p className="text-4xl text-red-600 font-catamaran">Good try!</p>
          )}
          <p className="text-xl">
            You scored{" "}
            <AnimatedNumber
              end={points}
              className="text-blue-700"
              duration={1.5}
            />{" "}
            this round!
          </p>
          <a
            rel="noreferrer"
            target="_blank"
            href={
              "https://www.google.com/maps/search/" +
              c.city_ascii[id] +
              "," +
              (c.admin_name[id] && c.admin_name[id]) +
              ", " +
              c.country[id]
            }
            className="text-xl underline hover:text-red-500 text-slate-900"
          >
            {c.city_ascii[id]}, {c.admin_name[id] && c.admin_name[id] + ", "}{" "}
            {c.country[id]}
          </a>
          <p className="text-sm">Metro Population of {c.population[id]}</p>
          <button
            onClick={() => {
              setSelected(null);
              setAc("");
              setEnd(false);
              setId(randomId(minPop));
              setGuesses([]);
              setShowMap(false);
            }}
            className="px-4 py-2 text-lg text-white bg-blue-700 rounded-lg hover:bg-blue-500"
          >
            play again
          </button>
        </div>
      )}

      {guesses.length >= 0 && (
        <div className="fixed z-40 flex items-end p-2 overflow-y-auto max-h-80 max-w-40 md:max-w-80 top-2 left-2">
          <div className="z-30 flex flex-col flex-wrap items-start gap-1">
            <p className="z-40 p-2 px-2 py-1 text-3xl text-green-800 rounded-lg bg-[#ffffffdd]">
              <AnimatedNumber end={points} start={prevpoints} duration={1.5} />{" "}
            </p>
            {guesses.length > 0 && (
              <div className="p-2 bg-black rounded-lg">
                <p className="text-sm text-white">
                  Closest:{" "}
                  {parseInt(
                    getDistances(guesses)[closestindex(getDistances(guesses))]
                  )}{" "}
                  km
                </p>
                <p className="text-sm font-bold text-white">
                  ({c.city_ascii[guesses[closestindex(getDistances(guesses))]]},{" "}
                  {c.iso3[guesses[closestindex(getDistances(guesses))]]})
                </p>
              </div>
            )}
            {/* right continent */}
            {guesses.map((i) => c.continent[i]).includes(c.continent[id]) && (
              <p className="z-10 px-2 py-1 text-sm text-white bg-green-800 rounded-lg animate-fadein">
                {c.continent[id]}
              </p>
            )}
            {guesses.map((i) => c.region[i]).includes(c.region[id]) && (
              <p className="z-10 px-2 py-1 text-sm text-white bg-green-800 rounded-lg animate-fadein">
                {c.region[id]}{" "}
                <span
                  className="font-bold hover:cursor-pointer hover:text-red-500"
                  onClick={() => setShowMap(true)}
                >
                  ( ? )
                </span>
              </p>
            )}
            {/* right country */}
            {guesses.map((i) => c.country[i]).includes(c.country[id]) && (
              <p className="z-10 px-2 py-1 text-sm text-white bg-green-800 rounded-lg animate-fadein">
                {c.country[id]}
              </p>
            )}
            {/* right subdivision */}
            {c.admin_name[id] &&
              guesses.map((i) => c.admin_name[i]).includes(c.admin_name[id]) &&
              guesses.map((i) => c.country[i]).includes(c.country[id]) && (
                <p className="z-10 px-2 py-1 text-sm text-white bg-green-800 rounded-lg animate-fadein">
                  {c.admin_name[id]}
                </p>
              )}
          </div>
        </div>
      )}

      <div className="fixed z-40 flex flex-row gap-3 bottom-6 right-2">
        <button
          onClick={() => {
            setShowSettings(!end);
          }}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 "
        >
          settings
        </button>
        <button
          onClick={() => {
            setEnd(true);
            setShowSettings(false);
            setShowMap(false);
          }}
          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-800 "
        >
          give up
        </button>
      </div>

      <div className="fixed z-20 gap-4 bottom-2 left-2">
        <div className="">
          <CityAutocomplete
            value={ac}
            setValue={setAc}
            onChange={(e) => {
              setAc(e.target.value);
              setSelected(null);
            }}
            minPop={minPop}
            setSelected={setSelected}
            selected={selected}
            guesses={guesses}
            setGuesses={setGuesses}
          />
        </div>

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
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker icon={markerIcon} position={[lat, lng]}></Marker>
        <RecenterAutomatically lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

export default App;
