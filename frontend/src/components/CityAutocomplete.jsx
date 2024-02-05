import { useState } from "react";

export default function CityAutocomplete(props) {
  const { c, value, setValue, onChange, selected, setSelected, guesses } =
    props;

  const [ids, setIds] = useState(Object.keys(c.city_ascii));

  return (
    <div className="z-40">
      {value && !selected && (
        <div className="z-40 overflow-y-scroll w-96 max-h-80">
          {ids
            .filter((id) =>
              c.city_ascii[id]
                .trim()
                .toLowerCase()
                .includes(value.trim().toLowerCase())
            )
            .slice(0, 100)
            .map((id) => (
              <div
                onClick={() => {
                  if (!guesses.includes(id)) {
                    setSelected(id);
                    setValue(c.city_ascii[id]);
                  }
                }}
                key={"disp" + id}
                className={
                  "flex flex-row justify-between hover:cursor-pointer bg-white hover:text-white hover:bg-blue-600 " +
                  (guesses.includes(id) &&
                    " hover:bg-white hover:text-slate-400 text-slate-400 hover:cursor-default")
                }
              >
                <span>{c.city_ascii[id]}</span>
                <span>{(c.admin_name[id] && c.admin_name[id] + ", ") + c.country[id]}</span>
              </div>
            ))}
        </div>
      )}
      <input
        value={value}
        className="p-1 text-xl border-2 border-black rounded-lg w-96"
        onChange={onChange}
        placeholder="Type city name here..."
      />
    </div>
  );
}
