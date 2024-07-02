import React, { useState } from 'react';
import './PasswordModal.css';

interface PasswordModalProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
          autoFocus
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="btn">Submit</button>
          <button onClick={onClose} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
