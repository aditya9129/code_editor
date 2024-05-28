// import { useEffect, useRef, useState } from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/theme-dracula";
// import "ace-builds/src-noconflict/mode-javascript";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const CodeEditor = () => {
//   const editorRef = useRef(null);
//   const [output, setOutput] = useState("");

//   useEffect(() => {
//     socket.on("codeOutput", (data) => {
//       setOutput(data.output);
//     });

//     return () => {
//       socket.off("codeOutput");
//     };
//   }, []);

//   const runCode = () => {
//     const code = editorRef.current.editor.getValue();
//     socket.emit("runCode", { code });
//   };

//   return (
//     <div className="h-screen">
//       <AceEditor
//         ref={editorRef}
//         mode="javascript"
//         theme="dracula"
//         name="editor"
//         onChange={() => {}}
//         fontSize={14}
//         height="70vh"
//         width="100%"
//         showPrintMargin={false}
//         showGutter={true}
//         highlightActiveLine={true}
//         value=""
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

import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-javascript";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";

const socket = io("http://localhost:5000");

const CodeEditor = () => {
  const { roomid } = useParams(); // Assume roomid is available from the URL
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  const [initialCode, setInitialCode] = useState("");

  useEffect(() => {
    socket.emit("join", { roomid, username: "User" });

    socket.on("codeOutput", (data) => {
      setOutput(data.output);
    });

    socket.on("codeChange", (data) => {
      if (editorRef.current) {
        const currentCode = editorRef.current.editor.getValue();
        if (currentCode !== data.code) {
          editorRef.current.editor.setValue(data.code, 1); // 1 to move the cursor to the end of the code
        }
      }
    });

    socket.on("initialCode", (data) => {
      setInitialCode(data.code);
    });

    return () => {
      socket.off("codeOutput");
      socket.off("codeChange");
      socket.off("initialCode");
    };
  }, [roomid]);

  useEffect(() => {
    if (editorRef.current && initialCode) {
      editorRef.current.editor.setValue(initialCode, 1); // 1 to move the cursor to the end of the code
    }
  }, [initialCode]);

  const runCode = () => {
    const code = editorRef.current.editor.getValue();
    socket.emit("runCode", { code });
  };

  const debounceCodeChange = debounce((newCode) => {
    socket.emit("codeChange", { roomid, code: newCode });
  }, 500);

  const onCodeChange = (newCode) => {
    debounceCodeChange(newCode);
  };

  return (
    <div className="h-screen">
      <AceEditor
        ref={editorRef}
        mode="javascript"
        theme="dracula"
        name="editor"
        onChange={onCodeChange}
        fontSize={14}
        height="70vh"
        width="100%"
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={initialCode}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <button
        onClick={runCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run Code
      </button>
      <pre className="mt-4 p-4 bg-gray-900 text-white rounded">{output}</pre>
    </div>
  );
};

export default CodeEditor;
