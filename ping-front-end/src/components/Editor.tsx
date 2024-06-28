import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import CodeMirrorEditor from "./CodeMirrorEditor";
import FileTree from "./FileTree";

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [output, setOutput] = useState<string>("");

  const fileExtensionToLanguage = useCallback((filePath: string): "python" | "java" => {
    const extension = filePath.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "py":
        return "python";
      case "java":
        return "java";
      default:
        return "python"; // default language if extension is not recognized
    }
  }, []);

  const openDirectory = useCallback(async (directoryPath: string) => {
    try {
      const response = await axios.post("/api/openDirectory", { filePath: directoryPath });
      setOutput(JSON.stringify(response.data, null, 2)); // Display directory content in the output
    } catch (error) {
      console.error("Error opening directory:", error);
      alert("Error opening directory: " + error);
    }
  }, []);

  const openFile = useCallback(async (path: string) => {
    try {
      const response = await axios.post("/api/open", { filePath: path });
      if (response.data.startsWith("Error: Path is a directory")) {
        openDirectory(path);
      } else if (response.data.startsWith("Error")) {
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
  }, [fileExtensionToLanguage, openDirectory]);

  const saveFile = useCallback(async () => {
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
  }, [filePath, content]);

  const executeFile = useCallback(async () => {
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
  }, [filePath, content, language]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  useEffect(() => {
    if (filePath) {
      const detectedLanguage = fileExtensionToLanguage(filePath);
      setLanguage(detectedLanguage);
    }
  }, [filePath, fileExtensionToLanguage]);

  return (
    <div>
      <FileTree onFileSelect={openFile} />
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
