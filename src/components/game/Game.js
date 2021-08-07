import React, { useState, useEffect } from 'react'
import { useCountdownTimer } from 'use-countdown-timer';
import randomWords from 'random-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import './Game.css'
var i = 0;
var next;
var gameOn = true;
var firstPart = true;
var timePerPlayer = 5;
var letterLimit = 2;
var computerSmartness = 1500;
var tryLimit = 200;
var playerHearts = 3;
var totalHearts = 3;
var cpuHearts = 3;
function Game() {

    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 1000 * timePerPlayer, autostart: true, onExpire: () => {
            toast.error('Time expired', {
                position: "top-center",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            playerHearts -= 1;
            checkLife();
            if (playerHearts > 0) {
                resetTimer();
                setActivePlayer(1)
                setFeedback('Success')
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
            alert('You Lost')
        }
        else if (cpuHearts === 0) {
            gameOn = false;
            alert('You Won')
        }
    }

    const [inputText, setInputText] = useState('');
    const [randomWord, setRandomWord] = useState('');
    const [computerGenerated, setComputerGenerated] = useState('')
    const [feedback, setFeedback] = useState('')
    const [activePlayer, setActivePlayer] = useState(0)
    const [meaning, setMeaning] = useState([])
    useEffect(() => {
        pause()
        setRandomWord(randomWords())
    }, [])



    const resetTimer = () => {
        reset();
        start();
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

                    setTimeout(() => {
                        setActivePlayer(0)
                        setRandomWord(randomWords())
                        setComputerGenerated('')
                        resetTimer()
                    }, 500);

                }

            } else {
                setTimeout(() => {
                    setActivePlayer(0)
                    setRandomWord(randomWords())
                    setComputerGenerated('')
                    resetTimer()
                }, 500);
            }

        } else {
            setComputerGenerated('Failed !!')
            cpuHearts -= 1;
            checkLife();
            setTimeout(() => {
                setActivePlayer(0)
                setRandomWord(randomWords())
                setComputerGenerated('')
                resetTimer()
            }, 1500);
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();

        if (inputText.includes(firstPart === true ? randomWord.slice(0, letterLimit) : randomWord.slice(-letterLimit))) {

            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${inputText}`)
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        resetTimer();
                        setActivePlayer(1)
                        setFeedback('Success')
                        next = randomWords()
                        setRandomWord(next)

                        setInputText('');

                        setTimeout(() => {
                            computerThought(firstPart === true ? next.slice(0, letterLimit) : next.slice(-letterLimit), 1, computerGenerated);
                        }, computerSmartness);

                    }
                    else {
                        toast.error('Not a dictionary word', {
                            position: "top-center",
                            autoClose: 800,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                        });
                        setInputText('');
                        playerHearts -= 1;
                        checkLife();
                    }

                })

        } else {
            toast.error('Does not contain phrase', {
                position: "top-center",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            setInputText('');
            playerHearts -= 1;
            checkLife();
        }

    }
    return (
        <div className="game__wrapper">

            <div className="compass">
                <img className={activePlayer === 0 ? "compass__img" : "compass__img rotate__right"} src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628314946/compass_rokfyq_xcxdk1.png" />
                <span>{firstPart === true ? randomWord.slice(0, letterLimit) : randomWord.slice(-letterLimit)}</span>
            </div>

            <div className="game">

                <div className={activePlayer === 0 ? "leftScreen active" : "leftScreen"}>
                    <h1 className="turn">Your turn </h1>
                    <img className="porfile__pic" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628277374/person_f2pneg.png" />
                    <div className="centeredContent">
                        <span>
                            <h1 className="guess">{inputText ? inputText : null} &nbsp;</h1>
                            <div classnmae="hearts">
                                {displayHearts(playerHearts, totalHearts)}
                            </div>
                        </span>

                        {/* <h2>Feedback: {feedback}</h2> */}


                        {/* <h2>Meaning: </h2>
                    {meaning.map(meaningItem =>
                        <h3 key={++i}>{meaningItem}</h3>
                    )} */}


                        {/* <div>{countdown / 1000}</div>
                                <button onClick={start}>Start</button>
                                <button onClick={resetTimer}>Reset</button> */}
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
                    <img className="porfile__pic" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628278268/robot_hp6q1q.png" />

                    <div className="centeredContent">
                        <span>
                            <h1 className="guess">{computerGenerated ? computerGenerated : null} &nbsp;</h1>
                            <div classnmae="hearts">
                                {displayHearts(cpuHearts, totalHearts)}
                            </div>
                        </span>
                        {/* <h2>Feedback: {feedback}</h2> */}


                        {/* <h2>Meaning: </h2>
                    {meaning.map(meaningItem =>
                        <h3 key={++i}>{meaningItem}</h3>
                    )} */}


                        {/* <div>{countdown / 1000}</div>
                                <button onClick={start}>Start</button>
                                <button onClick={resetTimer}>Reset</button> */}
                        <div className="centeredContentDiv">
                            {activePlayer === 1 ? countdown / 1000 : timePerPlayer}
                        </div>

                    </div>
                </div>

            </div>

            <div className="input__footer">
                <form onSubmit={gameOn == true ? (e) => submitHandler(e) : (e) => { e.preventDefault(); }}>
                    <div className="input__container">
                        {activePlayer === 0 && gameOn === true ?
                            <input id="inputID" type="text" value={inputText} onChange={(e) => setInputText(e.target.value.toLowerCase())} />
                            :
                            <input id="inputID" type="text" value={inputText} />
                        }

                    </div>
                    <button className="post__btn">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Game
