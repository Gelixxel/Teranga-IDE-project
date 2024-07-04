import React, { useState } from 'react';
import axios from 'axios';
import './PopupParam.css';

interface UserEmailProps {
    toggle: () => void;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const UserEmail: React.FC<UserEmailProps> = ({ toggle, email, setEmail }) => {
    const [newEmail, setNewEmail] = useState(email);
    const [isSaving, setIsSaving] = useState(false); // State to manage save button disable

    const handleSave = async () => {
        setIsSaving(true); // Disable save button while saving
        try {
            const response = await axios.put('/api/updateUserDetails', { email: newEmail });
            if (response.data.success) {
                setEmail(newEmail);
                toggle();
                alert('Email updated successfully!');
            } else {
                alert('Failed to update email.');
            }
        } catch (error) {
            console.error('Error updating email:', error);
            alert('Error updating email.');
        } finally {
            setIsSaving(false); // Re-enable save button
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Email</h2>
                <input 
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <button onClick={handleSave} disabled={isSaving}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserEmail;
