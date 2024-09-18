import React, { useState, useMemo } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";

const SimpleTextEditor = () => {
  // Initialize the Slate.js editor with React and History support
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initial value of the editor, starting with an empty paragraph
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Start typing here..." }],
    },
  ]);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable
        placeholder="Enter some text..."
        style={{
          minHeight: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </Slate>
  );
};

export default SimpleTextEditor;
