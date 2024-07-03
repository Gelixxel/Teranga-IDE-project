import React, { useState } from 'react';
import axios from 'axios';

interface TimeSettingsProps {
  userId: string;
  onClose: () => void;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ userId, onClose }) => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/setAccessTime', {
        userId,
        startTime,
        endTime,
      });
      if (response.data.success) {
        alert('Time settings saved successfully');
        onClose(); // Close the modal after saving
      } else {
        alert('Failed to save time settings');
      }
    } catch (error) {
      console.error('Error saving time settings:', error);
      alert('Error saving time settings');
    }
  };

  return (
    <div>
      <h3>Set Access Time for User</h3>
      <div>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TimeSettings;
