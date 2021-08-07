import React from 'react'
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import './GuessIt.css'

function GuessIt() {
    return (
        <div className="guessit">
            <Link to="/">
                <div style={{ marginRight: '30px' }} className="back">
                    <ExitToAppIcon className="exit__app" />
                </div>
            </Link>
            <iframe className="embedSize" src="https://vineeth-pawar.s3.ap-south-1.amazonaws.com/GuessingGame/index.html" frameBorder="0" />
        </div>
    )
}

export default GuessIt
