import React, { useState } from 'react';
import axios from 'axios';
import './PopupParam.css';

interface UserNameProps {
    toggle: () => void;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const UserName: React.FC<UserNameProps> = ({ toggle, username, setUsername }) => {
    const [newUsername, setNewUsername] = useState(username);
    const [isSaving, setIsSaving] = useState(false); // State to manage save button disable

    const handleSave = async () => {
        setIsSaving(true); // Disable save button while saving
        try {
            const response = await axios.put('/api/updateUserDetails', { username: newUsername });
            if (response.data.success) {
                setUsername(newUsername);
                toggle();
                alert('Username updated successfully!');
            } else {
                alert('Failed to update username.');
            }
        } catch (error) {
            console.error('Error updating username:', error);
            alert('Error updating username.');
        } finally {
            setIsSaving(false); // Re-enable save button
        }
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
                <button onClick={handleSave} disabled={isSaving}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserName;
