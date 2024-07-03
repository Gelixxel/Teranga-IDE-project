import React, { useState } from 'react';
import './PopupParam.css';

interface UserEmailProps {
    toggle: () => void;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const UserEmail: React.FC<UserEmailProps> = ({ toggle, email, setEmail }) => {
    const [newEmail, setNewEmail] = useState(email);

    const handleSave = () => {
        setEmail(newEmail);
        if (toggle) toggle();
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Email</h2>
                <input 
                    type="text"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserEmail;