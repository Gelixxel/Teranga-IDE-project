import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import CodeMirrorEditor from "./CodeMirrorEditor";
import { Treeview, TreeNodeType } from "./FileTree";
import "./Editor.css"; // Ensure this line is present to import styles

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [output, setOutput] = useState<string>("");
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // Load content, file path, and selected node from localStorage
    const savedContent = localStorage.getItem("content");
    const savedFilePath = localStorage.getItem("filePath");
    const savedSelected = localStorage.getItem("selected");
    if (savedContent) setContent(savedContent);
    if (savedFilePath) setFilePath(savedFilePath);
    if (savedSelected) setSelected(savedSelected);
  }, []);

  useEffect(() => {
    // Save content, file path, and selected node to localStorage whenever they change
    localStorage.setItem("content", content);
    localStorage.setItem("filePath", filePath);
    localStorage.setItem("selected", selected || "");
  }, [content, filePath, selected]);

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

  const fetchFiles = useCallback(async (directoryPath: string) => {
    try {
      console.log(`Fetching files for directory: ${directoryPath}`);
      const response = await axios.post("/api/explore", { directoryPath });
      console.log("Fetched files:", response.data);

      return response.data.map((file: { name: string; directory: boolean }) => ({
        id: directoryPath ? `${directoryPath}/${file.name}` : file.name,
        name: file.name,
        children: file.directory ? [] : [],
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files: " + error);
      return [];
    }
  }, []);

  const fetchChildren = useCallback(async (id: string): Promise<TreeNodeType[]> => {
    return fetchFiles(id);
  }, [fetchFiles]);

  useEffect(() => {
    const initializeTree = async () => {
      const rootChildren = await fetchFiles("");
      setTreeData(rootChildren);
    };

    initializeTree();
  }, [fetchFiles]);

  const openFile = useCallback(async (path: string) => {
    try {
      const response = await axios.post("/api/open", { filePath: path });
      if (response.data.startsWith("Error: Path is a directory")) {
        // Handle directory case if needed
      } else if (response.data.startsWith("Error")) {
        alert(response.data); // Display backend error message
      } else {
        const fileContent = response.data;
        setContent(fileContent);
        const detectedLanguage = fileExtensionToLanguage(path);
        setLanguage(detectedLanguage);
        setFilePath(path);
        setSelected(path);
      }
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Error opening file: " + error);
    }
  }, [fileExtensionToLanguage]);

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

  return (
    <div className="flex">
      <Treeview.Root
        value={selected}
        onChange={(id: string) => openFile(id)}
        label="File Explorer"
        className="w-72 h-full border-[1.5px] border-slate-200 m-4"
        fetchChildren={fetchChildren}
      >
        {treeData.map(node => (
          <Treeview.Node node={node} key={node.id} />
        ))}
      </Treeview.Root>
      <div className="flex flex-col flex-grow">
        <input
          type="text"
          placeholder="File path"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="p-2 border-b"
        />
        <div className="flex space-x-2 p-2">
          <button onClick={() => openFile(filePath)} className="btn">Open</button>
          <button onClick={saveFile} className="btn">Save</button>
          <button onClick={executeFile} className="btn">Run</button>
        </div>
        <CodeMirrorEditor
          initialValue={content}
          language={language}
          onChange={handleChange}
        />
        <pre className="output p-2">{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
