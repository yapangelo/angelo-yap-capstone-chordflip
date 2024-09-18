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
    const pageHeight = doc.internal.pageSize.height; // Get page height
    const lineHeight = 7; // Height of one line of text
    let currentY = 20; // Start position for the content

    // Add the title (in bold)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 10, currentY);
    currentY += lineHeight; // Move to the next line

    // Add the artist
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(artist, 10, currentY);
    currentY += lineHeight;

    // Extract the chords and lyrics from the Slate editor
    const chordsText = extractSlateContent();

    // Function to handle adding text and page breaks
    const addTextWithPageBreaks = (text, x, y) => {
      const lines = doc.splitTextToSize(text, 180); // Split text into lines that fit within the width of the page
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - 10) {
          // Check if the current position exceeds page height
          doc.addPage(); // Add a new page
          y = 10; // Reset y position at the top of the new page
        }
        doc.text(line, x, y); // Add the text
        y += lineHeight; // Move to the next line
      });
      return y; // Return the updated y-coordinate
    };

    // Add the chords and lyrics, handling page overflow
    currentY = addTextWithPageBreaks(chordsText, 10, currentY);

    // Save the PDF
    doc.save(`${title || "Song"}.pdf`);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleArtistChange = (e) => setArtist(e.target.value);

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
    if (!word || word.length < 1) return false;

    if (word === "a") {
      return false;
    }

    if (word.includes("/")) {
      const [baseChord, bassNote] = word.split("/");
      return isChord(baseChord) && isChord(bassNote);
    }

    const chordLetter = word[0].toUpperCase();
    const chordModifier = word.slice(1);

    if (!chordModifier) {
      return chordData[chordLetter] && chordData[chordLetter]["major"];
    }

    if (chordModifier.startsWith("#")) {
      const sharpChord = chordLetter + "#";
      const sharpModifier = chordModifier.slice(1);
      return (
        chordData[sharpChord] &&
        (sharpModifier
          ? chordData[sharpChord][sharpModifier]
          : chordData[sharpChord]["major"])
      );
    }

    if (chordModifier.startsWith("sus")) {
      if (
        chordData[chordLetter] &&
        (chordData[chordLetter]["sus2"] || chordData[chordLetter]["sus4"])
      ) {
        chordData[chordLetter]["sus"] =
          chordData[chordLetter]["sus2"] || chordData[chordLetter]["sus4"];
      }

      return (
        chordData[chordLetter] &&
        (chordData[chordLetter]["sus"] || chordData[chordLetter][chordModifier])
      );
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
