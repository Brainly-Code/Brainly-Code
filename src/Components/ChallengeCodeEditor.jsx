import React, { useState, useRef, useEffect } from "react";
import { diffLines, diffWords } from 'diff';
import { useGetLessonSolutionQuery } from "../redux/api/LessonSlice";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const compareCode = (studentCode, solutionCode) => {
  const differences = diffLines(studentCode, solutionCode);
  return differences.map((part, index) => ({
    added: part.added,
    removed: part.removed,
    value: part.value,
    index
  }));
}


const ChallengeCodeEditor = ({ solutionCode }) => {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const [srcDoc, setSrcDoc] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [studentCode, setStudentCode] = useState("");
  const [diffs, setDiffs] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [hasPassed, setHasPassed] = useState(false);
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
            // Intercept console.log
            const log = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'console', data: args }, window.location.origin);
              log.apply(console, args);
            };
            
            try {
              ${js}
            } catch (err) {
              console.log(err.message + '\n' + err.stack);
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
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "console") {
        setConsoleOutput((prev) => {
          const newLogs = [...prev, ...event.data.data];
          return newLogs.slice(-100);
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (solutionCode && studentCode) {
      const differences = diffWords(solutionCode, studentCode);
      setDiffs(differences);
      setFeedback(
        differences.some(d => d.added || d.removed)
          ? "Your code does not match the solution. Please review the highlighted differences."
          : "Great job! Your code matches the solution."
      );
    }
  }, [studentCode, solutionCode]);

  const {data: solution, isLoading} = useGetLessonSolutionQuery(4);
  const checkSolution = () => {
    if (!solutionCode) {
      setFeedback([{ value: "Solution not available. Please try again later.", index: 0 }]);
      return;
    }
    
    const solution = solutionCode;
    const studentCode = `${html}`;
    const differences = compareCode(studentCode, solution);
    setDiffs(differences);
    setFeedback(
      differences.some(d => d.removed || d.added)
        ? "Your code does not match the solution. Please review the highlighted differences."
        : "Great job! Your code matches the solution."
    );

    if(differences[0]?.value) {
      setHasPassed(true);
    }else{
      setHasPassed(false);
      toast.error("Your code should render 'This is My first HTML code!!!'")
    }

    console.log(hasPassed);
  }

  const handleSubmit = async () => {
    const allCorrect = instructions.every((inst, idx) => userAnswers[idx].trim() === inst.solutionCode.trim());
    if (allCorrect) {
      await completeChallenge({ userId, challengeId });
      toast.success("Challenge completed!");
      // navigate or update UI
    } else {
      toast.error("Some answers are incorrect. Please review your code.");
    }
  };

  // if(error) {
  //   Navigate('/error')
  // }

  if(isLoading) {
    return <Loader2/>
  }

  return (
    <div className="p-4 h-full">
      <div className="flex h-[35rem]">
        {/* Editors */}
        <div className="bg-[#1C2526]">
          <div className="border-b-2">
            <h1 className="text-gray-300 mt-[1rem] text-center">Editor</h1>
          </div>
          <div className="flex gap-1 p-[3rem] h-[30rem] w-[90%]">
            <div>
              <h2 className="text-gray-500 text-sm text-center">index.html</h2>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="HTML"
                aria-label="HTML code editor"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full"
              />
            </div>
            <div>
              <h2 className="text-gray-500 text-sm text-center">index.css</h2>
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                placeholder="CSS"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full"
              />
            </div>
            <div>
              <h2 className="text-gray-500 text-sm text-center">index.js</h2>
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                placeholder="JavaScript"
                className="text-gray-300 m-1 bg-[#1C2526] p-2 text-sm rounded h-full"
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
                    {JSON.stringify(log, null, 2)}
                  </pre>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {diffs.length > 0 && (
        <div className="mt-4 p-2 bg-gray-800 text-white rounded">
          <h3 className="font-semibold">Feedback</h3>
          <div className="flex flex-col gap-2">
            {diffs.map((part, idx) => (
              <div key={idx} className="flex items-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    part.added ? 'bg-green-400' : part.removed ? 'bg-red-400' : 'bg-gray-600'
                  }`}
                />
                <pre
                  className={`${
                    part.added ? 'text-green-400' : part.removed ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {part.value}
                </pre>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-300">
            {feedback}
          </div>
        </div>
      )}

      <br />
      <div className="flex justify-center">
        {
          hasPassed === false ? (
            <button
              type="button"
              onClick={() => {
                runCode();
                checkSolution();
              }}
              aria-label="Run code and check solution"
              className="mt-2 px-6 py-2 bg-gradient-to-r hover:from-[#00ffffa2] hover:to-[#8342f3] from-[#00FFFF] to-[#8F57EF] text-white rounded-lg"
            >
              Run and Check Solution
            </button>
          ) : (
            <button
            type="button"
            aria-label="Correct code"
            className="mt-2 px-6 py-2 bg-gradient-to-r hover:from-[#00ffffa2] hover:to-[#8342f3] from-[#00FFFF] to-[#8F57EF] text-white rounded-lg"
            >
              Thats Correct
            </button>
          )
        }
      </div>

      {/* Instructions and Submission */}
      <div className="mt-8">
        <h2 className="text-white text-lg font-semibold mb-4">Instructions</h2>
        <div className="bg-[#222] p-4 rounded">
          <p className="text-gray-300 text-sm mb-4">
            Please follow the instructions below to complete the challenge:
          </p>
          <ol className="list-decimal list-inside text-gray-300 text-sm">
            <li className="mb-2">
              Implement the required features in the code editor.
            </li>
            <li className="mb-2">
              Use the "Run and Check Solution" button to test your code.
            </li>
            <li>
              Once you are satisfied with your solution, click on the "Submit Challenge" button.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-white text-lg font-semibold mb-2">Submission</h2>
        <p className="text-gray-300 text-sm mb-4">
          When you are ready to submit your challenge, click the button below:
        </p>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeCodeEditor;
