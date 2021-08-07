import React, { useState, useEffect, useRef } from 'react'
import { useCountdownTimer } from 'use-countdown-timer';
import randomWords from 'random-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Swal from 'sweetalert2'
import './WordGame.css'
import { Link } from 'react-router-dom';

var gameOn = true;
var firstPart = true;
var timePerPlayer = 5;
var letterLimit = 2;
var computerSmartness = 1500;
var tryLimit = 200;
var playerHearts = 3;
var totalHearts = 3;
var cpuHearts = 3;
var next;


function WordGame({ noOfLetters = 2, life = 3, allowedTime = 5, easyMode = true }) {

    useEffect(() => {
        gameOn = true;
        firstPart = easyMode;
        timePerPlayer = allowedTime;
        letterLimit = noOfLetters;
        computerSmartness = 1500;
        tryLimit = 200;
        playerHearts = life;
        totalHearts = life;
        cpuHearts = life;

        inputRef.current.focus();
        pause()
        setRandomWord(randomWords())
    }, [])


    const inputRef = useRef();
    const { countdown, start, reset, pause } = useCountdownTimer({
        timer: 1000 * timePerPlayer, autostart: true, onExpire: () => {
            throwError('Time expired');
            playerHearts -= 1;
            checkLife();
            if (playerHearts > 0) {
                resetTimer();
                setActivePlayer(1)
                next = randomWords()
                setRandomWord(next)

                setInputText('');

                setTimeout(() => {
                    computerThought(firstPart === true ? next.slice(0, letterLimit) : next.slice(-letterLimit), 1, computerGenerated);
                }, computerSmartness);
            }
        },
        expireImmediate: false
    });


    const checkLife = () => {


        if (playerHearts === 0) {
            gameOn = false;
            pause();
            setInputText('Loser')
            setComputerGenerated('Winner')
            setPlayerImage('https://res.cloudinary.com/dpjkblzgf/image/upload/v1628336117/sadperson_j6ec1b.gif')
            setCpuImage('https://res.cloudinary.com/dpjkblzgf/image/upload/v1628336120/happyrobot_bofksx.gif')
            Swal.fire('You Lost').then(() => window.location.reload())
        }
        else if (cpuHearts === 0) {
            gameOn = false;
            pause();
            setInputText('Winner')
            setComputerGenerated('Loser')
            setPlayerImage('https://res.cloudinary.com/dpjkblzgf/image/upload/v1628336119/happyperson_douuil.gif')
            setCpuImage('https://res.cloudinary.com/dpjkblzgf/image/upload/v1628336116/sadrobot_fw50by.gif')
            Swal.fire('You Won').then(() => window.location.reload())
        }
    }
    const [playerImage, setPlayerImage] = useState("https://res.cloudinary.com/dpjkblzgf/image/upload/v1628277374/person_f2pneg.png")
    const [cpuImage, setCpuImage] = useState("https://res.cloudinary.com/dpjkblzgf/image/upload/v1628278268/robot_hp6q1q.png")
    const [inputText, setInputText] = useState('');
    const [randomWord, setRandomWord] = useState('');
    const [computerGenerated, setComputerGenerated] = useState('')
    const [activePlayer, setActivePlayer] = useState(0)



    const resetTimer = () => {
        reset();
        start();
    }

    const switch2User = () => {
        setTimeout(() => {
            setActivePlayer(0)
            setRandomWord(randomWords())
            setComputerGenerated('')
            resetTimer()
        }, 500);
    }

    const throwError = (arg) => {
        toast.error(arg, {
            position: "top-center",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }

    const displayHearts = (playerHearts, totalHearts) => {
        let hearts = [];
        for (let x = 0; x < playerHearts; x++)
            hearts.push(<FavoriteIcon className="hearts__icn" />)
        for (let x = playerHearts; x < totalHearts; x++)
            hearts.push(<FavoriteBorderIcon className="hearts__icn" />)
        return hearts;
    }

    const computerThought = (phrase, tries, current) => {
        start();
        if (tries < tryLimit) {
            if (!current.includes(phrase)) {
                let temp = randomWords()
                setComputerGenerated(temp)

                if (!temp.includes(phrase))
                    computerThought(phrase, tries + 1, temp);
                else {
                    switch2User();
                }
            } else {
                switch2User();
            }

        } else {
            setComputerGenerated('Failed !!')
            cpuHearts -= 1;
            checkLife();
            if (cpuHearts > 0) {
                setTimeout(() => {
                    setActivePlayer(0)
                    setRandomWord(randomWords())
                    setComputerGenerated('')
                    resetTimer()
                }, 1500);
            } else {
                pause();
            }

        }
    }
    const submitHandler = (e) => {
        e.preventDefault();

        if (inputText.includes(firstPart === true ? randomWord.slice(0, letterLimit) : randomWord.slice(-letterLimit))) {

            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${inputText}`)
                .then((response) => {
                  
                    if (response.status === 200) {
                        resetTimer();
                        setActivePlayer(1)
                        next = randomWords()
                        setRandomWord(next)
                        setInputText('');
                        setTimeout(() => {
                            computerThought(firstPart === true ? next.slice(0, letterLimit) : next.slice(-letterLimit), 1, computerGenerated);
                        }, computerSmartness);

                    }
                    else {
                        throwError('Not a dictionary word!!');
                        setInputText('');
                        playerHearts -= 1;
                        checkLife();
                    }

                })

        } else {
            throwError('Does not contain keyword');
            setInputText('');
            playerHearts -= 1;
            checkLife();
        }

    }
    return (
        <div className="game__wrapper">
            <Link to="/">
                <div className="back"><ExitToAppIcon className="exit__app" /> </div>
            </Link>
            <div className="compass">
                <img className={activePlayer === 0 ? "compass__img" : "compass__img rotate__right"} alt="compass" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628314946/compass_rokfyq_xcxdk1.png" />
                <span>{firstPart === true ? randomWord.slice(0, letterLimit) : randomWord.slice(-letterLimit)}</span>
            </div>


            <div className="game">
                <div className={activePlayer === 0 ? "leftScreen active" : "leftScreen"}>
                    <h1 className="turn">Your turn </h1>
                    <img className="profile__pic" src={playerImage} alt="user profile" />
                    <div className="centeredContent">
                        <span>
                            {inputText.length > 0 ?
                                <h1 className="guess">{inputText}</h1>
                                :
                                <h1 className="guess">&nbsp;</h1>
                            }

                            <div classnmae="hearts">
                                {displayHearts(playerHearts, totalHearts)}
                            </div>
                        </span>

                        <div className="centeredContentDiv">
                            {activePlayer === 0 ? countdown / 1000 : timePerPlayer}
                        </div>

                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={700}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                />

                <div className={activePlayer === 0 ? "rightScreen" : "rightScreen active"}>
                    <h1 className="turn">CPU turn</h1>
                    <img className="profile__pic" src={cpuImage} alt="cpu" />

                    <div className="centeredContent">
                        <span>
                            <h1 className="guess">{computerGenerated ? computerGenerated : null} &nbsp;</h1>
                            <div classnmae="hearts">
                                {displayHearts(cpuHearts, totalHearts)}
                            </div>
                        </span>


                        <div className="centeredContentDiv">
                            {activePlayer === 1 ? countdown / 1000 : timePerPlayer}
                        </div>

                    </div>
                </div>

            </div>

            <div className="input__footer">
                <form onSubmit={gameOn === true && activePlayer === 0 ? (e) => submitHandler(e) : (e) => { e.preventDefault(); }}>
                    <div className="input__container">
                        {activePlayer === 0 && gameOn === true ?
                            <input ref={inputRef} id="inputID" type="text" value={gameOn === true ? inputText : ''} onChange={(e) => setInputText(e.target.value.toLowerCase())} />
                            :
                            <input ref={inputRef} id="inputID" type="text" value={gameOn === true ? inputText : ''} />
                        }

                    </div>
                    <button className="post__btn">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default WordGame
