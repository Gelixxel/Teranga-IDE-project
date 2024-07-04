import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import './PopupBreak.css';

interface PopupBreakProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupBreak: React.FC<PopupBreakProps> = ({ onClosePopup, isOpen }) => {
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    useEffect(() => {
        const fetchBreakTimes = async () => {
            try {
                const response = await axios.get('/api/getBreakTime');
                setStartTime(response.data.startTime);
                setEndTime(response.data.endTime);
            } catch (error) {
                console.error('Error fetching break times:', error);
            }
        };

        if (isOpen) {
            fetchBreakTimes();
        }
    }, [isOpen]);

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
        <Popup
            open={isOpen}
            modal
            closeOnDocumentClick={false}
            closeOnEscape={false}
        >
            <div className="popup-inner">
                <div className="popup-header">
                    <button className="back-button" onClick={onClosePopup}>←</button>
                    <h1>Break parameters</h1>
                </div>
                <div className="global-break-settings">
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
                </div>
                <button onClick={handleSave} className="save-button">Save</button>
            </div>
        </Popup>
    );
}

export default PopupBreak;
