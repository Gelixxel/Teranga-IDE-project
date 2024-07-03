import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BreakPage: React.FC = () => {
  const navigate = useNavigate();
  const [breakEnded, setBreakEnded] = useState(false);

  const checkBreakStatus = async () => {
    try {
      const response = await axios.get("/api/getBreakTime");
      const { startTime, endTime } = response.data;
      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes()}`;
      if (currentTime < startTime || currentTime > endTime) {
        setBreakEnded(true);
      } else {
        setBreakEnded(false);
      }
    } catch (error) {
      console.error("Error fetching break time:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkBreakStatus, 60000); // Check every 60 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const handleKeyPress = () => {
      if (breakEnded) {
        navigate("/editor");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [breakEnded, navigate]);

  return (
    <div>
      <h1>Break Time</h1>
      <p>The IDE is currently unavailable. Please come back after the break time.</p>
      {breakEnded && <p>Press any key to resume</p>}
    </div>
  );
};

export default BreakPage;
