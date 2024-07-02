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
  const [fontFamily, setFontFamily] = useState<string>("monospace"); // Default font family

  useEffect(() => {
    // Load content, file path, selected node, and font family from localStorage
    const savedContent = localStorage.getItem("content");
    const savedFilePath = localStorage.getItem("filePath");
    const savedSelected = localStorage.getItem("selected");
    const savedFontFamily = localStorage.getItem("fontFamily");
    if (savedContent) setContent(savedContent);
    if (savedFilePath) setFilePath(savedFilePath);
    if (savedSelected) setSelected(savedSelected);
    if (savedFontFamily) setFontFamily(savedFontFamily);
  }, []);

  useEffect(() => {
    // Save content, file path, selected node, and font family to localStorage whenever they change
    localStorage.setItem("content", content);
    localStorage.setItem("filePath", filePath);
    localStorage.setItem("selected", selected || "");
    localStorage.setItem("fontFamily", fontFamily);
  }, [content, filePath, selected, fontFamily]);

  const fileExtensionToLanguage = useCallback((path: string): 'python' | 'java' => {
    const extension = path.split('.').pop()?.toLowerCase();
    return extension === 'py' ? 'python' : extension === 'java' ? 'java' : 'python';
  }, []);

  const fetchFiles = useCallback(async (directoryPath: string) => {
    try {
      console.log(`Fetching files for directory: ${directoryPath}`);
      const response = await axios.post("/api/explore", { directoryPath });
      console.log("Fetched files:", response.data);

      return response.data.map((file: { name: string; directory: boolean }) => ({
        id: directoryPath ? `${directoryPath}/${file.name}` : file.name,
        name: file.name,
        children: file.directory ? [] : undefined,
        directory: file.directory,
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
        // Handle directory case by expanding it in the tree
        const fetchedChildren = await fetchFiles(path);
        setTreeData((prevData) =>
          prevData.map((node) =>
            node.id === path ? { ...node, children: fetchedChildren } : node
          )
        );
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
  }, [fileExtensionToLanguage, fetchFiles]);

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

  const createNewFile = useCallback(async (fileName: string) => {
    try {
      const response = await axios.post("/api/create", {
        filePath: fileName,
        isDirectory: false,
      });
      if (response.data.startsWith("Error")) {
        alert(response.data); // Display backend error message
      } else {
        alert("File created successfully!");
        setTreeData(await fetchFiles("")); // Refresh file tree
      }
    } catch (error) {
      console.error("Error creating file:", error);
      alert("Error creating file: " + error);
    }
  }, [fetchFiles]);

  return (
    <div className="editor-container">
      <aside className="file-explorer">
        <Treeview.Root
          value={selected}
          onChange={(id: string) => openFile(id)}
          label="File Explorer"
          className="file-tree"
          fetchChildren={fetchChildren}
        >
          {treeData.map(node => (
            <Treeview.Node node={node} key={node.id} />
          ))}
        </Treeview.Root>
      </aside>
      <main className="editor-main">
        <div className="toolbar">
          <input
            type="text"
            placeholder="File path"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="file-path-input"
          />
          <button onClick={() => openFile(filePath)} className="button open">Open</button>
          <button onClick={saveFile} className="button save">Save</button>
          <button onClick={executeFile} className="button run">Run</button>
        </div>
        <div className="settings-bar">
          <label htmlFor="fontSelector">Select Font:</label>
          <select
            id="fontSelector"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="font-selector"
          >
            {['Monospace', 'Arial', 'Courier New', 'Georgia', 'Tahoma', 'Verdana', 'JetBrains Mono'].map(font => (
              <option value={font}>{font}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New file name"
            className="new-file-input"
            id="newFileName"
            onKeyDown={(e) => e.key === 'Enter' && createNewFile((document.getElementById("newFileName") as HTMLInputElement).value)}
          />
          <button
            onClick={() => {
              const newFileName = (document.getElementById("newFileName") as HTMLInputElement).value;
              createNewFile(newFileName);
            }}
            className="button new-file"
          >
            New File
          </button>
        </div>
        <div className="code-editor">
          <CodeMirrorEditor
            initialValue={content}
            language={language}
            onChange={handleChange}
            fontFamily={fontFamily}
          />
        </div>
        <pre className="output">{output}</pre>
      </main>
    </div>
  );
};

export default Editor;

