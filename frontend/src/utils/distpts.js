export default function distpts(d) {
  return parseInt(
    Math.min(500, Math.pow(Math.E, (d * -1 + 18797) / 3000) - 0.5)
  );
}
