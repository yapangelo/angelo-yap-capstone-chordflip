import "./WritePage.scss";
import Navigation from "../../components/Navigation/Navigation";
import Functions from "../../components/Functions/Functions";
import TextArea from "../../components/TextArea/TextArea";

const WritePage = () => {
  return (
    <div className="writepage">
      <div className="writepage__functions">
        <Navigation />
        <Functions />
      </div>
      <div className="writepage__textarea">
        <TextArea />
      </div>
    </div>
  );
};
export default WritePage;
