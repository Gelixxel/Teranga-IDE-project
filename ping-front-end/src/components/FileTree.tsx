import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import TreeView from "react-treeview";
import "react-treeview/react-treeview.css"; // Import the styles for react-treeview
import "./FileTree.css"; // Import custom styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome styles

interface FileInfo {
  name: string;
  directory: boolean;
}

interface TreeNode {
  name: string;
  filePath: string;
  directory: boolean;
  children?: TreeNode[];
}

interface FileTreeProps {
  onFileSelect: (filePath: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ onFileSelect }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const fetchFiles = useCallback(async (directoryPath: string) => {
    try {
      console.log(`Fetching files for directory: ${directoryPath}`);
      const response = await axios.post("/api/explore", { directoryPath });
      console.log("Fetched files:", response.data);

      return response.data.map((file: FileInfo) => ({
        name: file.name,
        filePath: directoryPath ? `${directoryPath}/${file.name}` : file.name,
        directory: file.directory,
        children: file.directory ? [] : undefined,
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files: " + error);
      return [];
    }
  }, []);

  useEffect(() => {
    const initializeTree = async () => {
      const rootChildren = await fetchFiles("");
      setTreeData(rootChildren);
    };

    initializeTree();
  }, [fetchFiles]);

  const handleNodeClick = useCallback(async (node: TreeNode) => {
    if (node.directory) {
      const isCollapsed = collapsedNodes.has(node.filePath);
      const newCollapsedNodes = new Set(collapsedNodes);
      if (isCollapsed) {
        newCollapsedNodes.delete(node.filePath);
      } else {
        newCollapsedNodes.add(node.filePath);
        if (!node.children || node.children.length === 0) {
          const children = await fetchFiles(node.filePath);
          setTreeData(prevData =>
            prevData.map(n =>
              n.filePath === node.filePath ? { ...n, children } : n
            )
          );
        }
      }
      setCollapsedNodes(newCollapsedNodes);
    } else {
      onFileSelect(node.filePath);
    }
  }, [collapsedNodes, fetchFiles, onFileSelect]);

  const renderTree = useCallback((nodes: TreeNode[]) => {
    return nodes.map(node => {
      const isCollapsed = collapsedNodes.has(node.filePath);
      const nodeClass = isCollapsed ? 'node-collapsed' : 'node-expanded';

      return (
        <TreeView
          key={node.filePath}
          nodeLabel={
            <div className={`node-label ${nodeClass}`} onClick={() => handleNodeClick(node)}>
              <span className={`icon ${node.directory ? 'folder' : 'file'}`}>
                <i className={`fas fa-${node.directory ? 'folder' : 'file-alt'}`}></i>
              </span>
              {node.name}
            </div>
          }
          collapsed={isCollapsed}
          className="node"
        >
          {node.children && node.children.length > 0 && (
            <div className="children">
              {renderTree(node.children)}
            </div>
          )}
        </TreeView>
      );
    });
  }, [collapsedNodes, handleNodeClick]);

  return <div className="tree-view">{renderTree(treeData)}</div>;
};

export default FileTree;
