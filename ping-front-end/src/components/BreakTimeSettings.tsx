import React, { useState } from 'react';
import axios from 'axios';

const BreakTimeSettings: React.FC = () => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/setBreakTime', {
        startTime,
        endTime,
      });
      if (response.data.success) {
        alert('Break time settings saved successfully');
      } else {
        alert('Failed to save break time settings');
      }
    } catch (error) {
      console.error('Error saving break time settings:', error);
      alert('Error saving break time settings');
    }
  };

  return (
    <div>
      <h3>Set Global Break Time</h3>
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
    </div>
  );
};

export default BreakTimeSettings;
