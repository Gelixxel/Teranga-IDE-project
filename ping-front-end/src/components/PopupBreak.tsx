import React from 'react';
import Popup from 'reactjs-popup';
import './PopupBreak.css';

interface PopupBreakProps {
    onClosePopup: () => void;
    isOpen: boolean;
}

const PopupBreak: React.FC<PopupBreakProps> = ({ onClosePopup, isOpen }) => {
    return (
        <Popup
            open={isOpen}
            modal
            closeOnDocumentClick={false}
            closeOnEscape={false}
        >
            <div className="menu-container">
                <div className="menu-header">
                    <button onClick={onClosePopup} className="back-button">←</button>
                    <h1>Break Parameters</h1>
                </div>
                <div className="user-list">
                    <div className="user-row">
                        <div className="user-info">JAVA_Warrior42</div>
                        <div className="user-role">Super Administrator</div>
                    </div>
                    <hr />
                    <div className="user-row">
                        <div className="user-info">Python_Monk37</div>
                        <div className="user-role">User</div>
                        <button className="action-button">Promote</button>
                    </div>
                    <hr />
                    <div className="user-row">
                        <div className="user-info">Python_Wizard51</div>
                        <div className="user-role">Admin</div>
                        <button className="action-button">Destitute</button>
                    </div>
                    <hr />
                    <div className="user-row">
                        <div className="user-info">MasterOfJava</div>
                        <div className="user-role">User</div>
                        <button className="action-button">Promote</button>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

export default PopupBreak;