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
    const [isUserNameOpen, setIsUserNameOpen] = useState(false);
    const [isUserEmailOpen, setIsUserEmailOpen] = useState(false);
    const [isUserPhoneOpen, setIsUserPhoneOpen] = useState(false);

    const [username, setUsername] = useState('JAVArcanist'); // Initial username
    const [email, setEmail] = useState('terribleCoder@epita.fr');
    const [phone, setPhone] = useState('09 99 88 77 66');

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
        <Popup open={isOpen} modal closeOnDocumentClick={false} closeOnEscape={false}>
            <div className="popup">
                <div className="popup-header">
                    <button className="back-button" onClick={onClosePopup}>&lt;</button>
                    <h1>Paramètres</h1>
                </div>
                <div className="popup-content">
                    <div className="left-column">
                        <h2>Paramètres du compte</h2>
                        <div className="profile-section">
                            <img src="user-icon.png" alt="User Icon" className="profile-pic" />
                            <button className="edit-button">✎</button>
                        </div>
                        <div className="info-section">
                            <div className="info-value">Nom d'utilisateur</div>
                            <button onClick={() => setIsUserNameOpen(true)} className="info-button">{username}</button>
                            {isUserNameOpen && (
                                <UserName toggle={() => setIsUserNameOpen(false)} username={username} setUsername={setUsername} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Compte Super Administrateur</div>
                        </div>
                        <div className="info-section">
                            <div className="info-value">Email</div>
                            <button onClick={() => setIsUserEmailOpen(true)} className="info-button">{email}</button>
                            {isUserEmailOpen && (
                                <UserEmail toggle={() => setIsUserEmailOpen(false)} email={email} setEmail={setEmail} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Téléphone</div>
                            <button onClick={() => setIsUserPhoneOpen(true)} className="info-button">{phone}</button>
                            {isUserPhoneOpen && (
                                <UserPhone toggle={() => setIsUserPhoneOpen(false)} phone={phone} setPhone={setPhone} />
                            )}
                        </div>
                        <button className="logout-button">se déconnecter</button>
                    </div>
                    <div className="right-column">
                        <h2>Personnalisation</h2>
                        <button className="option-button">Fond d'écran et thème</button>
                        <button className="option-button">Polices et Emojis</button>
                        <h2>Autre</h2>
                        <button className="option-button">Documentation</button>
                        <h2>Administration</h2>
                        <button onClick={openBreakPopup} className="option-button">Paramètres de la pause</button>
                        <button onClick={openPermPopup} className="option-button">Changer les permissions</button>
                        <button className="option-button">Nom et Logo de l'IDE</button>
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
