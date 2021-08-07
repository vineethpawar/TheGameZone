
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import WordGame from './components/wordgame/WordGame';
import MainMenu from './components/mainmenu/MainMenu';
import RockPaper from './components/rockpaper/RockPaper';
import GuessIt from './components/guessit/GuessIt';



function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <MainMenu />
          </Route>

          <Route exact path="/wordgame">
            <WordGame noOfLetters={2} life={3} allowedTime={5} easyMode={true} />
          </Route>

          <Route exact path="/rock-paper-scissors">
            <RockPaper/>
          </Route>

          <Route exact path="/guess-it">
              <GuessIt/>
          </Route>


        </Switch>
      </div>
    </Router>
  );
}

export default App;
