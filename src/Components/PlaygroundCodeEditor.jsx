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
            const originalConsoleLog = console.log;
            console.log = function(...args) {
              args.forEach(arg => {
                try {
                  window.parent.postMessage(
                    { type: 'console', data: arg },
                    '*'
                  );
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

    setConsoleOutput([]);
    setSrcDoc(codeWithConsoleCapture);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "console") {
        setConsoleOutput((prev) => {
          const newLog =
            typeof event.data.data === "string"
              ? event.data.data
              : JSON.stringify(event.data.data, null, 2);
          return [...prev, newLog].slice(-100);
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="p-4 h-full">
      {/* Responsive wrapper: stacks on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row h-auto md:h-[35rem] gap-4">
        
        {/* Editors */}
        <div className="bg-black w-full md:w-1/2 rounded-lg">
          <div className="border-b border-gray-700">
            <h1 className="text-gray-300 py-2 text-center text-lg font-semibold">
              Editor
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 p-4 h-[24rem] md:h-[30rem] overflow-auto">
            <div className="flex-1 flex flex-col">
              <h2 className="text-gray-500 text-sm text-center mb-1">index.html</h2>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="HTML"
                aria-label="HTML code editor"
                className="flex-1 text-gray-300 bg-black border border-gray-700 rounded p-2 text-sm resize-none"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h2 className="text-gray-500 text-sm text-center mb-1">index.css</h2>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder="CSS"
                className="flex-1 text-gray-300 bg-black border border-gray-700 rounded p-2 text-sm resize-none"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h2 className="text-gray-500 text-sm text-center mb-1">index.js</h2>
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                placeholder="JavaScript"
                className="flex-1 text-gray-300 bg-black border border-gray-700 rounded p-2 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white w-full md:w-1/2 p-3 rounded-lg shadow">
          <h1 className="text-gray-800 text-center font-semibold">Output</h1>
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-[40vh] md:h-[50vh] mt-2 rounded border"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={srcDoc}
          />
          <div className="text-center mt-2">
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="px-4 py-1 bg-gray-800 text-white rounded text-sm"
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

      {/* Run button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={runCode}
          aria-label="Run code and check solution"
          className="mt-4 px-6 py-2 bg-gradient-to-r hover:from-[#00ffffa2] hover:to-[#8342f3] from-[#00FFFF] to-[#8F57EF] text-white rounded-lg text-sm sm:text-base"
        >
          Run and Check Solution
        </button>
      </div>
    </div>
  );
};

export default PlaygroundCodeEditor;
