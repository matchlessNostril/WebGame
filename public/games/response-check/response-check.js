const $screen = document.querySelector('#screen');
const $text = document.querySelector('#text');
const $result = document.querySelector('#result');

let startTime;
let endTime;
const records = [];
let setTimeoutID;

$screen.addEventListener('click', function() {
    if($screen.classList.contains('waiting')){ // 대기 화면
        $screen.classList.replace('waiting', 'ready');
        $text.textContent = '색이 바뀌면 클릭하세요';
        setTimeoutID = setTimeout(function () {
            startTime = new Date();
            $screen.classList.replace('ready', 'now');
            $text.textContent = '';
        }, Math.floor(Math.random()*1000)+2000); // 2~3초
    } 
    else if($screen.classList.contains('ready')){ // 준비 화면
        clearTimeout(setTimeoutID);
        $screen.classList.replace('ready', 'waiting');
        $text.innerText = '너무 성급하시군요!' + '\n' + '다시 시작하려면 클릭해주세요!';
    } 
    else if($screen.classList.contains('now')){ // 클릭 화면
        endTime = new Date();
        const currentRecord = endTime - startTime;
        records.push(currentRecord);
        const average = records.reduce((a,c)=> a+c)/records.length;
        $result.innerText = `현재 : ${currentRecord}ms, 평균 : ${average}ms\n`;
        $text.textContent = '클릭해서 시작하세요';
        const topFive = records.sort((p,c) => p - c).slice(0,5);
        topFive.forEach((top, index) => {
            $result.append(
                document.createElement('br'),
                `${index+1}위 : ${top}ms`,
                );
            });
        }
        $screen.classList.replace('now', 'waiting');
})