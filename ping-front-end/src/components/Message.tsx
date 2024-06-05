import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Message: React.FC = () => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        axios.get('/api/message')
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.error('Error fetching the message:', error);
            });
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default Message;
