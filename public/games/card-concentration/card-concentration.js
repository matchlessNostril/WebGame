const $wrapper = document.querySelector('#wrapper');

const total = parseInt(prompt('카드 개수를 짝수로 입력하세요. (최대 20)'));
const colors = ['red', 'orange', 'yellow', 'green', 'white', 'pink', 'cyan', 'violet', 'gray', 'black'];
let colorSlice = colors.slice(0, total/2);
let colorCopy = colorSlice.concat(colorSlice); // colors 배열에 colors 배열 합쳐서 새로운 배열 반환하기
let shuffled = [];
let clicked = [];
let completed = [];
let clickable = false;
let startTime;

function shuffle() {
    for(let i=0; colorCopy.length > 0; i += 1) {
        const randomIndex = Math.floor(Math.random()*colorCopy.length);
        shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1));
    }
}

function createCard(i) {
    const card = document.createElement('div');
    card.className = 'card'; // .card 태그 생성
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.style.backgroundColor = shuffled[i];
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    return card;
}

function onClickCard() {
    if(!clickable || completed.includes(this) || clicked[0] === this) {
        return;
    }
    this.classList.toggle('flipped');
    clicked.push(this);
    if(clicked.length !== 2) {
        return;
    }
    const firstBackColor = clicked[0].querySelector('.card-back').style.backgroundColor;
    const secondBackColor = clicked[1].querySelector('.card-back').style.backgroundColor;
    if(firstBackColor === secondBackColor) {
        // 두 카드가 같은 카드면
        completed.push(clicked[0]);
        completed.push(clicked[1]);
        clicked = [];
        if(completed.length !== total) {
            return;
        }
        const endTime = new Date();
        setTimeout(() => {
            alert(`축하합니다! ${(endTime-startTime) / 1000}초 걸렸습니다.`);
            resetGame();
        }, 1000);
        return;
    }
    // 두 카드가 다르면
    clickable = false; 
    // clicked.length === 2 일 때 + 두 카드가 다를 때
    // clickable을 false로 만들어서 다른 카드를 뒤집지 못하도록
    setTimeout(() => {
        clicked[0].classList.remove('flipped');
        clicked[1].classList.remove('flipped');
        clicked = [];
        clickable = true; 
        // 뒤집혔던 clicked[0], clicked[1] 카드가 다시 뒤집힌 후에
        // 다시 카드 뒤집을 수 있도록 clickable = true;
    }, 500);
}

function startGame() {
    shuffle();
    for(let i = 0; i<total; i += 1) {
        const card = createCard(i);
        card.addEventListener('click', onClickCard);
        $wrapper.appendChild(card);
    }

    document.querySelectorAll('.card').forEach((card, index) => {
        // 초반 카드 공개
        setTimeout(() => {
            card.classList.add('flipped');
        }, 1000 + 100 * index);
    });

    setTimeout(() => {
        // 카드 감추기
        document.querySelectorAll('.card').forEach((card) => {
            card.classList.remove('flipped');
        });
        clickable = true;
        startTime = new Date();
    }, 5000);
}

function resetGame() {
    $wrapper.innerHTML = '';
    colorCopy = colorSlice.concat(colorSlice);
    shuffled = [];
    completed = [];
    clickable = false;
    startGame();
}

startGame();