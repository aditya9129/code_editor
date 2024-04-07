import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';


const Editor = () => {
    const editorRef = useRef(null);
    useEffect(() => {
        console.log()
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            )
        }
        init();
    }, []);

 

    return <div className='h-screen'><textarea id="realtimeEditor"></textarea></div>;
};

export default Editor;