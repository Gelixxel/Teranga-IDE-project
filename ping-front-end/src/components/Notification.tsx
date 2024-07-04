// Notification.tsx
import React from 'react';
import './Notification.css'; // Create a CSS file for the notification styles

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <div className="notification">
      <div className="notification-content">
        {message}
        <button onClick={onClose} className="close-button">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
