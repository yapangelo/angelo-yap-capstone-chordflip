import "./Functions.scss";
import { useState } from "react";
import guitar from "../../assets/func-guitar.svg";
import piano from "../../assets/func-piano.svg";
import up from "../../assets/func-up.svg";
import down from "../../assets/func-down.svg";
import download from "../../assets/func-download.svg";

const Functions = ({ onTransposeUp, onTransposeDown }) => {
  const [instrument, setInstrument] = useState(true);

  const toggleInstrumentIcon = () => {
    setInstrument((prevState) => !prevState);
  };

  return (
    <div className="functions">
      <img
        src={instrument ? guitar : piano}
        alt={instrument ? "guitar" : "piano"}
        className="functions__icon"
        onClick={toggleInstrumentIcon}
      />
      <img
        src={up}
        alt="up"
        className="functions__icon"
        onClick={onTransposeUp} // Trigger transpose up
      />
      <img
        src={down}
        alt="down"
        className="functions__icon"
        onClick={onTransposeDown} // Trigger transpose down
      />
      <img src={download} alt="download" className="functions__icon" />
    </div>
  );
};
export default Functions;
