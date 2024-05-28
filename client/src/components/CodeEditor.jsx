import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-javascript";
import WhiteBoard from "./WhiteBoard.jsx";

const Editor = ({ socketRef, roomid, code }) => {
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  const [wb, setWb] = useState(true);

  useEffect(() => {

      editorRef.current.editor.setValue(code, 1); // Set code and move cursor to the end
    
  }, [code]);

  const runCode = async () => {
    const code = editorRef.current.editor.getValue();
    const formattedCode = code.replace(/\n/g, " "); // Replace '\n' with actual line breaks

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


// import { useEffect, useRef, useState } from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/theme-dracula";
// import "ace-builds/src-noconflict/mode-javascript";
// import io from "socket.io-client";
// import { useParams } from "react-router-dom";
// import debounce from "lodash.debounce";

// const socket = io("http://localhost:5000");

// const CodeEditor = () => {
//   const { roomid } = useParams(); // Assume roomid is available from the URL
//   const editorRef = useRef(null);
//   const [output, setOutput] = useState("");
//   const [initialCode, setInitialCode] = useState("");

//   useEffect(() => {
//     socket.emit("join", { roomid, username: "User" });

//     socket.on("codeOutput", (data) => {
//       setOutput(data.output);
//     });

//     socket.on("codeChange", (data) => {
//       if (editorRef.current) {
//         const currentCode = editorRef.current.editor.getValue();
//         if (currentCode !== data.code) {
//           editorRef.current.editor.setValue(data.code, 1); // 1 to move the cursor to the end of the code
//         }
//       }
//     });

//     socket.on("initialCode", (data) => {
//       setInitialCode(data.code);
//     });

//     return () => {
//       socket.off("codeOutput");
//       socket.off("codeChange");
//       socket.off("initialCode");
//     };
//   }, [roomid]);

//   useEffect(() => {
//     if (editorRef.current && initialCode) {
//       editorRef.current.editor.setValue(initialCode, 1); // 1 to move the cursor to the end of the code
//     }
//   }, [initialCode]);

//   const runCode = () => {
//     const code = editorRef.current.editor.getValue();
//     socket.emit("runCode", { code });
//   };

//   const debounceCodeChange = debounce((newCode) => {
//     socket.emit("codeChange", { roomid, code: newCode });
//   }, 500);

//   const onCodeChange = (newCode) => {
//     debounceCodeChange(newCode);
//   };

//   return (
//     <div className="h-screen">
//       <AceEditor
//         ref={editorRef}
//         mode="javascript"
//         theme="dracula"
//         name="editor"
//         onChange={onCodeChange}
//         fontSize={14}
//         height="70vh"
//         width="100%"
//         showPrintMargin={false}
//         showGutter={true}
//         highlightActiveLine={true}
//         value={initialCode}
//         setOptions={{
//           enableBasicAutocompletion: true,
//           enableLiveAutocompletion: true,
//           enableSnippets: false,
//           showLineNumbers: true,
//           tabSize: 2,
//         }}
//       />
//       <button
//         onClick={runCode}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Run Code
//       </button>
//       <pre className="mt-4 p-4 bg-gray-900 text-white rounded">{output}</pre>
//     </div>
//   );
// };

// export default CodeEditor;
