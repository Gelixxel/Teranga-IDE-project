import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './PopupParam.css';
import PopupPerm from './PopupPerm';
import PopupBreak from './PopupBreak';
import UserName from './Username';

interface PopupParamProps {
    onClosePopup: () => void;
    trigger: JSX.Element;
}

const PopupParam: React.FC<PopupParamProps> = ({ onClosePopup, trigger }) => {
    const [isPermOpen, setIsPermOpen] = useState(false);
    const [isBreakOpen, setIsBreakOpen] = useState(false);
    const [seen, setSeen] = useState(false)
    const [username, setUsername] = useState('JAVArcanist'); // Initial username

    function togglePop() {
        setSeen(!seen);
    };

    const openPermPopup = () => {
        setIsPermOpen(true);
    };
    const closePermPopup = () => {
        setIsPermOpen(false);
    };
    const openBreakPopup = () => {
        setIsBreakOpen(true);
    };
    const closeBreakPopup = () => {
        setIsBreakOpen(false);
    };

    return (
        <Popup
            trigger={trigger}
            modal
            closeOnDocumentClick
            onClose={onClosePopup}
        >
            <div className="popup">
                <div className="popup-header">
                    <button className="back-button" onClick={onClosePopup}>←</button>
                    <h1>Parameters</h1>
                </div>
                <div className="popup-content">
                    <div className="left-column">
                        <h2>Account parameters</h2>
                        <div className="profile-section">
                            <img src="user-icon.png" alt="User Icon" className="profile-pic" />
                            <button className="edit-button">✎</button>
                        </div>
                        <div className="info-section">
                            <div className="info-value">User name</div>
                            <button onClick={togglePop} className="info-button">{username}</button>
                            {seen ? <UserName toggle={togglePop} username={username} setUsername={setUsername}/> : null}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Super Admin Account</div>

                        </div>
                        <div className="info-section">
                            <div className="info-value">Email</div>
                            <button className="info-button">terribleCoder@epita.fr</button>
                        </div>
                        <div className="info-section">
                            <div className="info-value">Phone number</div>
                            <button className="info-button">09 99 88 77 66</button>
                        </div>
                        <button className="logout-button">Disconnect</button>
                    </div>
                    <div className="right-column">
                        <h2>Customization</h2>
                        <button className="option-button">Background and theme</button>
                        <button className="option-button">Fonts and Emojis</button>
                        <h2>Other</h2>
                        <button className="option-button">Documentation</button>
                        <h2>Administration</h2>
                        <PopupBreak
                            onClosePopup={closeBreakPopup}
                            trigger={<button onClick={openBreakPopup} className="option-button">Break parameters</button>}
                        />
                        <PopupPerm
                            onClosePopup={closePermPopup}
                            trigger={<button onClick={openPermPopup} className="option-button">Change permissions</button>}
                        />
                        <button className="option-button">Name and logo of the IDE</button>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

export default PopupParam;
