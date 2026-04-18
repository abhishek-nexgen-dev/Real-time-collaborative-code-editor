import { useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { SocketIOProvider } from 'y-socket.io';

import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('userName');
  });
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const editRef = useRef(null);

  const providerRef = useRef(null);
  const bindingRef = useRef(null);


    useEffect(() => {
    if (userName) {
      console.log('Joining with username:', userName);

       const provider = new SocketIOProvider(
        'http://localhost:3000',
        'monaco-demo',
        ydoc,
        {
          autoConnect: true,
        }
      );

     

 
      console.log('SocketIOProvider set in state:', socket);

 
     
      provider.awareness.setLocalStateField('user', {
        name: userName,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });

      provider.awareness.on('change', () => {
        const states = Array.from(provider.awareness.getStates().values());
        console.log('Active users:', states);
        setUsers(states.map((state) => state.user).filter((user)=> Boolean(user.name)));
      });

      providerRef.current = provider;
     
    }

    let  beforeUnloadHandler = (e) => {
     provider.disconnect();
     provider.awareness.setLocalStateField('user', null);
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);


  }, [userName]);



  const handleMount = (editor) => {
    editRef.current = editor;

    const monacoBinding = new MonacoBinding(
        yText,
        editRef.current.getModel(),
        new Set([editRef.current]),
 
      );
      bindingRef.current = monacoBinding;

  };

  const handleJoin = (e) => {
    e.preventDefault();
    window.history.pushState({}, '?userName=' + e.target.username.value);
    setJoined(true);

     


  };



  if (!joined) {
    return (
      <div className="User-Name-Container h-screen w-screen p-6 bg-gray-900 flex items-center justify-center">
        <form
          className="User-Name-Box bg-black/45 rounded-xl p-4 text-white flex flex-col gap-3"
          onSubmit={handleJoin}
        >
          <h2 className="text-lg font-bold">
            Enter your name to join the editor
          </h2>
          <input
            type="text"
            className="p-2 rounded bg-gray-800 text-white"
            name="username"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={!userName.trim()}
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="Text-Editor-Container h-screen w-screen p-6 bg-gray-900 flex gap-3">
      <aside className="Sidebar h-full w-1/4 bg-black/45  rounded-xl p-4 text-white">
      
          <div>
            <h3 className="text-lg font-bold mb-2">Welcome {userName}!</h3>
            <h4 className="text-md font-semibold mb-1">Active Users:</h4>
            <ul className="list-disc list-inside">
              {socket &&
                Array.from(socket.awareness.getStates().values()).map((state, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: state.user.color }}
                    ></span>
                    {state.user.name}
                  </li>
                ))}
            </ul>
          </div>
       
      </aside>

      <main className="Code-Container h-full w-3/4 bg-black/45 p-4 text-white rounded-xl">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          className="rounded-lg "
          onMount={handleMount}
        />
      </main>
    </div>
  );
}

export default App;
