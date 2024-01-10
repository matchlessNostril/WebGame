const button = document.querySelector('button');
const second = document.querySelector('.second');
const sec = document.querySelector('#s');
let score = document.querySelector('.score span');
let clickNum = 0;
let timeout = 60;
const planets = {
    num1: 'sun.png',
    num2: 'jupiter.png',
    num3: 'earth.png',
    num4: 'venus.png',
    num5: 'mercury.png',
    num6: 'star.png',
    num7: 'meteor.png',
}

let pNum = Number(prompt("Enter the number of players."));
let level = Number(prompt("Enter the level of game to play. (1 ~ 3)"));

let max;
if(level === 1) {
    max = 1.3;
} else if(level === 2) {
    max = 1.1;
} else if(level === 3) {
    max = 0.99;
}

function startCount() {
    clickNum++;
    let appear;
    button.textContent = 'Go!';
    button.removeEventListener('click', startCount);
    let count = setInterval(() => {
        sec.textContent = timeout-- + " seconds left";
        if(timeout < 0) {
            clearInterval(count);
            sec.textContent = "Timeout!";
            clearInterval(appear);
            // if(clickNum < pNum) {
                
            // }
        }
    }, 1000);
    if(clickNum < pNum && timeout <= 0) {
        timeout = 60;
        score.textContent = 0;
        button.textContent = 'Click to start!';
        button.addEventListener('click', startCount);
    }
    appear = setInterval(() => {
        let row = Math.floor(Math.random() * 7);
        let column = Math.floor(Math.random() * 10);
        let planet = Math.floor(Math.random() * 7 + 1);
        let tr = document.querySelectorAll('.row')[row];
        let item = tr.querySelectorAll('.item')[column];
        let img = document.createElement('img');
        img.src = planets['num' + planet];
        img.classList.add('num'+ planet);
        img.addEventListener('click', getScore);
        function getScore(event) {
            img.removeEventListener('click', getScore);
            if(event.target.classList.contains("num1")) {
                score.textContent = Number(score.textContent) + 1;
                return;
            }
            if(event.target.classList.contains("num2")) {
                score.textContent = Number(score.textContent) + 5;
                return;
            }
            if(event.target.classList.contains("num3")) {
                score.textContent = Number(score.textContent) + 10;
                return;
            }
            if(event.target.classList.contains("num4")) {
                score.textContent = Number(score.textContent) + 15;
                return;
            }
            if(event.target.classList.contains("num5")) {
                score.textContent = Number(score.textContent) + 20;
                return;
            }
            if(event.target.classList.contains("num6")) {
                score.textContent = Number(score.textContent) + 25;
                return;
            }
            if(event.target.classList.contains("num7")) {
                score.textContent = Number(score.textContent) - 30;
                return;
            }
        }
        item.appendChild(img);
        setTimeout(() => {
            item.removeChild(img);
        }, 2000);
    }, (Math.ceil((Math.random() * max + 0.9) * 100) / 100) * 1000);

    setTimeout(() => {
        let eachScore = document.createElement('span');
        let logNum = clickNum + "P: ";
        eachScore.textContent = logNum + score.textContent;
        document.querySelector('.others').appendChild(eachScore);
        
        timeout = 60;
        score.textContent = 0;
        button.textContent = 'Click to start!';
        if(clickNum < pNum){
            button.addEventListener('click', startCount);
        } else {
            button.textContent = 'Finish!';
        }
    }, 62000);
}

button.addEventListener('click', startCount);