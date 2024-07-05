import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sound from 'react-sound';
import breakMusic from '../music/beach_vacay.mp3';

const BreakPage: React.FC = () => {
  const navigate = useNavigate();
  const [breakEnded, setBreakEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const audio = new Audio(breakMusic);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const response = await axios.get("/api/getBreakTime");
        const { startTime, endTime } = response.data;
        setEndTime(endTime);
        const now = new Date();
        const newTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setCurrentTime(newTime);
      } catch (error) {
        console.error("Error fetching break time:", error);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const checkBreakStatus = async () => {
    try {
      const response = await axios.get("/api/getBreakTime");
      const { startTime, endTime } = response.data;
      setEndTime(endTime);
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      console.log("currentTime: %s | startTime: %s | endTime: %s", currentTime, startTime, endTime);
      if (currentTime >= startTime && currentTime <= endTime) {
        console.log("break still going")
        setBreakEnded(false);
        if (!isPlaying) {
          audio.play();
          setIsPlaying(true);
        }
      } else {
        console.log("break not going anymore")
        setBreakEnded(true);
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error fetching break time:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkBreakStatus, 500); // Check every .5 seconds
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
      <h2>{currentTime}</h2>
      <h1>Break Time</h1>
      <p>Teranga is currently unavailable. Please come back after the break time.</p>
      <p>End of the break: {endTime}</p>
      {breakEnded && <p>Press any key to resume</p>}
      {!isPlaying && (
        <Sound
          url="../music/beach_vacay.mp3"
          playStatus="PLAYING"
          loop={true}
        />
      )}
    </div>
  );
};

export default BreakPage;
