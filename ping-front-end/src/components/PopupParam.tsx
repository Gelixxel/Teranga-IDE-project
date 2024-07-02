import React from 'react';
import Popup from 'reactjs-popup';
import './PopupParam.css';

interface PopupParamProps {
    onClosePopup: () => void;
    trigger: JSX.Element; 
}

const PopupParam: React.FC<PopupParamProps> = ({ onClosePopup, trigger}) => {
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
                            <button className="info-button">User name</button>
                            <div className="info-value">JAVArcanist</div>
                        </div>
                        <div className="info-section">
                            <button className="info-button">Super Admin Account</button>
                        </div>
                        <div className="info-section">
                            <button className="info-button">Email</button>
                            <div className="info-value">terribleCoder@epita.fr</div>
                        </div>
                        <div className="info-section">
                            <button className="info-button">Phone number</button>
                            <div className="info-value">09 99 88 77 66</div>
                        </div>
                        <button className="logout-button">Disconnect</button>
                    </div>
                    <div className="right-column">
                        <h2>customization</h2>
                        <button className="option-button">Background and theme</button>
                        <button className="option-button">Fonts and Emojis</button>
                        <h2>Other</h2>
                        <button className="option-button">Documentation</button>
                        <h2>Administration</h2>
                        <button className="option-button">Break parameters</button>
                        <button className="option-button">Change permissions</button>
                        <button className="option-button">Name and logo of the IDE</button>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

export default PopupParam;
