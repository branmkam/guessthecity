import regj from "../../../data/regionmap.json";
import Plot from "react-plotly.js";

function unpack(key) {
  return Object.keys(regj["iso3"]).map((k) => regj[key][k]);
}

export default function RegionMap(props) {
  const { className } = props;
  let data = [
    {
      type: "choropleth",
      locationmode: "ISO-3",
      locations: unpack("iso3"),
      text: unpack("regname"),
      z: unpack("reg"),
      colorscale: "Jet",
    },
  ];

  let layout = {
    geo: {
      projection: {
        type: "mercator",
      },
    },
    width: 300,
    height: 250,
    legend: {
        bgcolor: 'black',
    },
    showlegend: false,
    margin: { l: 10, r: 0, b: 0, t: 0 },
  };

  return <Plot className={className} data={data} layout={layout} />;
}
