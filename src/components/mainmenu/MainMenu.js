import React from 'react'
import './MainMenu.css'
import { Link } from 'react-router-dom'
function MainMenu() {
    return (
        <div className="main__menu">
            <div className="overlay"></div>
            <div className="top__strip">
                <span>
                    Total Players:
                </span>
                <span>
                    N/A
                </span>
            </div>
            <div className="heading">
                <h1>Welcome to <span className="head__highlight">
                    The Game Zone
                </span>
                    !!
                    <img className="joystick" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628351421/TGZ/joystick_xmykpl.gif" alt="" />
                </h1>
            </div>

            <div className="game__list">

                <div className="game__item">
                    <div className="game__item__img">
                        <img src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628348172/TGZ/wordgame_nejust.png" alt="" />
                    </div>
                    <div className="game__item__content">
                        <span className="name">The Word Game</span>
                        <span className="play">
                            <Link to="/wordgame">
                                <button>Let's play</button>
                            </Link>
                        </span>
                    </div>
                </div>


                <div className="game__item">
                    <div className="game__item__img">
                        <img src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628351210/TGZ/rock_paper_thumbnail_cxyuaw.png" alt="" />
                    </div>
                    <div className="game__item__content">
                        <span className="name">Rock Paper Scissors</span>
                        <span className="play">
                            <Link to="/rock-paper-scissors">
                                <button>Let's play</button>
                            </Link>
                        </span>
                    </div>
                </div>


                <div className="game__item">
                    <div className="game__item__img">
                        <img src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628351906/TGZ/guessit_thumbnail_bvxs8w.jpg" alt="" />
                    </div>
                    <div className="game__item__content">
                        <span className="name">Guess It</span>
                        <span className="play">
                            <Link to="/guess-it">
                                <button>Let's play</button>
                            </Link>
                        </span>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default MainMenu
