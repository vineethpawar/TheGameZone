import React from 'react'
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import './RockPaper.css'

function RockPaper() {
    return (
        <div className="rockpaper">
            <Link to="/">
                <div className="back">
                    <ExitToAppIcon className="exit__app exit__dark" />
                </div>
            </Link>
            <iframe className="embedSize" src="https://vineeth-pawar.s3.ap-south-1.amazonaws.com/Rock-Paper-Scissor/index.html" frameBorder="0" />
        </div>
    )
}

export default RockPaper
