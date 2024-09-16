import "./AboutPage.scss";
import { Link } from "react-router-dom";
import chevron from "../../assets/chevron.svg";
import logo from "../../assets/chordflip-logo-notext.svg";

const AboutPage = () => {
  return (
    <div className="aboutpage">
      <Link to="/">
        <img src={chevron} alt="back" className="aboutpage__nav" />
      </Link>
      <Link to="/">
        <img src={logo} alt="back" className="aboutpage__logo" />
      </Link>
      <div className="aboutpage__content">
        <h2 className="aboutpage__title">ABOUT</h2>
        <p>
          Creating song sheets just got a whole lot easier! This app is designed
          for musicians who want to simplify the process of building and
          organizing their song sheets. Whether you're a seasoned pro or just
          starting out, with this app, you can quickly input your songs, chord
          changes and automatically transpose chords. Say goodbye to manually
          changing the chords when transposing and enjoy more time playing your
          music. Perfect for jam sessions, rehearsals, or songwriting on the go!
        </p>
      </div>
    </div>
  );
};
export default AboutPage;
