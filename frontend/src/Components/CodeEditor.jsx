import React, { useState, useRef, useEffect } from "react";

const CodeEditor = () => {
  const [code, setCode] = useState(`<!-- Write your HTML here -->`);

  const [srcDoc, setSrcDoc] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const iframeRef = useRef(null);

  const runCode = () => {
    const codeWithConsoleCapture = `
      <!-- Write your HTML here -->
      <h1>Hello World</h1>
      <style>
        h1 {
          color: #00DEDE;
          text-align: center;
          font-family: sans-serif;
        }
      </style>
      <script>
        console.log("JS is running...");
      </script>
      ${code}
    `;

    setConsoleOutput([]);
    setSrcDoc(codeWithConsoleCapture);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "console") {
        setConsoleOutput((prev) => [...prev, ...event.data.data]);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="p-4 h-[120%]">
      <div className="flex h-[35rem]">
        <div className="grid grid-cols-2 p-[1rem] h-[100%] w-[50%] bg-[#1C2526]">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="10"
            className="text-gray-300 m-5 w-[200%] bg-[#1C2526] p-2 text-sm rounded"
            cols="60"
          />
        </div>

        <div className="bg-white h-[100%] w-[50%] p-1">
          <h1 className="text-gray-800 text-center font-semibold">Output</h1>
          <iframe
            ref={iframeRef}
            title="Live HTML Preview"
            className="w-full h-64 mt-2 rounded border"
            sandbox="allow-scripts"
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
                    {String(log)}
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
          onClick={runCode}
          className="mt-2 px-6 items-center py-2 bg-gradient-to-r from-[#00FFFF] to-[#8F57EF] text-white rounded-lg"
        >
          Check out output
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
