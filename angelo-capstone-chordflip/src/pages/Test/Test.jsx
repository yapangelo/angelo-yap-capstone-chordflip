import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

const Test = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // Handle key commands (for example, bold, italic)
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Toggle inline styles like bold, italic, underline
  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div>
      {/* Toolbar for formatting */}
      <div className="toolbar">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("BOLD");
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("ITALIC");
          }}
        >
          Italic
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("UNDERLINE");
          }}
        >
          Underline
        </button>
      </div>

      {/* The Draft.js editor */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
        }}
      >
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Type here like Google Docs..."
        />
      </div>
    </div>
  );
};

export default Test;
