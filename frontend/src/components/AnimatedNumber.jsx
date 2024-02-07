import useInterval from "../utils/useInterval";
import { useState } from "react";
import { erf } from "mathjs";

//duration should be in seconds
export default function AnimatedNumber(props) {
  const { className, end, start = 0, duration = 1 } = props;

  const dx = 40; //40 ms update

  const [num, setNum] = useState(start);
  const [t, setT] = useState(0);

  useInterval(() => {
    if (Math.abs(num - end) > 0.5) {
      setNum(
        parseInt((erf((3.6477 / duration / 1000) * t - 2) + 1) * 0.5 * (end-start) + start + 0.5)
      );
      setT((ot) => ot + dx);
    } else {
      setNum(num);
      setT(0);
    }
  }, dx);

  return <span className={className}>{num}</span>;
}
