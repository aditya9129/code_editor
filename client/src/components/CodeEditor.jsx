import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-javascript";
import { initSocket } from "../../socket.js";
import { useParams } from "react-router-dom";
import WhiteBoard from "./WhiteBoard.jsx";
const Editor = ({ socketRef ,roomid,code}) => {
  const editorRef = useRef(null);
  const boardref=useRef(null);
  const [output, setOutput] = useState("");
  const [wb,setwb]=useState(true);
  console.log(code);
  // useEffect(() => {
    
  //     // editorRef.current.editor.Value=code;
  //     editorRef.current.editor.setValue(code);
    
  // }, [code]);
  const runCode = async () => {
    const code = editorRef.current.editor.getValue();
    const formattedCode = code.replace(/\n/g, ' '); // Replace '\n' with actual line breaks
   
    try {
      const response = await fetch("http://localhost:5000/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: formattedCode }),
      });
      const data = await response.json();
      if (response.ok) {
        
        setOutput(data.output);
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput(error);
    }
  };
  const boardchange=()=>{
    console.log('y');
  }
  const syncCode = () => {
    const code = editorRef.current.editor.getValue();
    console.log(editorRef.current);
    console.log(code);
    
    if (code) {
      socketRef.current.emit("sync-change", {
        roomid,
        code,
      });
      
    }
  };

  return (
    <div className="wb p-4">
    
      <AceEditor
        ref={editorRef}
        className={wb ? 'block' : 'hidden'}
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
      {!wb && <WhiteBoard ref={boardref} className='' onChange={boardchange}/>}
      <button
        onClick={runCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Code
      </button>
      <button
        onClick={()=>setwb(!wb)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {wb ? 'WhiteBoard':'Editor'}
      </button>
      <div className="mt-4 p-4 bg-gray-900 text-white rounded overflow-auto max-h-28">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
