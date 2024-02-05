import { useState } from "react";

export default function CityAutocomplete(props) {
  const {
    c,
    value,
    setValue,
    onChange,
    selected,
    setSelected,
    guesses,
    setGuesses,
  } = props;

  let ids = Object.keys(c.city_ascii);

  return (
    <div className="z-40">
      {value && !selected && (
        <div className="z-40 w-48 overflow-y-auto text-[9px] sm:text-[12px] md:text-base bg-white rounded-md sm:w-60 md:w-96 max-h-48 sm:max-h-64 md:max-h-80">
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
                    setSelected(null);
                    setValue("");
                    setGuesses((g) => [...g, id]);
                  }
                }}
                key={"disp" + id}
                className={
                  "flex flex-row px-2 justify-between hover:cursor-pointer bg-white hover:text-white hover:bg-blue-600 " +
                  (guesses.includes(id) &&
                    " hover:bg-white hover:text-slate-400 text-slate-400 hover:cursor-default")
                }
              >
                <span className="text-left">{c.city_ascii[id]}</span>
                <span className='text-right'>
                  {(c.admin_name[id] && c.admin_name[id] + ", ") +
                    c.country[id]}
                </span>
              </div>
            ))}
        </div>
      )}
      <input
        value={value}
        className="w-48 p-1 border-2 border-black rounded-lg sm:text-lg md:text-xl sm:w-60 md:w-96"
        onChange={onChange}
        placeholder="Type city name here..."
      />
    </div>
  );
}
