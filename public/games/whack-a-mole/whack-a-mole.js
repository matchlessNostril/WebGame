const $timer = document.querySelector('#timer');
const $score = document.querySelector('#score');
const $life = document.querySelector('#life');
const $game = document.querySelector('#game');
const $start = document.querySelector('#start');
const $$cells = document.querySelectorAll('.cell');

const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let started = false;
let score = 0;
let time = 60;
let life = 3;
let timerId;
let tickId;

$start.addEventListener('click', () => {
    if(started) return; // 이미 시작했으면 return
    started = true;
    timerId = setInterval(() => {
        time = (time*10 - 1)/10;
        $timer.textContent = time;
        if(time === 0){
            clearInterval(timerId);
            clearInterval(tickId);
            setTimeout(() => {
                alert(`게임 끝! 점수는 ${score}점`);
            }, 50);
        }
    }, 100);
    tickId = setInterval(tick, 1000);
    tick();
});

let gopherPercent = 0.3;
let bombPercent = 0.5;
function tick() {
    holes.forEach((hole, index) => {
        if(hole) return;
        const randomValue = Math.random();
        if(randomValue < gopherPercent){
            const $gopher = $$cells[index].querySelector('.gopher');
            holes[index] = setTimeout(() => {
                $gopher.classList.add('hidden');
                holes[index] = 0;
            }, 1000)
            $gopher.classList.remove('hidden');
        } else if(randomValue < bombPercent) { // 0.3~0.5
            const $bomb = $$cells[index].querySelector('.bomb');
            holes[index] = setTimeout(() => {
                $bomb.classList.add('hidden');
                holes[index] = 0;
            }, 1000)
            $bomb.classList.remove('hidden');
        }
    });
}

$$cells.forEach(($cell, index) => {
    $cell.querySelector('.gopher').addEventListener('click', (event) => {
        if(!event.target.classList.contains('dead')){
            score += 1;
            $score.textContent = score;
        }
        event.target.classList.add('dead');
        event.target.classList.add('hidden');
        clearTimeout(holes[index]);
        setTimeout(() => {
            event.target.classList.remove('dead');
            holes[index] = 0;
        }, 1000);
    })

    $cell.querySelector('.bomb').addEventListener('click', (event) => {
        if(!event.target.classList.contains('boom')){
            life -= 1;
            $life.textContent = life;
        }
        event.target.classList.add('boom');
        event.target.classList.add('hidden');
        clearTimeout(holes[index]);
        setTimeout(() => {
            event.target.classList.remove('boom');
            holes[index] = 0;
        }, 1000);
        if(life === 0) {
            clearInterval(timerId);
            clearInterval(tickId);
            setTimeout(() => {
                alert(`게임 끝! 점수는 ${score}점`);
            }, 50);
        }
    })
})