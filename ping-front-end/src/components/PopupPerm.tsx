import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';

interface PopupPermProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupPerm: React.FC<PopupPermProps> = ({ onClosePopup, isOpen }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/allUsers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const promoteUser = async () => {
        try {
            const response = await axios.put('/api/promoteUser', { username: selectedUser });
            if (response.data.success) {
                alert('User promoted successfully');
                // Optionally refetch users
            } else {
                alert('Failed to promote user');
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user');
        }
    };

    const demoteUser = async () => {
        try {
            const response = await axios.put('/api/demoteUser', { username: selectedUser });
            if (response.data.success) {
                alert('User demoted successfully');
                // Optionally refetch users
            } else {
                alert('Failed to demote user');
            }
        } catch (error) {
            console.error('Error demoting user:', error);
            alert('Error demoting user');
        }
    };

    return (
        <Popup open={isOpen} onClose={onClosePopup} modal closeOnDocumentClick>
            <div>
                <h1>User Management</h1>
                <select onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.username} value={user.username}>{user.username}</option>
                    ))}
                </select>
                <button onClick={promoteUser}>Promote to Admin</button>
                <button onClick={demoteUser}>Demote to User</button>
            </div>
        </Popup>
    );
};

export default PopupPerm;
