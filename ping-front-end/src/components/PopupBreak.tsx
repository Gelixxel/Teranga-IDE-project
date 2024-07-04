import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';
import './PopupBreak.css';

interface PopupBreakProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

interface PlannedBreak {
    startTime: string;
    endTime: string;
}

const PopupBreak: React.FC<PopupBreakProps> = ({ onClosePopup, isOpen }) => {
    const [plannedBreaks, setPlannedBreaks] = useState<PlannedBreak[]>([
        { startTime: '12:00', endTime: '13:00' },
        { startTime: '19:00', endTime: '20:00' }
    ]);

    useEffect(() => {
        const fetchBreakTimes = async () => {
            try {
                const response = await axios.get('/api/getBreakTimes');
                setPlannedBreaks(response.data.map((breakTime: { startTime: string; endTime: string }) => ({
                    startTime: breakTime.startTime,
                    endTime: breakTime.endTime
                })));
            } catch (error) {
                console.error('Error fetching break times:', error);
            }
        };

        if (isOpen) {
            fetchBreakTimes();
        }
    }, [isOpen]);

    const addPlannedBreak = () => {
        setPlannedBreaks([...plannedBreaks, { startTime: '', endTime: '' }]);
    };

    const deletePlannedBreak = (index: number) => {
        const newPlannedBreaks = plannedBreaks.filter((_, i) => i !== index);
        setPlannedBreaks(newPlannedBreaks);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('/api/setBreakTimes', plannedBreaks);
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

    const handleInputChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newPlannedBreaks = [...plannedBreaks];
        newPlannedBreaks[index][field] = value;
        setPlannedBreaks(newPlannedBreaks);
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
                <div className="planned-breaks">
                    <h2>Planned Breaks</h2>
                    {plannedBreaks.map((breakItem, index) => (
                        <div className="planned-break" key={index}>
                            <label>Beginning</label>
                            <input
                                type="time"
                                value={breakItem.startTime}
                                onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                            />
                            <label>End</label>
                            <input
                                type="time"
                                value={breakItem.endTime}
                                onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
                            />
                            <button onClick={() => deletePlannedBreak(index)} className="delete-button">🗑️</button>
                        </div>
                    ))}
                    <button onClick={addPlannedBreak} className="add-button">+</button>
                </div>
                <button onClick={handleSave} className="save-button">Save</button>
            </div>
        </Popup>
    );
}

export default PopupBreak;
