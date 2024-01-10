const $form = document.querySelector('#form');
const $timer = document.querySelector('#timer');
const $tbody = document.querySelector('#table tbody');
const $result = document.querySelector('#result');

let row;
let cell;
let mine; // 지뢰
const CODE = {
    OPENED: 0, // 열린 칸(지뢰 X) 0~8까지 있음, 일단 0으로 초기화
    NORMAL: -1, // 닫힌 칸(지뢰 X)
    QUESTION: -2, // 물음표 칸(지뢰 X)
    FLAG: -3, // 깃발 칸(지뢰 X)
    QUESTION_MINE: -4, // 물음표 칸(지뢰 O)
    FLAG_MINE: -5, // 깃발 칸(지뢰 O)
    MINE: -6 // 닫힌 칸(지뢰 O)
}
const mines_code = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];

let shuffle;
let data;
let openCount = 0;
let startTime;
let Interval;
let firstClick = true;

function onSubmit(event) {
    event.preventDefault();
    row = parseInt(event.target['row'].value);
    cell = parseInt(event.target['cell'].value);
    mine = parseInt(event.target['mine'].value);
    drawTable();
    startTime = new Date();
    Interval = setInterval(() => {
        const time = ((new Date() - startTime)/1000).toFixed(1);
        $timer.textContent = `${time}초`;
    }, 1)
}
$form.addEventListener('submit', onSubmit);

function plantMine() {
    const candidate = Array(row*cell).fill().map((value, index) => {
        return index;
    })

    shuffle = [];

    while(candidate.length > row*cell-mine){
        const chosen = candidate.splice(Math.floor(Math.random()*candidate.length),1)[0];
        shuffle.push(chosen);
    }
    
    const data = [];
    for(let i=0; i<row; i++){
        const rowData = [];
        data.push(rowData);
        for(let j=0; j<cell; j++){
            rowData.push(CODE.NORMAL); // 닫힌 칸(지뢰 X)
        } 
    }
    
    for(let k=0; k<shuffle.length; k++){
        const mineRowIndex = Math.floor(shuffle[k]/cell);
        const mineCellIndex = shuffle[k]%cell;
        data[mineRowIndex][mineCellIndex] = CODE.MINE;   
    }
    console.log(data);
    return data;
}

function countMine(rowIndex, cellIndex) {
    let i = 0;

    mines_code.includes(data[rowIndex-1]?.[cellIndex-1]) && i++;
    mines_code.includes(data[rowIndex-1]?.[cellIndex]) && i++;
    mines_code.includes(data[rowIndex-1]?.[cellIndex+1]) && i++;
    mines_code.includes(data[rowIndex][cellIndex-1]) && i++;
    mines_code.includes(data[rowIndex][cellIndex+1]) && i++;
    mines_code.includes(data[rowIndex+1]?.[cellIndex-1]) && i++;
    mines_code.includes(data[rowIndex+1]?.[cellIndex]) && i++;
    mines_code.includes(data[rowIndex+1]?.[cellIndex+1]) && i++;

    return i;
}

function open(rowIndex, cellIndex) {
    const target = $tbody.children[rowIndex]?.children[cellIndex];
    if(!target) return;
    if(data[rowIndex][cellIndex] >= CODE.OPENED) return;

    const count = countMine(rowIndex, cellIndex);
    target.textContent = count || ''; // count가 0이면 '' 빈칸 출력
    target.className = 'opened';
    data[rowIndex][cellIndex] = count;
    
    openCount++;
    if(openCount === row*cell-mine){
        const endTime = ((new Date() - startTime)/1000).toFixed(1);
        clearInterval(Interval);
        $result.textContent = `지뢰 피하기 성공! ${endTime}초 걸렸습니다.`
        $tbody.removeEventListener('contextmenu', onRightClick);
        $tbody.removeEventListener('click', onLeftClick);
    }

    return count;
}

function openAround(rowIndex, cellIndex) {
    setTimeout(() => {
        const count = open(rowIndex, cellIndex);
        if(count === 0) {
            openAround(rowIndex-1, cellIndex-1);
            openAround(rowIndex-1, cellIndex);
            openAround(rowIndex-1, cellIndex+1);
            openAround(rowIndex, cellIndex-1);
            openAround(rowIndex, cellIndex+1);
            openAround(rowIndex+1, cellIndex-1);
            openAround(rowIndex+1, cellIndex);
            openAround(rowIndex+1, cellIndex+1);
        }
    }, 0)
}

function openAllMine() {
    let target;
    for(let i=0; i<row; i++) {
        for(let j=0; j<cell; j++) {
            if(mines_code.includes(data[i][j])) {
                target = $tbody.children[i].children[j];
                target.textContent = 'X';
            }
        }
    }
}

function transferMine() {
    let newMineIndex;
    while(shuffle.length === mine) { // push되는 순간 length가 +1이 되서 mine과 같지 않아짐
        newMineIndex = Math.floor(Math.random()*row*cell);
        if(!shuffle.includes(newMineIndex))
            shuffle.push(newMineIndex);
    }
    const newMineRowIndex = Math.floor(shuffle[shuffle.length-1]/cell);
    const newMineCellIndex = shuffle[shuffle.length-1]%cell;
    data[newMineRowIndex][newMineCellIndex] = CODE.MINE; 
}

function onRightClick(event) {
    event.preventDefault();
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];

    switch(cellData){
        case CODE.MINE:
            data[rowIndex][cellIndex] = CODE.QUESTION_MINE;
            target.className = 'question';
            target.textContent = '?';
            break;
        case CODE.QUESTION_MINE:
            data[rowIndex][cellIndex] = CODE.FLAG_MINE;
            target.className = 'flag';
            target.textContent = '!';
            break;
        case CODE.FLAG_MINE:
            data[rowIndex][cellIndex] = CODE.MINE;
            target.className = '';
            target.textContent = '';
            break;
        case CODE.NORMAL:
            data[rowIndex][cellIndex] = CODE.QUESTION;
            target.className = 'question';
            target.textContent = '?';
            break;
        case CODE.QUESTION:
            data[rowIndex][cellIndex] = CODE.FLAG;
            target.className = 'flag';
            target.textContent = '!';
            break;
        case CODE.FLAG:
            data[rowIndex][cellIndex] = CODE.NORMAL;
            target.className = '';
            target.textContent = '';
            break;
    }
    console.log(data);
}

function onLeftClick(event) {
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];

    if(cellData === CODE.NORMAL) {
        openAround(rowIndex, cellIndex);
        firstClick = false;
    } else if(cellData === CODE.MINE) {
        if(firstClick){
            firstClick = false;
            data[rowIndex][cellIndex] = CODE.NORMAL;
            transferMine();
            openAround(rowIndex, cellIndex);
            return;
        }
        clearInterval(Interval);
        openAllMine();
        target.className = 'opened';
        target.textContent = '펑';
        $tbody.removeEventListener('contextmenu', onRightClick);
        $tbody.removeEventListener('click', onLeftClick);
    }
}

function drawTable() {
    data = plantMine();
    for(let i=0; i<row; i++){
        const $tr = document.createElement('tr');
        for(let j=0; j<cell; j++){
            const $td = document.createElement('td');
            if(data[i][j] === CODE.MINE){
                $td.textContent = '';
            }
            $tr.append($td);
        }
        $tbody.append($tr);
    }
    $tbody.addEventListener('contextmenu', onRightClick);
    $tbody.addEventListener('click', onLeftClick);
    startTime = new Date();
}