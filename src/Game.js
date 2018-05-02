import React from "react";
import Stars from "./Stars";
import Button from "./Button";
import Answer from "./Answer";
import DoneFrame from "./DoneFrame";
import Numbers from "./Numbers";
import _ from "lodash";
import possibleCombinationSum from "./utilities";

class Game extends React.Component {
  static randomNumber = () => 1 + Math.floor(Math.random() * 9);

  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    redraws: 5,
    doneStatus: null
  });

  state = Game.initialState();

  resetGame = () => this.setState(Game.initialState());

  selectNumber = number => {
    if (this.state.selectedNumbers.indexOf(number) >= 0) {
      return;
    }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(number)
    }));
  };

  unselectNumber = number => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.filter(
        selected => selected !== number
      )
    }));
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect:
        prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(
      prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: Game.randomNumber()
      }),
      this.updateDoneStatus
    );
  };

  redraw = () => {
    if (this.state.redraws === 0) {
      return;
    }
    this.setState(
      prevState => ({
        randomNumberOfStars: Game.randomNumber(),
        anserIsCorrect: null,
        selectedNumbers: [],
        redraws: prevState.redraws - 1
      }),
      this.updateDoneStatus
    );
  };

  possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => {
    const possibleNumbers = _.range(1, 10).filter(
      number => usedNumbers.indexOf(number) === -1
    );
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: "Done. Nice!" };
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: "Game Over!" };
      }
    });
  };

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus
    } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button
            selectedNumbers={selectedNumbers}
            redraws={redraws}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            redraw={this.redraw}
            answerIsCorrect={answerIsCorrect}
          />
          <Answer
            selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber}
          />
        </div>
        <br />
        {doneStatus ? (
          <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame} />
        ) : (
          <Numbers
            selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}
          />
        )}
      </div>
    );
  }
}

export default Game;
