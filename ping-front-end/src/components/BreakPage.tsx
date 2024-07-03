import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BreakPage: React.FC = () => {
  const [breakOver, setBreakOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBreakTime = async () => {
      try {
        const response = await fetch('/api/getBreakTime');
        const { startTime, endTime } = await response.json();
        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes()}`;
        if (currentTime < startTime || currentTime > endTime) {
          setBreakOver(true);
        }
      } catch (error) {
        console.error('Error fetching break time:', error);
      }
    };

    checkBreakTime();
  }, []);

  useEffect(() => {
    if (breakOver) {
      const handleKeyPress = () => {
        navigate('/editor');
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [breakOver, navigate]);

  return (
    <div>
      <h1>Break Time</h1>
      {breakOver ? (
        <p>Press a key to resume your work.</p>
      ) : (
        <p>The IDE is currently unavailable. Please come back after the break time.</p>
      )}
    </div>
  );
};

export default BreakPage;
