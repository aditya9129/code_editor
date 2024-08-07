import { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import WhiteBoard from './WhiteBoard';
import debounce from 'lodash.debounce';

const Editor = ({ editorRef, socketRef, roomid, code }) => {
  const [output, setOutput] = useState("");
  const [wb, setWb] = useState(true);

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
      const response = await fetch("/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeWithoutComments }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error("Error:", error);
      setOutput(error.toString());
    }
  };

  const syncCode = () => {
    const code = editorRef.current.editor.getValue();
    if (code) {
      socketRef.current.emit("sync-change", {
        roomid,
        code,
      });
    }
  };

  const debouncedSyncCode = useRef(debounce(syncCode, 200)).current;

  return (
    <div className="bg-[#141414] border rounded-lg m-1 space-y-4">
      <div className=''>
        <AceEditor
          ref={editorRef}
          className={wb ? "block" : "hidden"}
          mode="javascript"
          theme="twilight"
          name="editor"
          onChange={debouncedSyncCode}
          fontSize={14}
          height="71vh"
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
      </div>
      {!wb && <WhiteBoard socketRef={socketRef} roomid={roomid} className=" w-full" />}
      <div className="flex flex-row-reverse mx-2 bg-[#141414] ">
        {wb && (
          <button
            onClick={runCode}
            className="mt-4 mx-2 px-4 mb-2 bg-black hover:bg-[#363636] text-white rounded transition duration-300"
          >
            Run Code
          </button>
        )}
        <button
          onClick={() => setWb(!wb)}  
          className="mt-4 px-4 py-2 mb-2 bg-black hover:bg-[#363636] text-white rounded transition duration-300"
        >
          {wb ? "WhiteBoard" : "Editor"}
        </button>
      </div>
      {wb && (
        <div className="bg-[#1f1f1f] text-white rounded overflow-auto h-28">
          <p className="text-[#3B3B3B]">{'//output'}</p>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default Editor;

