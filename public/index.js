const $wrapper = document.querySelector('#wrapper');

function createCard(img, title, url) {
    const card = document.createElement('div');
    card.className = 'card';
    const gameImg = document.createElement('div');
    gameImg.className = 'gameImg';
    const gameName = document.createElement('div');
    gameName.className = 'gameName';

    gameImg.style.backgroundImage = `url('/images/thumbnails/${img}')`;
    gameName.textContent = title;

    card.appendChild(gameImg);
    card.appendChild(gameName);

    card.addEventListener('mouseover', () => {
        card.style.backgroundColor = 'white';
        gameName.style.color = 'rgb(51, 55, 62)';
        gameName.style.fontWeight = 'bold';
    })

    card.addEventListener('mouseout', () => {
        card.style.borderColor = 'white';
        card.style.borderWidth = '1px';
        card.style.backgroundColor = '';
        gameName.style.color = 'white';
        gameName.style.fontWeight = '500';
    })

    card.addEventListener('click', () => {
        window.location.href = `./games/${url}`;
    })

    return card;
}

function onMouseoverCard() {

}

const gameImgs = ['word-relay.png', 'number-baseball.PNG', 'lotto.png', 'rock-scissors-paper.png', 'response-check.png', 'tictactoe.png', 'text-rpg.png', 'card-concentration.png', 'mine-sweeper.png', '2048.png', 'whack-a-mole.png', 'planetGame.png'];
const gameName = ['끝말잇기', '숫자 야구', '로또', '가위 바위 보', '집중력', '틱택토', '텍스트 RPG', '카드 짝 맞히기', '지뢰 찾기', '2048', '두더지 잡기', '행성'];
const gameUrls = ['word-relay/word-relay.html', 'number-baseball/number-baseball.html', 'lotto/lotto.html', 'rock-scissors-paper/rock-scissors-paper.html', 'response-check/response-check.html', 'tictactoe/tictactoe.html', 'text-rpg/text-rpg.html', 'card-concentration/card-concentration.html', 'mine-sweeper/mine-sweeper.html', '2048/2048.html', 'whack-a-mole/whack-a-mole.html', 'planetGame/planetGame.html'];

for(let i=0; i<12; i++) {
    const card = createCard(gameImgs[i], gameName[i], gameUrls[i]);
    card.addEventListener('mouseover', onMouseoverCard);
    $wrapper.appendChild(card);
}

const marginBottom = document.createElement('div');
marginBottom.style.width = '100%';
marginBottom.style.height = '1px';
$wrapper.appendChild(marginBottom);