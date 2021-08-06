import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useCountdownTimer } from 'use-countdown-timer';
import randomWords from 'random-words'
import './Game.css'
var i = 0;
function Game() {

    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 1000 * 5, autostart: true, onExpire: () => { }, expireImmediate: false
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
        <div className="game">


            {/* <h1>{activePlayer === 0 ? 'Your turn' : 'CPU turn'}</h1>
            <h1>{randomWord.slice(0, 2)}</h1>
            <h2>Computer Generated : {computerGenerated}</h2>
            <h2>Feedback: {feedback}</h2>
            <form onSubmit={(e) => submitHandler(e)}>
                <div className="input__container">
                    {activePlayer === 0 ?
                        <input id="inputID" type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                        :
                        <input id="inputID" type="text" value={inputText} />
                    }

                </div>
                <button>Push</button>
            </form>

            <h2>Meaning: </h2>
            {meaning.map(meaningItem =>
                <h3 key={++i}>{meaningItem}</h3>
            )} */}


          
                <div>{countdown / 1000}</div>
            


        </div>
    )
}

export default Game
