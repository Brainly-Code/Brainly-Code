import React, { useState, useRef, useEffect } from "react";

const PlaygroundCodeEditor = () => {
  const [html, setHtml] = useState("<h1>Hello, World!</h1>");
  const [css, setCss] = useState("h1 { color: blue; }");
  const [js, setJs] = useState('console.log("Test message from JavaScript!");');
  const [srcDoc, setSrcDoc] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const iframeRef = useRef(null);

  const runCode = () => {
    const codeWithConsoleCapture = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // Store original console.log
            const originalConsoleLog = console.log;
            console.log = function(...args) {
              args.forEach(arg => {
                try {
                  window.parent.postMessage(
                    { type: 'console', data: arg },
                    '*'
                  );
                  originalConsoleLog('Sent to parent:', arg);
                } catch (err) {
                  originalConsoleLog('Error in postMessage:', err);
                }
              });
              originalConsoleLog.apply(console, args);
            };

            try {
              ${js}
            } catch (err) {
              console.log('Error: ' + err.message + '\\n' + err.stack);
            }
          </script>
        </body>
      </html>
    `;

    setConsoleOutput([]); // Clear previous output
    setSrcDoc(codeWithConsoleCapture);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Temporarily allow all origins for debugging
      console.log('Received message:', event.data); // Debug log
      if (event.data?.type === 'console') {
        setConsoleOutput((prev) => {
          const newLog = typeof event.data.data === 'string'
            ? event.data.data
            : JSON.stringify(event.data.data, null, 2);
          const newLogs = [...prev, newLog];
          return newLogs.slice(-100); // Keep last 100 logs
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="p-4 h-full">
      <div className="flex h-[35rem]">
        {/* Editors */}
        <div className="bg-[#1C2526] w-[50%]">
          <div className="border-b-2">
            <h1 className="text-gray-300 mt-[1rem] text-center">Editor</h1>
          </div>
          <div className="flex gap-1 p-[3rem] h-[30rem]">
            <div className="w-1/3">
              <h2 className="text-gray-500 text-sm text-center">index.html</h2>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="HTML"
                aria-label="HTML code editor"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full w-full"
              />
            </div>
            <div className="w-1/3">
              <h2 className="text-gray-500 text-sm text-center">index.css</h2>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder="CSS"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full w-full"
              />
            </div>
            <div className="w-1/3">
              <h2 className="text-gray-500 text-sm text-center">index.js</h2>
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                placeholder="JavaScript"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white h-[100%] w-[50%] p-1">
          <h1 className="text-gray-800 text-center font-semibold">Output</h1>
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-[50vh] mt-2 rounded border"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={srcDoc}
          />
          <div className="text-center mt-2">
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="px-4 py-1 bg-gray-800 text-white rounded"
            >
              {showConsole ? "Hide Console" : "Show Console"}
            </button>
          </div>
          {showConsole && (
            <div className="mt-2 p-2 bg-black text-green-400 h-32 overflow-y-auto rounded text-sm">
              {consoleOutput.length === 0 ? (
                <p className="text-gray-500 italic">No console output</p>
              ) : (
                consoleOutput.map((log, idx) => (
                  <pre key={idx} className="whitespace-pre-wrap">
                    {log}
                  </pre>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <br />
      <div className="flex justify-center">
        <button
          type="button"
          onClick={runCode}
          aria-label="Run code and check solution"
          className="mt-2 px-6 py-2 bg-gradient-to-r hover:from-[#00ffffa2] hover:to-[#8342f3] from-[#00FFFF] to-[#8F57EF] text-white rounded-lg"
        >
          Run and Check Solution
        </button>
      </div>
    </div>
  );
};

export default PlaygroundCodeEditor;