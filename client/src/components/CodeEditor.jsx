import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-dracula';
import WhiteBoard from './WhiteBoard'; // Make sure to import your WhiteBoard component
import debounce from 'lodash.debounce';

const Editor = ({ editorRef, socketRef, roomid, code }) => {
  const [output, setOutput] = useState("");
  const [wb, setWb] = useState(true);
  const [p, setp] = useState('@');

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const currentCode = editor.getValue();
      
      if (currentCode !== code) {
        const cursorPosition = editor.getCursorPosition();
        editor.setValue(code, -1); // Set code and maintain the current cursor position
        editor.moveCursorToPosition(cursorPosition);
      }
    }
  }, [code, editorRef]);

  const runCode = async () => {
    const code = editorRef.current.editor.getValue();
    const codeWithoutComments = code
      .split('\n')
      .map(line => line.replace(/\/\/.*$/, '').trim()) // Remove comments and trim each line
      .join(' ')
      .replace(/"/g, "'"); // Replace double quotes with single quotes
  
    try {
      const response = await fetch("http://localhost:5000/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeWithoutComments }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput(error.toString());
    }
  };
  

  const syncCode = () => {
    const code = editorRef.current.editor.getValue();
    
    if (code ) { // Check if the current code is different from the previous code
      setp(code);
      socketRef.current.emit("sync-change", {
        roomid,
        code,
      });
    }
  };

  // Create a debounced version of syncCode
  const debouncedSyncCode = useRef(debounce(syncCode, 200)).current;

  return (
    <div className="wb p-4">
      <AceEditor
        ref={editorRef}
        className={wb ? "block" : "hidden"}
        mode="javascript"
        theme="dracula"
        name="editor"
        onChange={syncCode}
        fontSize={14}
        height="70vh"
        width="100%"
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      {!wb && <WhiteBoard socketRef={socketRef} roomid={roomid} />}
      <button
        onClick={runCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Code
      </button>
      <button
        onClick={() => setWb(!wb)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {wb ? "WhiteBoard" : "Editor"}
      </button>
      <div className="mt-4 p-4 bg-gray-900 text-white rounded overflow-auto max-h-28">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
