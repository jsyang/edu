function onInput(e) {
    const value = e.target.value;
    const _round = GAME.rounds[GAME.currentRound];

    if (_round.answer < value) {
        alert(`Oops! ${value} is the wrong answer, please try again!`);
        GAME.currentPossibleScore--;
        GAME.currentPossibleScore = Math.max(GAME.currentPossibleScore, 0);
        $el.input.blur();
        $el.input.value = '';
    } else if (_round.answer === parseInt(value, 10)) {
        alert('Correct! Good job!');
        GAME.score += GAME.currentPossibleScore;
        nextRound();
        return;
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


const inputCallbacks = {
    resetForRound: () => {
        $el.input.value = '';
        $el.input.focus();
    },
    gameOver: () => {
        $el.input.disabled = true;
    }
}

// onLoad triggers

// const $input = createInput();
// document.body.append($el.input);