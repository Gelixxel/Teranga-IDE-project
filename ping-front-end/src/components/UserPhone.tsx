import React, { useState } from 'react';
import axios from 'axios';
import './PopupParam.css';

interface UserPhoneProps {
    toggle: () => void;
    phone: string;
    setPhone: React.Dispatch<React.SetStateAction<string>>;
}

const UserPhone: React.FC<UserPhoneProps> = ({ toggle, phone, setPhone }) => {
    const [newPhone, setNewPhone] = useState(phone);
    const [isSaving, setIsSaving] = useState(false); // State to manage save button disable

    const handleSave = async () => {
        setIsSaving(true); // Disable save button while saving
        try {
            const response = await axios.put('/api/updateUserDetails', { phone: newPhone });
            if (response.data.success) {
                setPhone(newPhone);
                toggle();
                alert('Phone number updated successfully!');
            } else {
                alert('Failed to update phone number.');
            }
        } catch (error) {
            console.error('Error updating phone number:', error);
            alert('Error updating phone number.');
        } finally {
            setIsSaving(false); // Re-enable save button
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Phone number</h2>
                <input 
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                />
                <button onClick={handleSave} disabled={isSaving}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserPhone;
