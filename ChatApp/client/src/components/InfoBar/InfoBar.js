import React from 'react';

import closeIcon from '../../assets/closeIcon.png';
import onlineIcon from '../../assets/onlineIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => {
    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <img className="onlineIcon" src={onlineIcon} alt="online" />
                <h3>{room}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href="/"><img src={closeIcon} alt="close" ></img></a>
            </div>
        </div>
    );
}

export default InfoBar;