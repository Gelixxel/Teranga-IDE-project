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
    const [role, setRole] = useState(''); // Add state for user role

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
                if (response.data.error) {
                    console.error('Error:', response.data.error);
                    alert('Error fetching user details: ' + response.data.error);
                    return;
                }
                const { username, email, phone } = response.data;
                setUsername(username);
                setEmail(email);
                setPhone(phone);
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Error fetching user details');
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/api/userRole');
                if (response.data.error) {
                    console.error('Error:', response.data.error);
                    alert('Error fetching user role: ' + response.data.error);
                    return;
                }
                setRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                alert('Error fetching user role');
            }
        };

        if (isOpen) {
            fetchUserDetails();
            fetchUserRole();
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
                            <div className="info-value-spaced">Username</div>
                            <button onClick={() => setIsUserNameOpen(true)} className="info-button-spaced">{username}</button>
                            {isUserNameOpen && (
                                <UserName toggle={() => setIsUserNameOpen(false)} username={username} setUsername={setUsername} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value">{role.replace("ROLE_", "")}</div> {/* Display the user role */}
                        </div>
                        <div className="info-section">
                            <div className="info-value-spaced">Email</div>
                            <button onClick={() => setIsUserEmailOpen(true)} className="info-button-spaced">{email}</button>
                            {isUserEmailOpen && (
                                <UserEmail toggle={() => setIsUserEmailOpen(false)} email={email} setEmail={setEmail} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-value-spaced">Phone number</div>
                            <button onClick={() => setIsUserPhoneOpen(true)} className="info-button-spaced">{phone}</button>
                            {isUserPhoneOpen && (
                                <UserPhone toggle={() => setIsUserPhoneOpen(false)} phone={phone} setPhone={setPhone} />
                            )}
                        </div>
                        <div className="info-section">
                            <div className="info-button">Notifications</div>
                        </div>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                    <div className="right-column">
                        <h2>Administration</h2>
                        <button onClick={openBreakPopup} className="option-button">Break parameters</button>
                        <button onClick={openPermPopup} className="option-button">Change permissions</button>
                        <h2>Other</h2>
                        <button className="option-button">Documentation</button>
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
