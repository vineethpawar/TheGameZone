import React, { useState, useEffect } from 'react'
import { useCountdownTimer } from 'use-countdown-timer';
import randomWords from 'random-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Game.css'
var i = 0;
var firstPart = true;
var timePerPlayer = 5;
var letterLimit = 3;
var computerSmartness = 3500;
var tryLimit = 200;
function Game() {

    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 1000 * timePerPlayer, autostart: true, onExpire: () => { alert('Expired~~ You lost') }, expireImmediate: false
    });


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
                        let next = randomWords()
                        setRandomWord(next)



                        setInputText('');

                        setTimeout(() => {
                            computerThought(firstPart === true ? next.slice(0, letterLimit) : next.slice(-letterLimit), 1, computerGenerated);
                        }, computerSmartness);



                    }
                    else {
                        toast.error('Not a word', {
                            position: "top-center",
                            autoClose: 800,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                        });
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
                        <h1 className="guess">{inputText ? inputText : null} &nbsp;</h1>

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
                        <h1 className="guess">{computerGenerated ? computerGenerated : null} &nbsp;</h1>

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
                <form onSubmit={(e) => submitHandler(e)}>
                    <div className="input__container">
                        {activePlayer === 0 ?
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
