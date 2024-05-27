import  { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';


const Editor = () => {
    const editorRef = useRef(null);
    useEffect(() => {
        
        async function iniit() {
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
        iniit();
    }, []);

 

    return <div className='bg-yellow-300  h-full'><div className='h-full'><textarea id="realtimeEditor"></textarea></div></div>;
};

export default Editor;