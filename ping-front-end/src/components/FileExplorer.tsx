import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import "./FileExplorer.css";

interface FileInfo {
  name: string;
  isDirectory: boolean;
}

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const fetchFiles = async (directoryPath: string) => {
    try {
      const response = await axios.post("/api/explore", { directoryPath });
      setFiles(response.data);
      setCurrentPath(directoryPath);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files: " + error);
    }
  };

  useEffect(() => {
    fetchFiles("");
  }, []);

  const navigateTo = (file: FileInfo) => {
    if (file.isDirectory) {
      fetchFiles(`${currentPath}/${file.name}`);
    } else {
      const relativePath = `${currentPath}/${file.name}`.replace(/^\/+/, "");
      console.log("Selected file path: ", relativePath);
      setSelectedFile(relativePath);
      onFileSelect(relativePath);
    }
  };

  const goUp = () => {
    const newPath = currentPath.split("/").slice(0, -1).join("/");
    fetchFiles(newPath || "");
  };

  return (
    <div className="file-explorer">
      <h2>File Explorer</h2>
      <button onClick={goUp} disabled={!currentPath}>
        Up
      </button>
      <ul>
        {files.map((file) => (
          <li
            key={file.name}
            onClick={() => navigateTo(file)}
            className={
              selectedFile === `${currentPath}/${file.name}` ? "selected" : ""
            }
          >
            {file.isDirectory ? <FaFolder /> : <FaFile />} {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;
