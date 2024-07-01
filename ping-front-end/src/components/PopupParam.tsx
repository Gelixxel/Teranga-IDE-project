import React from 'react';

interface PopupParamProps {
    onClosePopup: () => void;
}

const PopupParam: React.FC<PopupParamProps> = ({ onClosePopup }) => {
    return (
        <div className="popup">
            <h1>Parameters</h1>
            <button onClick={onClosePopup}>
                Close
            </button>
        </div>
    );
}

export default PopupParam;
