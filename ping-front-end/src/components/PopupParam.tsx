import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './PopupParam.css';
import PopupPerm from './PopupPerm';
import PopupBreak from './PopupBreak';
import UserName from './Username';
import UserEmail from './UserEmail';
import UserPhone from './UserPhone';

interface PopupParamProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupParam: React.FC<PopupParamProps> = ({ onClosePopup, isOpen }) => {
    const [isPermOpen, setIsPermOpen] = useState(false);
    const [isBreakOpen, setIsBreakOpen] = useState(false);
    const [seen, setSeen] = useState(false)
    const [isUserNameOpen, setIsUserNameOpen] = useState(false);
    const [isUserEmailOpen, setIsUserEmailOpen] = useState(false);
    const [isUserPhoneOpen, setIsUserPhoneOpen] = useState(false);
    const [username, setUsername] = useState('JAVArcanist'); // Initial username
    const [email, setEmail] = useState('terribleCoder@epita.fr');
    const [phone, setPhone] = useState('09 99 88 77 66');


    /*function togglePop() {
        setSeen(!seen);
    };*/

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
            open={isOpen}
            modal
            closeOnDocumentClick={false}
            closeOnEscape={false}
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
                            <button onClick={() => setIsUserNameOpen(true)} className="info-button">{username}</button>
                            {isUserNameOpen && (
                                <UserName toggle={() => setIsUserNameOpen(false)} username={username} setUsername={setUsername} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Super Admin Account</div>

                        </div>
                        <div className="info-section">
                            <div className="info-value">Email</div>
                            <button onClick={() => setIsUserEmailOpen(true)} className="info-button">{email}</button>
                            {isUserEmailOpen && (
                                <UserEmail toggle={() => setIsUserEmailOpen(false)} email={email} setEmail={setEmail} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Phone number</div>
                            <button onClick={() => setIsUserPhoneOpen(true)} className="info-button">{phone}</button>
                            {isUserPhoneOpen && (
                                <UserPhone toggle={() => setIsUserPhoneOpen(false)} phone={phone} setPhone={setPhone} />
                            )}
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
                        <button onClick={openBreakPopup} className="option-button">Break parameters</button>
                        <button onClick={openPermPopup} className="option-button">Change permissions</button>
                        <button className="option-button">Name and logo of the IDE</button>
                    </div>
                </div>
                <PopupBreak
                    onClosePopup={closeBreakPopup}
                    isOpen={isBreakOpen}
                />
                <PopupPerm
                    onClosePopup={closePermPopup}
                    isOpen={isPermOpen}
                />
            </div>
        </Popup>
    );
}

export default PopupParam;
