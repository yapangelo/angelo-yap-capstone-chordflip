import { useState, useEffect, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Text } from "slate";
import { withHistory } from "slate-history";
import axios from "axios";
import isHotkey from "is-hotkey";
import "./TextArea.scss";

const TextArea = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const [chordData, setChordData] = useState({});

  useEffect(() => {
    const fetchChords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/chords");
        console.log("API Response:", response.data);
        setChordData(response.data);
      } catch (error) {
        console.error("Error fetching chords:", error);
      }
    };

    fetchChords();
  }, []);

  const isChord = (word) => {
    if (!word || word.length < 1) return false;
    const chordLetter = word[0].toUpperCase();
    const chordModifier = word.slice(1);

    if (!chordModifier) {
      return chordData[chordLetter] && chordData[chordLetter]["major"];
    }

    return chordData[chordLetter] && chordData[chordLetter][chordModifier];
  };

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (Text.isText(node)) {
        const { text } = node;
        const words = text.split(" ");
        let start = 0;

        words.forEach((word) => {
          const end = start + word.length;
          if (isChord(word)) {
            ranges.push({
              anchor: { path, offset: start },
              focus: { path, offset: end },
              chord: true,
            });
          }
          start = end + 1;
        });
      }

      return ranges;
    },
    [chordData]
  );

  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.chord) {
      return <strong {...attributes}>{children}</strong>;
    }

    return <span {...attributes}>{children}</span>;
  }, []);

  const handleKeyDown = (e) => {
    if (isHotkey("mod+z", e)) {
      e.preventDefault();
      editor.undo();
    } else if (isHotkey("mod+shift+z", e)) {
      e.preventDefault();
      editor.redo();
    } else if (isHotkey("tab", e)) {
      e.preventDefault();
      editor.insertText("    ");
    }
  };

  return (
    <div className="textarea">
      <input className="textarea__title" placeholder="Songtitle" />
      <input className="textarea__artist" placeholder="Artist" />
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(newValue) => setValue(newValue)}
        className="textarea__chords-container"
      >
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          placeholder="Lyrics and chords..."
          className="textarea__chords"
        />
      </Slate>
    </div>
  );
};

export default TextArea;
