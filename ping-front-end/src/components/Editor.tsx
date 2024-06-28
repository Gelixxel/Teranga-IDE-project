import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import CodeMirrorEditor from "./CodeMirrorEditor";
import FileExplorer from "./FileExplorer";

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<"python" | "java">("java");
  const [output, setOutput] = useState<string>("");

  const fileExtensionToLanguage = (filePath: string): "python" | "java" => {
    const extension = filePath.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "py":
        return "python";
      case "java":
        return "java";
      default:
        return "python"; // default language if extension is not recognized
    }
  };

  const openFile = async (path: string) => {
    try {
      const response = await axios.post("/api/open", { filePath: path });
      if (response.data.startsWith("Error")) {
        alert(response.data); // Display backend error message
      } else {
        const fileContent = response.data;
        setContent(fileContent);
        const detectedLanguage = fileExtensionToLanguage(path);
        setLanguage(detectedLanguage);
        setFilePath(path);
      }
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Error opening file: " + error);
    }
  };

  const saveFile = async () => {
    try {
      const response = await axios.post("/api/save", {
        filePath: filePath,
        content: content,
      });
      if (response.data.startsWith("Error")) {
        alert(response.data); // Display backend error message
      } else {
        alert("File saved successfully!");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file: " + error);
    }
  };

  const executeFile = async () => {
    try {
      const response = await axios.post("/api/execute", {
        filePath: filePath,
        content: content,
        language: language,
      });
      if (response.data.startsWith("Error")) {
        alert(response.data); // Display backend error message
      } else {
        setOutput(response.data);
      }
    } catch (error) {
      console.error("Error executing file:", error);
      alert("Error executing file: " + error);
    }
  };

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  useEffect(() => {
    if (filePath) {
      const detectedLanguage = fileExtensionToLanguage(filePath);
      setLanguage(detectedLanguage);
    }
  }, [filePath]);

  return (
    <div>
      <FileExplorer onFileSelect={openFile} />
      <input
        type="text"
        placeholder="File path"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={() => openFile(filePath)}>Open</button>
      <button onClick={saveFile}>Save</button>
      <button onClick={executeFile}>Run</button>
      <CodeMirrorEditor
        initialValue={content}
        language={language}
        onChange={handleChange}
      />
      <pre>{output}</pre>
    </div>
  );
};

export default Editor;
