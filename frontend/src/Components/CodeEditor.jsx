import React, { useState } from "react";
import { useRunCodeMutation } from "../redux/api/compilerSlice";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [runCode, { isLoading }] = useRunCodeMutation();

  const handleRun = async () => {
    try {
      const res = await runCode({ code, languageId: 71 }).unwrap(); // 71 = Python
      setOutput(res.stdout || res.stderr || "No output");
    } catch (err) {
      console.error("Compilation failed:", err);
      setOutput("Compilation error.");
    }
  };

  return (
    <div className="">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows="10"
        className="bg-black p-[3rem] text-gray-300"
        cols="60"
      />
      <br />
      <button onClick={handleRun} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <pre>{output}</pre>
    </div>
  );
};

export default CodeEditor;
