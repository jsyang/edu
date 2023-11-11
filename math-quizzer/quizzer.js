function nextRound(callbacks = {}) {
    const { resetForRound, gameOver } = callbacks;
    const { hasCardFlipped } = GAME;

    if (hasCardFlipped) {
        flipCard(true);
    }

    GAME.currentRound++;
    if (GAME.currentRound < GAME.rounds.length) {
        $el.expression.innerHTML = GAME.rounds[GAME.currentRound].expression + ' = ';

        if (hasCardFlipped) {
            // Don't reveal answer by changing it straight away!
            setTimeout(() => {
                $el.answer.innerHTML = GAME.rounds[GAME.currentRound].answer;
            }, 500);

        } else {
            $el.answer.innerHTML = GAME.rounds[GAME.currentRound].answer;
        }
        GAME.currentPossibleScore = 5;
        if (resetForRound) resetForRound();
    } else {
        $el.expression.innerHTML = `Game over!` //<hr>Your score is ${GAME.score} / ${GAME.rounds.length * 5}!`;
        if (gameOver) gameOver();
    }
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

const PLACES = [0, 1e1, 1e2, 1e3].map(n => n && n.toString());
const AUDIO = {};

function convertNumberToAudioZHHK(n) {
    const num = n.toString().split('');
    const speechParts = [];
    do {
        const digit = num.shift();

        if (digit !== '0') {
            speechParts.push(digit);
        }

        // Significant digit magnitude
        if (PLACES[num.length]) {
            speechParts.push(PLACES[num.length]);
        }
    } while (num.length > 0);

    // Special case for 10
    if (speechParts[0] === '1' && speechParts[1] === '10') {
        speechParts.shift();
    }

    return speechParts;
}

function convertExpressionToAudio() {
    const { numbers } = GAME.rounds[GAME.currentRound];
    return [
        ...convertNumberToAudioZHHK(numbers[0]),
        'plus',
        ...convertNumberToAudioZHHK(numbers[1]),
        'equals1',
        'equals2'
    ];
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertAnswerToAudio() {
    const { answer } = GAME.rounds[GAME.currentRound];
    return convertNumberToAudioZHHK(answer);
}

function playSpeechPart(part) {
    return new Promise(resolve => {
        const charSpeech = AUDIO[part];
        charSpeech.pause();
        charSpeech.currentTime = 0;
        charSpeech.play();

        charSpeech.ontimeupdate = () => {
            if (charSpeech.currentTime > 0.25) resolve();
        };
    });
}

let speechPromise;

function playAudio(expressionSpeechParts) {
    // Quit if already speaking
    if (speechPromise) return;

    let promise = Promise.resolve();

    for (const speechPart of expressionSpeechParts) {
        promise = promise.then(() => playSpeechPart(speechPart));
    }

    promise = promise.then(() => speechPromise = null);

    return promise;
}

function loadAudio() {
    return Promise.all(
        '1,2,3,4,5,6,7,8,9,10,plus,equals1,equals2'.split(',')
            .map(async a => {
                AUDIO[a] = new Audio(`audio_zh_hk/${a}.mp3`);
            })
    );
}

function flipCard(shouldMute) {
    GAME.hasCardFlipped ^= 1;
    $el.flipCard.classList.toggle('show-back', GAME.hasCardFlipped);

    if (!shouldMute) {
        setTimeout(() => {
            playAudio(convertAnswerToAudio());
        }, 500);
    }
}

////////////////////////////////////////////////////

function createDisplay() {
    const div = document.createElement('div');
    div.className = 'flip-card'
    div.innerHTML = `
    <div class="flip-card-inner">
      <div class="flip-card-front" id='expression'></div>
      <div class="flip-card-back" id='answer'></div>
  </div>`;
    return div;
}

const GAME = {
    hasCardFlipped: 0,
    score: 0,
    currentPossibleScore: 5,
    rounds: Array.from('1'.repeat(10)).map(generateRandomAdditionExpression),
    currentRound: -1,
};

const $el = {};

document.addEventListener('DOMContentLoaded', async () => {
    document.body.append(
        createDisplay()
    );
    document.body.innerHTML += `
    <button class="cta" onclick="playAudio(convertExpressionToAudio())">Speak</button>
    <button class="cta" onclick="flipCard()">Show answer</button>
    <button class="cta" onclick="nextRound()">Next</button>
    `;
    await loadAudio();

    $el.flipCard = document.querySelector('.flip-card');
    $el.expression = document.getElementById('expression');
    $el.answer = document.getElementById('answer');

    nextRound();
});
