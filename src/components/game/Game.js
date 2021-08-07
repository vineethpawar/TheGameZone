import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useCountdownTimer } from 'use-countdown-timer';
import randomWords from 'random-words'
import './Game.css'
var i = 0;
function Game() {

    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 1000 * 8, autostart: true, onExpire: () => { alert('Expired~~ You lost') }, expireImmediate: false
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
        if (tries < 1000) {
            if (!current.includes(phrase)) {
                let temp = randomWords()
                setComputerGenerated(temp)

                if (!temp.includes(phrase))
                    computerThought(phrase, tries + 1, temp);
                else {
                    Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${temp}`)
                        .then(response => setMeaning(response.data.map(data => data.meanings.map(meaning => meaning.definitions.map(def => def.definition)))))

                    setTimeout(() => {
                        setActivePlayer(0)
                        setRandomWord(randomWords())
                        setComputerGenerated('')
                        resetTimer()
                    }, 2500);

                }

            }

        } else {
            setComputerGenerated('Failed !!')

            setTimeout(() => {
                setActivePlayer(0)
                setRandomWord(randomWords())
                setComputerGenerated('')

            }, 2500);
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();

        if (inputText.includes(randomWord.slice(0, 2))) {

            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${inputText}`)
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        setActivePlayer(1)
                        setFeedback('Success')
                        let next = randomWords()
                        setRandomWord(next)
                        resetTimer()
                        Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${inputText}`)
                            .then(response => setMeaning(response.data.map(data => data.meanings.map(meaning => meaning.definitions.map(def => def.definition)))))


                        setInputText('');

                        setTimeout(() => {
                            computerThought(next.slice(0, 2), 1, computerGenerated);
                        }, 1500);



                    }
                    else {
                        setFeedback('Not a word')
                    }

                })

        } else {
            setFeedback('does not contain given phrase')
            setInputText('');
        }

    }
    return (
        <div className="game__wrapper">
            <div className="compass">
                <img className={activePlayer === 0 ? "compass__img" : "compass__img rotate__right"} src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628278873/compass_rokfyq.png" />
            </div>

            <div className="game">

                <div className={activePlayer === 0 ? "leftScreen active" : "leftScreen"}>
                    <h1 className="turn">Your turn </h1>
                    <img className="porfile__pic" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628277374/person_f2pneg.png" />
                    <h1>{randomWord.slice(0, 2)}</h1>
                    <h2>Computer Generated : {computerGenerated}</h2>
                    <h2>Feedback: {feedback}</h2>


                    <h2>Meaning: </h2>
                    {meaning.map(meaningItem =>
                        <h3 key={++i}>{meaningItem}</h3>
                    )}



                    <div>{countdown / 1000}</div>
                    <button onClick={start}>Start</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>


                <div className={activePlayer === 0 ? "rightScreen" : "rightScreen active"}>
                    <h1 className="turn">CPU turn</h1>
                    <img className="porfile__pic" src="https://res.cloudinary.com/dpjkblzgf/image/upload/v1628278268/robot_hp6q1q.png" />

                    <h1>{randomWord.slice(0, 2)}</h1>
                    <h2>Computer Generated : {computerGenerated}</h2>
                    <h2>Feedback: {feedback}</h2>


                    <h2>Meaning: </h2>
                    {meaning.map(meaningItem =>
                        <h3 key={++i}>{meaningItem}</h3>
                    )}



                    <div>{countdown / 1000}</div>
                    <button onClick={start}>Start</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>

            </div>

            <div className="input__footer">
                <form onSubmit={(e) => submitHandler(e)}>
                    <div className="input__container">
                        {activePlayer === 0 ?
                            <input id="inputID" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
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
