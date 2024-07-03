import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import CodeMirrorEditor from "./CodeMirrorEditor";
import { Treeview, TreeNodeType } from "./FileTree";
import "./Editor.css";
import PopupParam from './PopupParam';
import PasswordModal from "./PasswordModal";
import BreakTimeSettings from "./BreakTimeSettings";
import { useNavigate } from 'react-router-dom';

const emojiArray = ["😀😀😀😀😀😀😀😀😀😀", "😂😂😂😂😂😂😂😂😂😂", "🥲🥲🥲🥲🥲🥲🥲🥲🥲🥲", "😊😊😊😊😊😊😊😊😊😊", "😍😍😍😍😍😍😍😍😍😍", "🤩🤩🤩🤩🤩🤩🤩🤩🤩🤩", "😎😎😎😎😎😎😎😎😎😎", "🤔🤔🤔🤔🤔🤔🤔🤔🤔🤔", "🤗🤗🤗🤗🤗🤗🤗🤗🤗🤗", "🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳", "😜😜😜😜😜😜😜😜😜😜", "🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐", "😇😇😇😇😇😇😇😇😇😇", "🥺🥺🥺🥺🥺🥺🥺🥺🥺🥺", "🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯", "🤠🤠🤠🤠🤠🤠🤠🤠🤠🤠", "🤓🤓🤓🤓🤓🤓🤓🤓🤓🤓", "🤑🤑🤑🤑🤑🤑🤑🤑🤑🤑", "🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡", "🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶"];

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [output, setOutput] = useState<string>("");
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<string>("monospace");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  const [isParamOpen, setIsParamOpen] = useState(false);
  const [isCiphered, setIsCiphered] = useState(false);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const openParamPopup = () => {
    setIsParamOpen(true);
  };
  const closeParamPopup = () => {
    setIsParamOpen(false);
  };

  const checkBreakTimeAndRedirect = async () => {
    try {
      const response = await axios.get("/api/getBreakTime");
      const { startTime, endTime } = response.data;
      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes()}`;
      if (currentTime >= startTime && currentTime <= endTime) {
        navigate("/break");
      }
    } catch (error) {
      console.error("Error fetching break time:", error);
    }
  };

  useEffect(() => {
    const checkAccessAndInitialize = async () => {
      try {
        const usernameResponse = await axios.get("/api/currentUsername");
        setUsername(usernameResponse.data.username);

        await checkBreakTimeAndRedirect();

        const savedContent = localStorage.getItem("content");
        const savedFilePath = localStorage.getItem("filePath");
        const savedSelected = localStorage.getItem("selected");
        const savedFontFamily = localStorage.getItem("fontFamily");
        if (savedContent) setContent(savedContent);
        if (savedFilePath) setFilePath(savedFilePath);
        if (savedSelected) setSelected(savedSelected);
        if (savedFontFamily) setFontFamily(savedFontFamily);
      } catch (error) {
        console.error("Error initializing editor:", error);
      }
    };

    checkAccessAndInitialize();
  }, [navigate]);

  useEffect(() => {
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
      const response = await axios.post("/api/explore", { directoryPath });
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
        const fetchedChildren = await fetchFiles(path);
        setTreeData((prevData) =>
          prevData.map((node) =>
            node.id === path ? { ...node, children: fetchedChildren } : node
          )
        );
      } else if (response.data.startsWith("Error")) {
        alert(response.data);
      } else {
        const fileContent = response.data;
        setContent(fileContent);
        setOriginalContent(fileContent);
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
        alert(response.data);
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
        alert(response.data);
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
        alert(response.data);
      } else {
        alert("File created successfully!");
        setTreeData(await fetchFiles(""));
      }
    } catch (error) {
      console.error("Error creating file:", error);
      alert("Error creating file: " + error);
    }
  }, [fetchFiles]);

  const toggleCipher = () => {
    if (isCiphered) {
      setShowPasswordModal(true);
    } else {
      cipherContent();
      setIsCiphered(true);
    }
  };

  const cipherContent = () => {
    const ciphered = content.split('\n').map(() => emojiArray[Math.floor(Math.random() * emojiArray.length)]).join('\n');
    setContent(ciphered);
  };

  const decipherContent = () => {
    setContent(originalContent);
  };

  const validatePassword = async (password: string) => {
    try {
      const response = await axios.post("/api/validatePassword", {
        username,
        password,
      });
      return response.data.valid;
    } catch (error) {
      console.error("Error validating password:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out: " + error);
    }
  };

  const handleKeyPress = async () => {
    await checkBreakTimeAndRedirect();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
          <button onClick={executeFile} className="button run button-spacing">Run</button>
          <button onClick={toggleCipher} className="button cipher-decipher">
            {isCiphered ? 'Decipher' : 'Cipher'}
          </button>
          <button onClick={openParamPopup} className="button cipher-decipher">Parameters</button>
          <PopupParam
            onClosePopup={closeParamPopup}
            isOpen={isParamOpen}
          />
        </div>
        <div className="settings-bar">
          <div>
            <label htmlFor="fontSelector">Select Font:</label>
            <select
              id="fontSelector"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="font-selector"
            >
              {['Monospace', 'Arial', 'Courier New', 'Georgia', 'Tahoma', 'Verdana', 'JetBrains Mono'].map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
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
      {showPasswordModal && (
        <PasswordModal
          onSubmit={async (password) => {
            if (await validatePassword(password)) {
              decipherContent();
              setIsCiphered(false);
              setShowPasswordModal(false);
            } else {
              alert("Incorrect password");
            }
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Editor;

