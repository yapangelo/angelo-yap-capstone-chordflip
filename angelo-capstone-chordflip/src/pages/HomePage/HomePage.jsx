import "./HomePage.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/chordflip-logo.svg";

const HomePage = () => {
  return (
    <div className="homepage">
      <img src={logo} alt="chordflip logo" className="homepage__logo" />
      <div className="homepage__nav">
        <Link to="/write">
          <h1 className="homepage__nav-item">WRITE</h1>
        </Link>
        <Link to="/instructions">
          <h1 className="homepage__nav-item">INSTRUCTIONS</h1>
        </Link>
        <Link to="/about">
          <h1 className="homepage__nav-item">ABOUT</h1>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
