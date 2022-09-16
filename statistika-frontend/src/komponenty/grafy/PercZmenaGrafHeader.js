import "chartjs-adapter-moment";

import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import { formatPrice, getPercentageChange } from "../../pomocky/cislovacky";
import { MdEuroSymbol } from "react-icons/md";

const PercZmenaGrafHeader = ({ style, chartData }) => {
  let perc = getPercentageChange(chartData[0]?.y, chartData?.at(-1)?.y);
  let cena = formatPrice(chartData?.at(-1)?.y - chartData[0]?.y, ",");
  return (
    <div style={{ position: "relative", ...style }}>
      <div className="perc-zmena-chart-burza">
        <p id="eur-zmena">
          <MdEuroSymbol /> {(chartData?.at(-1)?.y - chartData[0]?.y < 0 ? "" : "+") + cena}
        </p>
        <span style={{ color: perc < 0 ? "#f1556c" : "#0acf97", backgroundColor: perc > 0 ? "rgba(10,207,151,.18)" : "" }} id="perc-zmena">
          {perc < 0 ? <VscTriangleDown /> : <VscTriangleUp />} {Math.abs(perc)}%
        </span>
      </div>
    </div>
  );
};

export default PercZmenaGrafHeader;
