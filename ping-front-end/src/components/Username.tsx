import React, { useState } from 'react';
import './PopupParam.css';

interface UserNameProps {
    toggle: () => void;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}


const UserName: React.FC<UserNameProps> = ({ toggle, username, setUsername }) => {
    const [newUsername, setNewUsername] = useState(username);

    const handleSave = () => {
        setUsername(newUsername);
        if (toggle) toggle();
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>User name</h2>
                <input 
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserName;