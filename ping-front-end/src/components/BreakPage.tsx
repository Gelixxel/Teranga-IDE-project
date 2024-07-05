import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sound from 'react-sound';

// MUSIQUES
import breakMusic from '../music/Beach Vacay.mp3'
import breakMusic2 from '../music/Coda - Tires On Fire.mp3';
import breakMusic3 from '../music/Initial D - Deja Vu.mp3';
import breakMusic4 from '../music/Initial D - Running in The 90s.mp3';
import breakMusic5 from '../music/Kevin Grim - Prince Sidon [Remix].mp3';
import breakMusic6 from '../music/Manuel - Gas Gas Gas.mp3';
import breakMusic7 from '../music/Nintendo - Prince Sidon.mp3';
import breakMusic8 from '../music/Persona 4 - Specialist.mp3';
import breakMusic9 from '../music/Qumu - Prince Sidon [Remix].mp3';
import breakMusic10 from '../music/Rick Astley - Never Gonna Give You Up.mp3';
import breakMusic11 from '../music/Sonic Colors - Reach for the Stars.mp3';
import breakMusic12 from '../music/Undertale - Megalovania.mp3';
// Importer ici d'autres musiques


import musicLogo from '../assets/music-icon.png';
import "./BreakPage.css";

const BreakPage: React.FC = () => {
  const playlist = [breakMusic, breakMusic2, breakMusic3, breakMusic4, breakMusic5, breakMusic6, breakMusic7, breakMusic8
    , breakMusic9, breakMusic10, breakMusic11, breakMusic12]; // Ajouter les audio files ici
  const songTitles = ['Beach Vacay', 'Coda - Tires On Fire', 'Initial D - Deja Vu', 'Initial D - Running in The 90s', 'Kevin Grim - Prince Sidon [Remix]'
    , 'Manuel - Gas Gas Gas', 'Nintendo - Prince Sidon', 'Persona 4 - Specialist', 'Qumu - Prince Sidon [Remix]', 'Rick Astley - Never Gonna Give You Up'
    , 'Sonic Colors - Reach for the Stars', 'Undertale - Megalovania']; // Ajouter les titres correspondants là

  const navigate = useNavigate();
  const [breakEnded, setBreakEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentSongIndex, setCurrentSongIndex] = useState(Math.floor(Math.random() * playlist.length));

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
        setIsPlaying(true);
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
    const intervalId = setInterval(checkBreakStatus, 1000); // Check toutes les .5 secondes
    return () => clearInterval(intervalId);
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
