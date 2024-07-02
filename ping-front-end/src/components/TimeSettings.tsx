// src/components/TimeSettings.tsx
import React, { useState } from 'react';

interface TimeSettingsProps {
  onClose: () => void;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ onClose }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    // Logic to save the time settings, e.g., making a backend call
    console.log('Time settings saved:', { startTime, endTime });
    onClose();
  };

  return (
    <div className="time-settings">
      <h2>Time Settings</h2>
      <label>
        Start Time:
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time:
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default TimeSettings;
