import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './PopupBreak.css';

interface PopupBreakProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupBreak: React.FC<PopupBreakProps> = ({ onClosePopup, isOpen }) => {
    const [cyclicBreak, setCyclicBreak] = useState(false);
    const [maxOutOfBreakTime, setMaxOutOfBreakTime] = useState(4);
    const [breakDuration, setBreakDuration] = useState(1);
    const [plannedBreaks, setPlannedBreaks] = useState([
        { start: '12:00', end: '13:00', duration: '1h' },
        { start: '19:00', end: '20:00', duration: '1h' }
    ]);

    const addPlannedBreak = () => {
        setPlannedBreaks([...plannedBreaks, { start: '', end: '', duration: '1h' }]);
    };

    const deletePlannedBreak = (index: number) => {
        const newPlannedBreaks = plannedBreaks.filter((_, i) => i !== index);
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
                {/* <div className="cyclic-break">
                    <div className="toggle-container">
                        <input
                            type="checkbox"
                            checked={cyclicBreak}
                            onChange={() => setCyclicBreak(!cyclicBreak)}
                        />
                        <h2>Cyclic Break</h2>
                    </div>
                    {cyclicBreak && (
                        <div className="cyclic-options">
                            <div className="option">
                                <label>Max out of break time</label>
                                <input
                                    type="number"
                                    value={maxOutOfBreakTime}
                                    onChange={e => setMaxOutOfBreakTime(parseInt(e.target.value))}
                                />
                                <span>h</span>
                            </div>
                            <div className="option">
                                <label>Break duration</label>
                                <input
                                    type="number"
                                    value={breakDuration}
                                    onChange={e => setBreakDuration(parseInt(e.target.value))}
                                />
                                <span>h</span>
                            </div>
                        </div>
                    )}
                </div> */}
                <div className="planned-breaks">
                    <h2>Planned Breaks</h2>
                    {plannedBreaks.map((breakItem, index) => (
                        <div className="planned-break" key={index}>
                            <label>Beginning</label>
                            <input type="time" value={breakItem.start} />
                            <label>End</label>
                            <input type="time" value={breakItem.end} />
                            <label>Duration</label>
                            <input type="text" value={breakItem.duration} readOnly />
                            <button onClick={() => deletePlannedBreak(index)} className="delete-button">🗑️</button>
                        </div>
                    ))}
                    <button onClick={addPlannedBreak} className="add-button">+</button>
                </div>
            </div>
        </Popup >
    );
}

export default PopupBreak;