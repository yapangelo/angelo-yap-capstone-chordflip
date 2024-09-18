import "./WritePage.scss";
import Navigation from "../../components/Navigation/Navigation";
import TextArea from "../../components/TextArea/TextArea";

const WritePage = () => {
  return (
    <div className="writepage">
      <div className="writepage__functions">
        <Navigation />
      </div>
      <div className="writepage__textarea">
        <TextArea />
      </div>
    </div>
  );
};
export default WritePage;
