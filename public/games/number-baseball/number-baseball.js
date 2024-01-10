const $input = document.querySelector('#input');
const $form = document.querySelector('#form');
const $explain = document.querySelector('#explain');
const $leftLogs = document.querySelector('#leftLogs');
const $rightLogs = document.querySelector('#rightLogs');
const $resultLog = document.querySelector('#resultLog');

const numbers = [];
for(let i=0; i<9; i++){
    numbers.push(i+1);
}

const answers = [];
let index;
for(let n=0; n<4; n++){
    index = Math.floor(Math.random()*(numbers.length));
    answers.push(numbers[index]);
    numbers.splice(index, 1);
}

console.log(answers);

const tries = [];
const checkInput = (input) => {
    if(out === 3){
        return alert('삼진 아웃입니다.');
    }
    if(homerun === true){
        return alert('이미 승리한 게임입니다.');
    }
    if(tries.length === 10){
        return alert('기회가 끝났습니다.');
    }
    if(input.length !== 4){ // 4자리인지
        return alert('4자리 숫자를 입력해주세요.');
    }
    if(new Set(input).size !== 4){ // 중복된 숫자가 있는지
        return alert('숫자 네 개가 모두 중복되지 않게 입력해주세요.');
    }
    if(tries.includes(input)){ // 이미 시도한 숫자들은 아닌지
        return alert('이미 시도한 값입니다.');
    }
    tries.push(input);
    return true;
    
}

let out = 0;
let homerun = false;
$form.addEventListener('submit', (event) => {
    event.preventDefault();
    $explain.textContent = '';
    const value = $input.value;
    $input.value = '';
    const valid = checkInput(value);
    if(!valid) return;
    
    let strike = 0;
    let ball = 0;
    
    answers.forEach((number, aIndex) => {
        const index = value.indexOf(String(number));
        if(index < 0) return;
        ball++;
        if(index === aIndex)
        strike++;
    })
    
    if(strike === 0 && ball === 0) out++;
    
    if(tries.length > 5) {
        $rightLogs.append(`(${tries.length}) ${value} : ${strike} 스트라이크 ${ball} 볼 ${out} 아웃`, document.createElement('br'));
    }
    else {
        $leftLogs.append(`(${tries.length}) ${value} : ${strike} 스트라이크 ${ball} 볼 ${out} 아웃`, document.createElement('br'));
    }
    
    if(out === 3){
        $resultLog.append(`삼진 아웃! 탈락.`);
        return;
    }
    
    if(answers.join('') === value){
        $resultLog.append(`홈런! ${tries.length}번 만에 맞혔습니다.`, document.createElement('br')
        , `정답은 ${answers.join('')}입니다.`);
        homerun = true;
        return;
    }
    
    if(tries.length === 10) {
        $resultLog.append('10번의 기회를 다 썼군요. 패배!', document.createElement('br'), `정답은 ${answers.join('')}`);
    }
})