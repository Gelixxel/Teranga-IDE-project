import React, { useState } from 'react';
import './PopupParam.css';

interface UserPhoneProps {
    toggle: () => void;
    phone: string;
    setPhone: React.Dispatch<React.SetStateAction<string>>;
}

const UserPhone: React.FC<UserPhoneProps> = ({ toggle, phone, setPhone }) => {
    const [newPhone, setNewPhone] = useState(phone);

    const handleSave = () => {
        setPhone(newPhone);
        if (toggle) toggle();
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
                <button onClick={handleSave}>Save</button>
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
}

export default UserPhone;