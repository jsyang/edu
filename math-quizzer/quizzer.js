
function onInput(e) {
    const value = e.target.value;
    const _round = GAME.rounds[GAME.currentRound];

    if(_round.answer < value) {
        alert(`Oops! ${value} is the wrong answer, please try again!`);
        GAME.currentPossibleScore--;
        GAME.currentPossibleScore = Math.max(GAME.currentPossibleScore, 0);
        $el.input.blur();
        $el.input.value='';
    } else if(_round.answer === parseInt(value,10)) {
        alert('Correct! Good job!');
        GAME.score += GAME.currentPossibleScore;
        nextRound();
        return;
    }
}

function nextRound() {
    GAME.currentRound++;
    if(GAME.currentRound < GAME.rounds.length) {
        $el.display.innerHTML = GAME.rounds[GAME.currentRound].expression + ' is:';
        $el.input.value = '';
        $el.input.focus();
        GAME.currentPossibleScore = 5;
    } else {
        $el.display.innerHTML = `Game over!<hr>Your score is ${GAME.score} / ${GAME.rounds.length * 5}!`;
        $el.input.disabled = true;
    }
    

}

function createInput() {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = 'Answer here';
    input.id = 'input';
    input.addEventListener("input", onInput);

    return input;
}

function generateRandomAdditionExpression() {
  const numbers = [];
  for (let i = 0; i < 2; i++) {
    const number = Math.floor(Math.random() * 10) + 1;
    numbers.push(number);
  }
  return { 
      expression: `${numbers[0]} + ${numbers[1]}`, 
      answer: numbers[0] + numbers[1],
      numbers,
  };
}

function createQuestionDisplay() {
    const div = document.createElement('div');
    div.id = 'display';
    return div;
}

const GAME = {
    score: 0,
    currentPossibleScore: 5,
    rounds: Array.from('1'.repeat(5)).map(generateRandomAdditionExpression),
    currentRound: -1,
};

const $el = {};
const $input = createInput();
const $display = createQuestionDisplay();

document.addEventListener('DOMContentLoaded', ()=>{
    
    $el.input = createInput();
    $el.display = createQuestionDisplay();
    document.body.append($el.display);
    document.body.append($el.input);
    
    nextRound();
});
