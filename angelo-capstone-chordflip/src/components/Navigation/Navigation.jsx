import "./Navigation.scss";
import { Link } from "react-router-dom";
import chevron from "../../assets/chevron.svg";
import logo from "../../assets/chordflip-logo-notext.svg";

const Navigation = () => {
  return (
    <>
      <Link to="/" className="navigation__nav navigation__nav--hide">
        <img src={chevron} alt="back" className="navigation__nav" />
      </Link>
      <Link to="/">
        <img src={logo} alt="logo" className="navigation__logo" />
      </Link>
    </>
  );
};
export default Navigation;
