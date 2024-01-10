const startBtn = document.querySelector('#btn');

const startLotto = () => {
    const candidate = Array(45).fill().map((value, index) => index + 1); // 1~45 오름차순 배열
    
    const winBalls = []; // 1~45 무작위로 뽑은 7개 값을 담을 배열
    for(let i=0; i<7; i++){
        const randomIndex = Math.floor(Math.random()*candidate.length); // 랜덤 인덱스
        winBalls.push(candidate.splice(randomIndex, 1))
    }
    
    const bonus = winBalls.splice(6,1);
    winBalls.sort((a,b) => a-b);
    
    const $result = document.querySelector('#result');
    const $bonus = document.querySelector('#bonus');
    function createBall(number, $parent) {
        const $ball = document.createElement('div');
        $ball.className = 'ball';
        $ball.textContent = number
        switch(parseInt(number/10)){
            case 0: 
                $ball.style.backgroundImage = "url('./images/red.png')";
                $ball.style.color = "white";
                break;
            case 1: $ball.style.backgroundImage = "url('./images/orange.png')"; break;
            case 2: $ball.style.backgroundImage = "url('./images/yellow.png')"; break;
            case 3: 
                $ball.style.backgroundImage = "url('./images/blue.png')";
                $ball.style.color = "white";
                break;
            default: 
                $ball.style.backgroundImage = "url('./images/green.png')";
                $ball.style.color = "white";
                break;
        }
        $parent.appendChild($ball);
    }
    
    for(let i=0; i<6; i++){
        setTimeout(()=>{
            createBall(winBalls[i], $result);
        },1000*(i+1));
    }
    
    setTimeout(()=>{
        createBall(bonus, $bonus);
    },7000);
}

startBtn.addEventListener('click', startLotto);