import React, { useState } from 'react';
import axios from 'axios';
import './PopupParam.css';

interface PasswordUpdateProps {
    toggle: () => void;
}

const PasswordUpdate: React.FC<PasswordUpdateProps> = ({ toggle }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false); // State to manage save button disable

    const handleSave = async () => {
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }
        setIsSaving(true); // Disable save button while saving
        try {
            const response = await axios.put('/api/updatePassword', { currentPassword, newPassword });
            if (response.data.success) {
                toggle();
                alert('Password updated successfully!');
            } else {
                alert('Failed to update password.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password.');
        } finally {
            setIsSaving(false); // Re-enable save button
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Password</h2>
                <input 
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                />
                <button onClick={handleSave} disabled={isSaving}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default PasswordUpdate;
