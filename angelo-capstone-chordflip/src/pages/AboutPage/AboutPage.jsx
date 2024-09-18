import "./AboutPage.scss";
import Navigation from "../../components/Navigation/Navigation";

const AboutPage = () => {
  return (
    <div className="aboutpage">
      <Navigation />
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
