import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import './PopupParam.css';
import PopupPerm from './PopupPerm';
import PopupBreak from './PopupBreak';
import UserName from './Username';
import UserEmail from './UserEmail';
import UserPhone from './UserPhone';
import axios from 'axios';

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

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

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

    const logout = async () => {
        try {
          await axios.post("/api/logout");
          window.location.href = "/login";
        } catch (error) {
          console.error("Error logging out:", error);
          alert("Error logging out: " + error);
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('/api/userDetails');
                const { username, email, phone } = response.data;
                setUsername(username);
                setEmail(email);
                setPhone(phone);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (isOpen) {
            fetchUserDetails();
        }
    }, [isOpen]);

    const updateUserDetails = async () => {
        try {
            await axios.put('/api/updateUserDetails', {
                username,
                email,
                phone
            });
            alert('User details updated successfully!');
        } catch (error) {
            console.error('Error updating user details:', error);
            alert('Error updating user details');
        }
    };

    return (
        <Popup open={isOpen} modal closeOnDocumentClick={false} closeOnEscape={false}>
            <div className="popup">
                <div className="popup-header">
                    <button className="back-button" onClick={onClosePopup}>◀</button>
                    <h1>Paramètres</h1>
                </div>
                <div className="popup-content">
                    <div className="left-column">
                        <h2>Paramètres du compte</h2>
                        <div className="profile-section">
                            <img src="user-icon.png" alt="User Icon" className="profile-pic" />
                            <button className="edit-button" onClick={updateUserDetails}>✎</button>
                        </div>
                        <div className="info-section">
                            <div className="info-value-spaced">Nom d'utilisateur</div>
                            <button onClick={() => setIsUserNameOpen(true)} className="info-button-spaced">{username}</button>
                            {isUserNameOpen && (
                                <UserName toggle={() => setIsUserNameOpen(false)} username={username} setUsername={setUsername} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">Compte Super Administrateur</div>
                        </div>
                        <div className="info-section">
                            <div className="info-value-spaced">Email</div>
                            <button onClick={() => setIsUserEmailOpen(true)} className="info-button-spaced">{email}</button>
                            {isUserEmailOpen && (
                                <UserEmail toggle={() => setIsUserEmailOpen(false)} email={email} setEmail={setEmail} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value-spaced">Téléphone</div>
                            <button onClick={() => setIsUserPhoneOpen(true)} className="info-button-spaced">{phone}</button>
                            {isUserPhoneOpen && (
                                <UserPhone toggle={() => setIsUserPhoneOpen(false)} phone={phone} setPhone={setPhone} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-button">Notifications</div>
                        </div>
                        <button onClick={logout} className="logout-button">Se déconnecter</button>
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
