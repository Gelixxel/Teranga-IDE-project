import React, { useState } from 'react';
import axios from 'axios';

const Editor: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [filePath, setFilePath] = useState<string>('');

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
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                cols={80}
            />
        </div>
    );
};

export default Editor;
