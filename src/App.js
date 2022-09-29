import React, { useState, useEffect } from "react";
import Highscores from "./Components/Highscores.js";
import "./App.css";
//Her ligger kortstokken
import cardDeck from "./Data/deck.json";

function App() {
  const [userCards, setUserCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [isGameStarted, setGameStart] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  const calculateTotalUser = (cards) => {
    setUserScore(calculate(cards));
  };

  const calculateTotalDealer = (cards) => {
    var val = calculate(cards);
    setDealerScore(val);
  };

  const calculate = (cards) => {
    let total = 0;
    cards.forEach((card) => {
      switch (card.value) {
        case "K":
          total += 10;
          break;

        case "Q":
          total += 10;
          break;

        case "J":
          total += 10;
          break;

        case "A":
          total += 1;
          break;

        default:
          total += Number(card.value);
          break;
      }
    });
    return total;
  };

  useEffect(() => {
    calculateTotalUser(userCards);
  }, [userCards]);

  useEffect(() => {
    calculateTotalDealer(dealerCards);
  }, [dealerCards]);

  //Deler ut kort til dealer og bruker
  const onDealClick = () => {
    cardDeck = cardDeck.sort(() => Math.random() - 0.5);

    drawCardUser();
    drawCardDealer();
    drawCardUser();
    drawCardDealer();

    setGameStart(true);
  };

  const onHitClick = () => {
    if (isGameOver) {
      return;
    }
    drawCardUser();
    //for å finne brukerns poeng: calculate(userCards)
    if (calculate(userCards) >= 21) {
      gameOver();
    }
  };
  const findWinner = () => {
    let dealerTotalScore = dealerScore;
    let dealerHand = [...dealerCards];
    if (dealerTotalScore > 21) {
      return <div>Jeg har vunnet</div>;
    } else if (dealerTotalScore > calculate(userCards)) {
      return <div>Dealer har vunnet</div>;
    } else if (calculate(userCards) > 21) {
      return <div>Dealer har vunnet</div>;
    } else {
      return <div>Jeg har vunnet</div>;
    }
  };

  const onStandClick = () => {
    if (isGameOver) {
      return;
    }

    let dealerHand = [...dealerCards];
    let dealerTotalScore = dealerScore;

    while (dealerTotalScore < 17) {
      dealerHand.push(cardDeck.pop());
      setDealerCards([...dealerHand]);
      dealerTotalScore = calculate(dealerHand);
    }
    setDealerCards(dealerHand);
    if (dealerTotalScore >= 17) {
      //game over
      console.log("game over");
      gameOver();
    }
  };

  //Trekker et kort fra bunken til bruker
  const drawCardUser = () => {
    let card = cardDeck.pop(); //Henter ut kort fra card deck
    userCards.push(card);
    setUserCards([...userCards]);
  };

  //Trekker et kort fra bunken til dealer
  const drawCardDealer = () => {
    let card = cardDeck.pop();
    dealerCards.push(card);
    setDealerCards([...dealerCards]);
  };

  //Viser brukers kort
  const showUserCards = () => {
    if (userCards.length === 0) {
      return <div>Bruker har ingen kort</div>;
    }
    return (
      <div>
        {userCards.map((card, i) => (
          <div key={i}>{card.value + card.suit}</div>
        ))}
      </div>
    );
  };

  //Viser dealers kort
  const showDealerCards = () => {
    if (dealerCards.length === 0) {
      return <div>Dealer har ingen kort</div>;
    }
    return (
      <div>
        {dealerCards.map((card, i) => (
          <div key={i}>{card.value + card.suit}</div>
        ))}
      </div>
    );
  };

  const getHighScore = () => {
    return localStorage.getItem("highscore");
  };

  const setHighScore = () => {
    //Sjekke om highscores finnes i localstorage fra før.
    let highScores = getHighScore();
    if (highScores == null) {
      highScores = [];
    } else {
      highScores = JSON.parse(highScores);
    }
    let dealerHand = [...dealerCards];
    let userHand = [...userCards];
    highScores.push(
      "Du fikk " +
        calculate(userHand) +
        ", dealer fikk " +
        calculate(dealerHand)
    );
    localStorage.setItem("highscore", JSON.stringify(highScores));
    //lagre til localstorage.
  };

  const gameOver = () => {
    setGameOver(true);
    setHighScore();
  };

  //JSX
  return (
    <div className="App">
      <div className="content">
        <div>
          <h1>KALAJACK</h1>
          {!isGameStarted ? (
            <button onClick={() => onDealClick()}>Deal</button>
          ) : (
            ""
          )}

          {isGameStarted ? (
            <div>
              <button onClick={() => onHitClick()}>Hit</button>
              <button onClick={() => onStandClick()}>Stand</button>
            </div>
          ) : (
            ""
          )}

          <div className="dealerHand">Dealer's Hand: {showDealerCards()}</div>
          <p>Dealer score: {dealerScore}</p>

          <p>------------------------</p>
          {isGameOver ? <div>{findWinner()}</div> : ""}
          <p>------------------------</p>
          <div className="userHand">Your Hand:{showUserCards()}</div>
          <p>Your score: {userScore}</p>
        </div>
        <div>
          <Highscores highscores={getHighScore()} />
        </div>
      </div>
    </div>
  );
}

export default App;
