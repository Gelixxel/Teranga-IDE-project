import React, { useState } from 'react';
import axios from 'axios';
import CodeMirrorEditor from './CodeMirrorEditor';

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

  const openFile = async () => {
    try {
      const response = await axios.post('/api/open', null, {
        params: {
          filePath: filePath,
        },
      });
      setContent(response.data);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const saveFile = async () => {
    try {
      const formData = new FormData();
      const blob = new Blob([content], { type: 'text/plain' });
      formData.append('file', blob);
      formData.append('filePath', filePath);

      await axios.post('/api/save', formData);
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

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
      <select value={language} onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python')}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>
      <CodeMirrorEditor
        value={content}
        language={language}
        onChange={(value) => setContent(value)}
      />
    </div>
  );
};

export default Editor;
