const $computer = document.querySelector('#computer');
const $text = document.querySelector('#text');
const $scissors = document.querySelector('#scissors');
const $rock = document.querySelector('#rock');
const $paper = document.querySelector('#paper');
const IMG_URL = './images/rsp.png';
$computer.style.background = `url(${IMG_URL}) 0 0`;
$computer.style.backgroundSize = 'auto 400px';

const rspX = { // 이미지 스프라이트 X좌표
    scissors: '0',
    rock: '-440px',
    paper: '-880px',
};

const cptChoice = ['scissors', 'rock', 'paper'];
let cptChoiceId = 0; // 0 : 가위, 1 : 바위, 2: 보
const changeComputerHand = () => {
    cptChoiceId = (++cptChoiceId) % 3;
    $computer.style.background = `url(${IMG_URL}) ${rspX[cptChoice[cptChoiceId]]} 0`;
    $computer.style.backgroundSize = 'auto 400px';
}

let interValid = setInterval(changeComputerHand, 50);
let clickable = true;
let cptScore = 0;
let userScore = 0;

const clickBtn = (event) => {
    if(clickable) {
        clearInterval(interValid);
        clickable = false;
        const userChoice = event.target.value; // 0 : 가위, 1 : 바위, 2: 보 (html 파일 button 태그 value 속성 확인)
        let message;
        switch(userChoice - cptChoiceId) { // 직접 계산해서 확인해봐
            case 0: 
                message = '무승부';
                break;
            case -2:
            case 1: 
                message = '승리';
                userScore++;
                break;
            case -1:
            case 2:
                message = '패배';
                cptScore++;
                break;
        }
        $text.textContent = '';
        $text.append(`${message}`, document.createElement('br'), `${userScore}점 (나) : ${cptScore}점 (컴퓨터)`);
        if(userScore === 3 || cptScore === 3) {
            (userScore-cptScore)>0 ? $text.append(document.createElement('br'), '나 승리!') : $text.append(document.createElement('br'), '컴퓨터 승리!')
            return;
        }
        setTimeout(()=>{
            clickable = true;
            interValid = setInterval(changeComputerHand, 50);
        }, 1000)
    }
}

$scissors.addEventListener('click', clickBtn);
$rock.addEventListener('click', clickBtn);
$paper.addEventListener('click', clickBtn);