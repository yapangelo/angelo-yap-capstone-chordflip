import { useState, useEffect } from "react";
import axios from "axios";
import "./TextArea.scss";

const TextArea = () => {
  const [chordNames, setChordNames] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchChords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/chords");
        console.log("API Response:", response.data);

        const chordNamesArray = [];
        for (const chord in response.data) {
          for (const variation in response.data[chord]) {
            if (response.data[chord][variation].name) {
              chordNamesArray.push(response.data[chord][variation].name);
            }
          }
        }

        setChordNames(chordNamesArray);
      } catch (error) {
        console.error("Error fetching chords:", error);
      }
    };

    fetchChords();
  }, []);

  const formatChords = (inputText) => {
    if (!inputText || !Array.isArray(chordNames)) return inputText;

    const words = inputText.split(" ");

    const formattedWords = words.map((word) => {
      const isChord = chordNames.includes(word);
      if (isChord) {
        return `<strong>${word}</strong>`;
      }
      return word;
    });

    return formattedWords.join(" ");
  };

  const handleInput = (e) => {
    const input = e.target.innerText;
    setText(input);
  };

  return (
    <div className="textarea">
      <input className="textarea__title" placeholder="Songtitle" />
      <input className="textarea__artist" placeholder="Artist" />
      <div
        className="textarea__chords"
        contentEditable="true"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: formatChords(text) }}
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
};

export default TextArea;
