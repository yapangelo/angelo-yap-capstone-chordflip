import "./InstructionsPage.scss";
import Navigation from "../../components/Navigation/Navigation";

const InstructionsPage = () => {
  return (
    <div className="instructionspage">
      <Navigation />
      <div className="instructionspage__content">
        <h2 className="instructionspage__title">HOW TO USE</h2>
        <ol className="instructionspage__instructions">
          <li className="instructionspage__list-item">
            <h3 className="instructionspage__item-header">Type Song Lyrics</h3>
            <p className="instructionspage__item">
              Start by typing the full lyrics of your song in the text editor
              provided. You can add verses, choruses, or any section you need.
            </p>
          </li>
          <li className="instructionspage__list-item">
            <h3 className="instructionspage__item-header">Add Chords</h3>
            <p className="instructionspage__item">
              To add chords, place them directly above each line of lyrics where
              you want the chord changes to occur.
            </p>
          </li>
          <li className="instructionspage__list-item">
            <h3 className="instructionspage__item-header">
              Automatic Transposition
            </h3>
            <p className="instructionspage__item">
              If you need to transpose the chords, simply use the transposition
              feature (+1, -1) to shift them to the desired key. The app will
              automatically adjust all chords while preserving their placement
              above the lyrics.
            </p>
          </li>
          {/* <li className="instructionspage__list-item">
            <h3 className="instructionspage__item-header">
              Switch Instruments
            </h3>
            <p className="instructionspage__item">
              Click on the guitar or piano icon to switch which chord shapes you
              want to display
            </p>
          </li> */}
          <li className="instructionspage__list-item">
            <h3 className="instructionspage__item-header">Save and Share</h3>
            <p className="instructionspage__item">
              Once you’re happy with your song sheet, save it and share it with
              your band mates, students, or for your own reference during
              practice!
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};
export default InstructionsPage;
