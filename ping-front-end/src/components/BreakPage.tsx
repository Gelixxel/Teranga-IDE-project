import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sound from 'react-sound';
import breakMusic from '../music/beach_vacay.mp3';
import breakMusic2 from '../music/Rick Astley - Never Gonna Give You Up (Official Music Video).mp3';
import breakMusic3 from '../music/undertale-megalovania.mp3';
// importer d'autres musiques ici
import musicLogo from '../assets/music-icon.png';
import "./BreakPage.css";

const BreakPage: React.FC = () => {
  const navigate = useNavigate();
  const [breakEnded, setBreakEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const playlist = [breakMusic, breakMusic2, breakMusic3]; // ajouter les audio files ici
  const songTitles = ['Beach Vacay', 'Rick Astley - Never Gonna Give You Up', 'Undertale - Megalovania']; // et leur titre correspondant ici

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
        console.log("break still going");
        setBreakEnded(false);
        if (!isPlaying) {
          setIsPlaying(true);
        }
      } else {
        console.log("break not going anymore");
        setBreakEnded(true);
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

  const handleSongFinishedPlaying = () => {
    console.log("Song finished, moving to next song");
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  return (
    <div className="break-page">
      <div className="timer">{currentTime}</div>
      <h1 className="break-title">Break Time !</h1>
      {breakEnded && <p className="resume-message">Press any key to resume</p>}
      <p className="break-message">Teranga is currently unavailable. Please come back after the break time.</p>
      <p className="end-time">End of the break: {endTime}</p>
      {isPlaying && (
        <Sound
          url={playlist[currentSongIndex]}
          playStatus='PLAYING'
          onFinishedPlaying={handleSongFinishedPlaying}
        />
      )}
      <div className="music-info">
        <img src={musicLogo} alt="Music icon"/>
        <p>{songTitles[currentSongIndex]}</p>
      </div>
    </div>
  );
};

export default BreakPage;
