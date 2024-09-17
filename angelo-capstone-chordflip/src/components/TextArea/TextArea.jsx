import "./TextArea.scss";

const TextArea = () => {
  return (
    <div className="textarea">
      <input className="textarea__title" placeholder="Songtitle" />
      <input className="textarea__artist" placeholder="Artist" />
      <textarea
        className="textarea__chords"
        placeholder="Enter lyrics and chords here..."
      />
    </div>
  );
};
export default TextArea;
