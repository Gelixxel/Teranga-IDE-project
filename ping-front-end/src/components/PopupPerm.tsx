import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import './PopupPerm.css';

interface User {
    username: string;
    role: string;
}

interface PopupPermProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupPerm: React.FC<PopupPermProps> = ({ onClosePopup, isOpen }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/allUsers2');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const promoteUser = async (username: string) => {
        try {
            const response = await axios.put('/api/promoteUser', { username });
            if (response.data.success) {
                alert('User promoted successfully');
                setUsers(users.map(user => user.username === username ? { ...user, role: 'ROLE_ADMIN' } : user));
            } else {
                alert('Failed to promote user');
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user');
        }
    };

    const demoteUser = async (username: string) => {
        try {
            const response = await axios.put('/api/demoteUser', { username });
            if (response.data.success) {
                alert('User demoted successfully');
                setUsers(users.map(user => user.username === username ? { ...user, role: 'ROLE_USER' } : user));
            } else {
                alert('Failed to demote user');
            }
        } catch (error) {
            console.error('Error demoting user:', error);
            alert('Error demoting user');
        }
    };

    return (
        <Popup
            open={isOpen}
            modal
            closeOnDocumentClick={false}
            closeOnEscape={false}
        >
            <div className="menu-container">
                <div className="menu-header">
                    <button className="back-button" onClick={onClosePopup}>◀</button>
                    <h1>User Permissions</h1>
                </div>
                <div className="user-list">
                    {users.map(user => (
                        <div key={user.username}>
                            <div className="user-row">
                                <div className="user-info">{user.username}</div>
                                <div className="user-role">{user.role}</div>
                                {user.role === 'ROLE_USER' ? (
                                    <button className="action-button" onClick={() => promoteUser(user.username)}>Promote</button>
                                ) : (
                                    <button className="action-button" onClick={() => demoteUser(user.username)}>Demote</button>
                                )}
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </Popup>
    );
}

export default PopupPerm;
