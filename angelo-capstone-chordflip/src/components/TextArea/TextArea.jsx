import { useState, useEffect, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Transforms, Editor } from "slate";
import { withHistory } from "slate-history";
import axios from "axios";
import isHotkey from "is-hotkey";
import jsPDF from "jspdf";
import "./TextArea.scss";
import Functions from "../Functions/Functions";

const TextArea = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const extractSlateContent = () => {
    return value
      .map((node) => node.children.map((n) => n.text).join(""))
      .join("\n");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;
    let currentY = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 10, currentY);
    currentY += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(artist, 10, currentY);
    currentY += lineHeight;

    const chordsText = extractSlateContent();

    const addTextWithPageBreaks = (text, x, y) => {
      const lines = doc.splitTextToSize(text, 180);
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - 10) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, x, y);
        y += lineHeight;
      });
      return y;
    };

    currentY = addTextWithPageBreaks(chordsText, 10, currentY);

    doc.save(`${title || "Song"}.pdf`);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleArtistChange = (e) => setArtist(e.target.value);

  const [chordData, setChordData] = useState({});

  useEffect(() => {
    const fetchChords = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/chords`
        );
        // console.log("API Response:", response.data);
        setChordData(response.data);
      } catch (error) {
        console.error("Error fetching chords:", error);
      }
    };

    fetchChords();
  }, []);

  const transposeChord = (chord, direction) => {
    const chromaticScale = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
    ];

    if (chord.includes("/")) {
      const [baseChord, bassNote] = chord.split("/");
      const transposeBaseChord = transposeChord(baseChord, direction);
      const transposeBassNote = transposeChord(bassNote, direction);
      return `${transposeBaseChord}/${transposeBassNote}`;
    }

    const sharpChord = chord.length > 1 && chord[1] === "#";
    const baseChord = sharpChord ? chord.slice(0, 2) : chord[0];
    const modifier = sharpChord ? chord.slice(2) : chord.slice(1);

    const chordIndex = chromaticScale.findIndex((note) => note === baseChord);

    let newIndex = direction === "up" ? chordIndex + 1 : chordIndex - 1;

    if (newIndex >= chromaticScale.length) newIndex = 0;
    if (newIndex < 0) newIndex = chromaticScale.length - 1;

    const newChordLetter = chromaticScale[newIndex];

    return newChordLetter + modifier;
  };

  const transposeText = (direction) => {
    const nodes = Array.from(Editor.nodes(editor, { at: [] }));

    nodes.forEach(([node, path]) => {
      if (Text.isText(node)) {
        const words = node.text.split(" ");
        const transposedWords = words.map((word) => {
          if (isChord(word)) {
            return transposeChord(word, direction);
          }
          return word;
        });

        Transforms.insertText(editor, transposedWords.join(" "), { at: path });
      }
    });
  };

  const handleTransposeUp = () => transposeText("up");
  const handleTransposeDown = () => transposeText("down");

  const isChord = (word) => {
    if (!word || word.length < 1 || word === "a") return false;

    const [baseChord, bassNote] = word.includes("/")
      ? word.split("/")
      : [word, null];
    const chordLetter = baseChord[0].toUpperCase();
    const chordModifier = baseChord.slice(1);

    const sharpChord = chordLetter + "#";
    const sharpModifier = chordModifier.startsWith("#")
      ? chordModifier.slice(1)
      : null;

    const isValidSusChord = (chord, modifier) =>
      chordData[chord] &&
      (chordData[chord]["sus2"] ||
        chordData[chord]["sus4"] ||
        chordData[chord][modifier]);

    const result =
      baseChord && bassNote
        ? isChord(baseChord) && isChord(bassNote)
        : chordModifier === ""
        ? chordData[chordLetter] && chordData[chordLetter]["major"]
        : chordModifier.startsWith("#")
        ? sharpModifier && sharpModifier.startsWith("sus")
          ? isValidSusChord(sharpChord, sharpModifier)
          : chordData[sharpChord] &&
            chordData[sharpChord][sharpModifier || "major"]
        : chordModifier.startsWith("sus")
        ? isValidSusChord(chordLetter, chordModifier)
        : chordData[chordLetter] && chordData[chordLetter][chordModifier];

    return result || false;
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
      <div className="textarea__functions">
        <Functions
          onTransposeUp={handleTransposeUp}
          onTransposeDown={handleTransposeDown}
          onDownload={generatePDF}
        />
      </div>
      <input
        className="textarea__title"
        placeholder="Songtitle"
        value={title}
        onChange={handleTitleChange}
      />
      <input
        className="textarea__artist"
        placeholder="Artist"
        value={artist}
        onChange={handleArtistChange}
      />
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
