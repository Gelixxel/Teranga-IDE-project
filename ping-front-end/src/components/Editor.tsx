import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirrorEditor from './CodeMirrorEditor';

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [language, setLanguage] = useState<'python' | 'java'>('java');

  const fileExtensionToLanguage = (filePath: string): 'python' | 'java' => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      default:
        return 'python'; // default language if extension is not recognized
    }
  };

  const openFile = async () => {
    try {
      const response = await axios.post('/api/open', {
        filePath: filePath,
      });
      const fileContent = response.data;
      setContent(fileContent);
      const detectedLanguage = fileExtensionToLanguage(filePath);
      setLanguage(detectedLanguage);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const saveFile = async () => {
    try {
      await axios.post('/api/save', {
        filePath: filePath,
        content: content,
      });
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  useEffect(() => {
    const detectedLanguage = fileExtensionToLanguage(filePath);
    setLanguage(detectedLanguage);
  }, [filePath]);

  return (
    <div>
      <input
        type="text"
        placeholder="File path"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      />
      <button onClick={openFile}>Open</button>
      <button onClick={saveFile}>Save</button>
      <CodeMirrorEditor
        initialValue={content}
        language={language}
        onChange={(value) => setContent(value)}
      />
    </div>
  );
};

export default Editor;
