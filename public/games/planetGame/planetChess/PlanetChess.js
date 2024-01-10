const $chessBoard = document.getElementById('chessBoard');
const $log1P = document.getElementById('log1P');
const $log2P = document.getElementById('log2P');
const $sun1p = document.querySelector('#skill_1P .skill_Sun');
const $saturn1p = document.querySelector('#skill_1P .skill_Saturn');
const $uranus1p = document.querySelector('#skill_1P .skill_Uranus');
const $neptune1p = document.querySelector('#skill_1P .skill_Neptune');
const $sun2p = document.querySelector('#skill_2P .skill_Sun');
const $saturn2p = document.querySelector('#skill_2P .skill_Saturn');
const $uranus2p = document.querySelector('#skill_2P .skill_Uranus');
const $neptune2p = document.querySelector('#skill_2P .skill_Neptune');

let data = []; // chess 현황을 담을 data 배열

/*---------------------------- (1) makeChessBoard ------------------------------*/
function makeChessBoard() {
    const $fragment = document.createDocumentFragment(); // 가상의 태그
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function(value) {
        const rowData = [];
        data.push(rowData);
        const $row = document.createElement('div');
        $row.className = "row" + (value-1);
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function (value) {
            rowData.push('');
            const $cell = document.createElement('div');
            $cell.className = "cell" + (value-1);
            $row.appendChild($cell);
        })
        $fragment.appendChild($row);
    })
    $chessBoard.appendChild($fragment);
}


/*---------------------------- (2) arrangeChessMan ------------------------------*/
function arrangeChessMan() {
    const chessMan = ['jupiter', 'mars', 'venus', 'pluto', 'earth', 'moon', 'pluto', 'venus', 'mars', 'jupiter'];
    // ['목성', '화성', '금성', '명왕성', '지구', '달', '명왕성', '금성', '화성', '목성']
    chessMan.forEach((chessManValue, index) => {
        data[0][index] = chessManValue;
        const $row1Cell = $chessBoard.children[0].children[index];
        $row1Cell.classList.add(chessManValue);
        $row1Cell.classList.add('turn1P');

        data[9][index] = chessManValue;
        const $row10Cell = $chessBoard.children[9].children[index];
        $row10Cell.classList.add(chessManValue);
        $row10Cell.classList.add('turn2P');
    });
    data[9][4] = 'moon';
    $chessBoard.children[9].children[4].classList.replace('earth', 'moon');
    data[9][5] = 'earth';
    $chessBoard.children[9].children[5].classList.replace('moon', 'earth');

    [1, 8].forEach(function(rowIndex) {
        data[rowIndex].forEach((cellData, index) => {
            data[rowIndex][index] = 'mercury'; // 수성
            const $cell = $chessBoard.children[rowIndex].children[index];
            $cell.classList.add('mercury');
            $cell.classList.add('firstMove');

            if(rowIndex === 1){
                $cell.classList.add('turn1P');
            } else {
                $cell.classList.add('turn2P');
            }
        });
    });
    console.log(data);
}

makeChessBoard();
arrangeChessMan();

/*------------- (3) cell EventListener / cancelAnotherClick or CanMoveCell --------------*/
let $cell = document.querySelectorAll('#chessBoard div div');
let $skillCell = document.querySelectorAll('#skill_1P span, #skill_2P span');
// querySelectorAll은 nodeCollection을 반환하기 때문에
// index와 length 속성은 있지만
// 배열 메서드는 사용할 수 없다. (ex. forEach)
for(let i=0; i<$cell.length; i++){ 
    $cell[i].addEventListener('mouseover', (event)=>{
        event.target.classList.add('mouseover');
    });
    $cell[i].addEventListener('mouseout', (event)=>{
        event.target.classList.remove('mouseover');
    });
    $cell[i].addEventListener('click', (event)=>{
        cancelAnotherClick();
        event.target.classList.add('click');
        // 이동 및 공격이 가능한 칸 보여주는 함수
        if(event.target.classList.contains('turn1P')){
            PossibleCell(event.target, 'turn1P');
        } else if(event.target.classList.contains('turn2P')){
            PossibleCell(event.target, 'turn2P');
        }
    });
}

function cancelAnotherClick() {
    for(let i=0; i<$cell.length; i++){
        if($cell[i].classList.contains('click')){
            $cell[i].classList.remove('click');
        }
    }
    for(let i=0; i<$skillCell.length; i++){
        if($skillCell[i].classList.contains('click')){
            $skillCell[i].classList.remove('click');
        }
    }
}

function cancelAnotherCanMoveCell() {
    const $canMoveCell = document.querySelectorAll('.canMove');
    for(let i=0; i<$canMoveCell.length; i++) {
        $canMoveCell[i].removeEventListener('click', moveChessMan);
        $canMoveCell[i].remove();
    }
}

function cancelAnotherSkillCell() {
    const $canSkillCell = document.querySelectorAll('.canSkill');
    for(let i=0; i<$canSkillCell.length; i++) {
        $canSkillCell[i].removeEventListener('click', skillChessMan);
        $canSkillCell[i].remove();
    }
}

/*---------------------------- (4) input or show PossibleCanMoveCell or PossibleSkillCell ------------------------------*/
function inputPossibleCell(xIndex, yIndex, opponentTurn){
    if($chessBoard.children[xIndex].children[yIndex].classList.contains(`${opponentTurn}`)){
        possibleCell.push($chessBoard.children[xIndex].children[yIndex]);
    }
}

let possibleCell = [];
let changingTurn = 'turn1P';
function PossibleCell(clickedCell, turn) {
    if(win === true){
        return;
    }

    $cell = document.querySelectorAll('#chessBoard div div');
    const opponentTurn = (turn === 'turn1P') ? 'turn2P' : 'turn1P';
    const turnNum = (turn === 'turn1P') ? 1 : -1;
    
    possibleCell = []; // 초기화

    const skillPlanet = clickedCell; // !!스킬 사용 중에는 clickedCell이 skill 이름!!
    if(usingSkill === true && changingTurn === turn){
        cancelAnotherCanMoveCell();
        cancelAnotherSkillCell();
        // 스킬 사용 중, 스킬 적용 대상 push
        switch(skillPlanet){
            case 'sun':
            case 'saturn':
            case 'uranus': {
                for(let i=0; i<$cell.length; i++){
                    if($cell[i].classList.contains(`${opponentTurn}`) && !$cell[i].classList.contains('earth') && !$cell[i].classList.contains('moon')){
                        possibleCell.push($cell[i]);
                    }
                }
                showPossibleSkillCell(skillPlanet, turnNum, $cell);
                return;
            }
            case 'neptune': {
                for(let j=0; j<=9; j++){
                    if(turn === 'turn1P'){
                        for(let i=0; i<=8; i++){
                            if($chessBoard.children[i].children[j].classList.contains(`${opponentTurn}`)){
                                if(data[i+1][j] === ''){
                                    possibleCell.push($chessBoard.children[i].children[j]);
                                }
                                break;
                            }
                        }
                    } else {
                        for(let i=9; i>=1; i--){
                            if($chessBoard.children[i].children[j].classList.contains(`${opponentTurn}`)){
                                if(data[i-1][j] === ''){
                                    possibleCell.push($chessBoard.children[i].children[j]);
                                }
                                break;
                            }
                        }
                    }
                }
                if(possibleCell.length>0){
                    skillChessMan(null, skillPlanet, turnNum);
                }
                return;
            }
        }
    }
            
    if(clickedCell.classList.contains('frozen')){
        cancelAnotherCanMoveCell();
        return;
    }

    if(changingTurn !== turn){
        // 1P 턴인데 2P 말을 누른 경우 return
        cancelAnotherCanMoveCell();
        return;
    }
    
    // clickedCell의 x좌표, y좌표
    const X = parseInt((clickedCell.parentNode.className).substr(3,1)); // row 좌표
    const Y = parseInt((clickedCell.className).substr(4,1)); // cell 좌표
    
    // 다른 canMoveCell을 보여주고 있는 경우 없애기
    cancelAnotherCanMoveCell();
    cancelAnotherSkillCell();
            
    if(clickedCell.classList.contains('mercury')) {
        /*--------- 수성 공격 및 이동 ---------*/
        // 1칸 거리 대각선에 상대방 말이 있는 경우 공격 가능
        if((Y>0) && data[X+(1*turnNum)][Y-1] && $cell[10*(X+(1*turnNum))+Y-1].classList.contains(`${opponentTurn}`)){
            possibleCell.push($chessBoard.children[X+(1*turnNum)].children[Y-1]);
        }
        if((Y<9) && data[X+(1*turnNum)][Y+1] && $cell[10*(X+(1*turnNum))+Y+1].classList.contains(`${opponentTurn}`)){
            possibleCell.push($chessBoard.children[X+(1*turnNum)].children[Y+1]);
        }
        
        // 앞에 말이 있는 경우(상대말, 본인말 모두 포함) 앞으로 이동 불가능
        if(data[X+(1*turnNum)][Y]){
            if(checkmate === true){
                return;
            }
            showPossibleMoveCell(clickedCell, X, Y);
            return;
        }

        if(clickedCell.classList.contains('firstMove')) {
            // 처음 움직이는 경우, 앞으로 1칸 or 2칸
            if(!data[X+(2*turnNum)][Y]){
                possibleCell.push($chessBoard.children[X+(2*turnNum)].children[Y]);
            }
        }
        possibleCell.push($chessBoard.children[X+(1*turnNum)].children[Y]);
    } 
    
    else if(clickedCell.classList.contains('venus')){
        /*--------- 금성 공격 및 이동 ---------*/
        for(let i=X-2; i<=X+2; i++){
            if(i<0||i>9||i===X){
                continue;
            }
            if(i===X-2||i===X+2){
                for(let j=Y-1; j<=Y+1; j=j+2){
                    if(j<0||j>9){
                        continue;
                    }
                    if(data[i][j]){
                        inputPossibleCell(i, j, opponentTurn);
                        continue;
                    }
                    possibleCell.push($chessBoard.children[i].children[j]);
                }
            } else {
                for(let j=Y-2; j<=Y+2; j=j+4){
                    if(j<0||j>9){
                        continue;
                    }
                    if(data[i][j]){
                        inputPossibleCell(i, j, opponentTurn);
                        continue;
                    }
                    possibleCell.push($chessBoard.children[i].children[j]);
                }
            }
        }
    }

    else if(clickedCell.classList.contains('pluto')){
        /*--------- 명왕성(합체 전) 공격 및 이동 ---------*/
        for(let i=X-1; i<=X+1; i++){
            for(let j=Y-1; j<=Y+1; j++){
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    if($chessBoard.children[i].children[j].classList.contains('mercury')){
                        possibleCell.push($chessBoard.children[i].children[j]);
                    }
                    // 본인 말이여도 수성이면 합체 가능
                    continue;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
        }
    }

    else if(clickedCell.classList.contains('earth')){
        /*--------- 지구 공격 및 이동 ---------*/
        for(let i=X-1; i<=X+1; i++){
            for(let j=Y-1; j<=Y+1; j++){
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    continue;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
        }
    }
    
    else {
        let distance;
        if(clickedCell.classList.contains('PlutoAndMercury')){
            distance = 2;
        } else {
            distance = 9;
        }

        if(!clickedCell.classList.contains('mars')) { // 남은 4가지 중에 mars 제외 나머지 -> jupiter, moon, PlutoAndMercury
            /*--------- 목성, 달, 명왕성 + 수성 공격 및 이동 ---------*/
            for(let i=X-1; i>=X-distance; i--){
                // ↑
                if(i<0){
                    break;
                }
                if(data[i][Y]){
                    inputPossibleCell(i, Y, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[Y]);
            }
    
            for(let i=X+1; i<=X+distance; i++){
                // ↓
                if(i>9){
                    break;
                }
                if(data[i][Y]){
                    inputPossibleCell(i, Y, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[Y]);
            }
    
            for(let j=Y-1; j>=Y-distance; j--){
                // ←
                if(j<0){
                    break;
                }
                if(data[X][j]){
                    inputPossibleCell(X, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[X].children[j]);
            }
    
            for(let j=Y+1; j<=Y+distance; j++){
                // →
                if(j>9){
                    break;
                }
                if(data[X][j]){
                    inputPossibleCell(X, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[X].children[j]);
            }
        }
    
        if(!clickedCell.classList.contains('jupiter')){  // 남은 4가지 중에 jupiter 제외 나머지 -> mars, moon, PlutoAndMercury
            /*--------- 화성, 달, 명왕성 + 수성 공격 및 이동 ---------*/
            for(let i=X-1, j=Y-1; i>=X-distance, j>=Y-distance; i--, j--){
                // ↖
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
    
            for(let i=X+1, j=Y+1; i<=X+distance, j<=Y+distance; i++, j++){
                // ↘
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
    
            for(let i=X-1, j=Y+1; i>=X-distance, j<=Y+distance; i--, j++){
                // ↗
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
    
            for(let i=X+1, j=Y-1; i<=X+distance, j>=Y-distance; i++, j--){
                // ↙
                if(i<0||i>9||j<0||j>9){
                    continue;
                }
                if(data[i][j]){
                    inputPossibleCell(i, j, opponentTurn);
                    break;
                }
                possibleCell.push($chessBoard.children[i].children[j]);
            }
        }
    }  

    if(checkmate === true){
        return;
    }
    showPossibleMoveCell(clickedCell, X, Y);
}

function showPossibleMoveCell(clickedCell, X, Y) {
    possibleCell.forEach((value, index) => {
        // class를 추가해줌으로써 이동 가능한 칸 보여주기
        const $canMoveCell = document.createElement('div');
        $canMoveCell.className = 'canMove';
        possibleCell[index].appendChild($canMoveCell);
        possibleCell[index].children[0].addEventListener('click', 
        function(event){moveChessMan(event, clickedCell, X, Y)})
    })
}

function showPossibleSkillCell(skillPlanet, turnNum, $cell) {
    possibleCell.forEach((value, index) => {
        // class를 추가해줌으로써 공격 가능한 칸 보여주기
        const $canSkillCell = document.createElement('div');
        $canSkillCell.className = 'canSkill';
        possibleCell[index].appendChild($canSkillCell);
        possibleCell[index].children[0].addEventListener('click', function(event){skillChessMan(event, skillPlanet, turnNum, $cell)});
    })
    usingSkill = false;
}

/*---------------------------- (5) checkmate ------------------------------*/
function isCheckmated(checkTag, turn){
    checkmate = true;
    checkmateResult = false;
    PossibleCell(checkTag, turn);
    possibleCell.forEach((value, index) => {
        if(possibleCell[index].classList.contains('earth')){
            if(turn === 'turn1P'){
                $log1P.textContent = 'Checkmate!';
                $log1P.style.color = "rgb(216, 74, 74)";
                $log2P.textContent = 'Watch out 2P';
                $log2P.style.color = "rgb(138, 78, 187)";
            } else{
                $log1P.textContent = 'Watch out 1P';
                $log1P.style.color = "rgb(138, 78, 187)";
                $log2P.textContent = 'Checkmate!';
                $log2P.style.color = "rgb(216, 74, 74)";
            }
            checkmateResult = true;
        }
    })
    checkmate = false;
}

/*---------------------------- (6) commonClassAdd & moveChessMan ------------------------------*/
let endLine;
let win;

function commonClassAdd(selectedPlanet, turn, beforeTag, afterTag, beforeX, beforeY, afterX, afterY){
    afterTag.classList.add(selectedPlanet);
    afterTag.classList.add(turn);
    if(beforeTag.classList.contains('life2')){
        afterTag.classList.add('life2');
    } else if(beforeTag.classList.contains('life1')){
        afterTag.classList.add('life1');
    }

    data[afterX][afterY] = data[beforeX][beforeY];
    data[beforeX][beforeY] = '';

    beforeTag.classList.value = '';
    beforeTag.classList.add(`cell${beforeY}`);
    
    // 승리 조건 1. mercury 말들 중 하나라도 끝에 닿으면 승리
    endLine = (turn === 'turn1P') ? 9 : 0;
    if(afterTag.classList.contains('mercury') && afterX === endLine){
        win = true;
    }
}

let checkmate = false;
let checkmateResult = false;
function moveChessMan(event, clickedCell, beforeX, beforeY) {
    if(clickedCell.classList.contains('firstMove')){
        clickedCell.classList.remove('firstMove');
    }
    
    const afterX = parseInt((event.target.parentNode.parentNode.className).substr(3,1)); // row 좌표
    const afterY = parseInt((event.target.parentNode.className).substr(4,1)); // cell 좌표
    
    const selectedPlanet = document.querySelector(`.row${beforeX}`).querySelector(`.cell${beforeY}`).classList[1];
    const turn = document.querySelector(`.row${beforeX}`).querySelector(`.cell${beforeY}`).classList[2]; // 왜 2지..? ㅎ
    const opponentTurn = (turn == 'turn1P') ? 'turn2P' : 'turn1P';

    if(turn === 'turn1P' && $log2P.textContent){
        $log2P.textContent = '';
    } else if(turn === 'turn2P' && $log1P.textContent){
        $log1P.textContent = '';
    }

    const afterTag = document.querySelector(`.row${afterX}`).querySelector(`.cell${afterY}`);
    const beforeTag = document.querySelector(`.row${beforeX}`).querySelector(`.cell${beforeY}`);

    if(selectedPlanet === 'pluto' && afterTag.classList.contains('mercury') && afterTag.classList.contains(`${turn}`)){
        // 명왕성 + 수성 합체
        afterTag.classList.value = '';
        afterTag.classList.add(`cell${afterY}`);
        afterTag.classList.add('PlutoAndMercury');
        afterTag.classList.add(turn);
        afterTag.classList.add('life2');

        data[afterX][afterY] = "PlutoAndMercury";
        data[beforeX][beforeY] = '';

        beforeTag.classList.value = '';
        beforeTag.classList.add(`cell${beforeY}`);
    }
    else {
        if(!afterTag.classList.contains(`${opponentTurn}`)){ // 상대말이 놓여있지 않던 칸
            commonClassAdd(selectedPlanet, turn, beforeTag, afterTag, beforeX, beforeY, afterX, afterY);
        } else {
            // 말이 놓여 있던 칸 -> 공격
            if(afterTag.classList.contains('life2')){ // PlutoAndMercury만 해당됨
                afterTag.classList.replace('life2', 'life1'); // life1이었으면 죽음
            } else {
                if(afterTag.classList.contains('earth')){
                    // 승리 조건 2. 상대 earth 말을 죽였을 경우 승리
                    win = true;
                }
                afterTag.classList.value = '';
                afterTag.classList.add(`cell${afterY}`);
                commonClassAdd(selectedPlanet, turn, beforeTag, afterTag, beforeX, beforeY, afterX, afterY);
            }
        }
    }

    // eventListener 제거
    cancelAnotherCanMoveCell();

    if(win === true && turn === 'turn1P'){
        $log1P.textContent = `${turn.substr(4,2)} Win!`;
        $log2P.textContent = '';
        return;
    } else if(win === true && turn === 'turn2P'){
        $log1P.textContent = '';
        $log2P.textContent = `${turn.substr(4,2)} Win!`;
        return;
    }

    usingSkill = false; // skill 키를 누르고 attackTag를 고르지 않고 moveChessMan 함수를 실행할 경우

    // 체크메이트 판별
    isCheckmated(afterTag, turn, checkmateResult);

    // frozen 풀기
    $cell.forEach((value, index) => {
        if($cell[index].classList.contains('frozen')){
            $cell[index].classList.remove('frozen'); // 다음 부터는 이동 가능하게
        }
    })

    changingTurn = (changingTurn === 'turn1P') ? 'turn2P' : 'turn1P';
    // 차례 변경
    if(checkmateResult){
        setTimeout(()=>{
            if(changingTurn === 'turn1P'){
                $log1P.textContent = '1P turn';
                $log1P.style.color = "#6F819C";
                $log2P.textContent = '';
                $log2P.style.color = "#9e9e9e";
            } else {
                $log1P.textContent = '';
                $log1P.style.color = "#6F819C";
                $log2P.textContent = '2P turn';
                $log2P.style.color = "#9e9e9e";
            }
        }, 2500)
    } else {
        if(changingTurn === 'turn1P'){
            $log1P.textContent = '1P turn';
            $log2P.textContent = '';
        } else {
            $log1P.textContent = '';
            $log2P.textContent = '2P turn';
        }
    }
}

/*---------------------------- (7) reduceSkillChanceNum, skillChessMan, skill ------------------------------*/
const skills = [$sun1p, $sun2p, $saturn1p, $saturn2p, $uranus1p, $uranus2p, $neptune1p, $neptune2p];

let chanceNum;
let skillPlanetTag;
function reduceSkillChanceNum(Planet, opponentTurn){
    if(Planet === 'sun' && opponentTurn === 'turn2P'){
        skillPlanetTag = $sun1p;
        chanceNum = parseInt($sun1p.classList[2].substr(6,1));
    } else if(Planet === 'sun' && opponentTurn === 'turn1P'){
        skillPlanetTag = $sun2p;
        chanceNum = parseInt($sun2p.classList[2].substr(6,1));
    } else if(Planet === 'saturn' && opponentTurn === 'turn2P'){
        skillPlanetTag = $saturn1p;
        chanceNum = parseInt($saturn1p.classList[2].substr(6,1));
    } else if(Planet === 'saturn' && opponentTurn === 'turn1P'){
        skillPlanetTag = $saturn2p;
        chanceNum = parseInt($saturn2p.classList[2].substr(6,1));
    } else if(Planet === 'uranus' && opponentTurn === 'turn2P'){
        skillPlanetTag = $uranus1p;
        chanceNum = parseInt($uranus1p.classList[2].substr(6,1));
    } else if(Planet === 'uranus' && opponentTurn === 'turn1P'){
        skillPlanetTag = $uranus2p;
        chanceNum = parseInt($uranus2p.classList[2].substr(6,1));
    } else if(Planet === 'neptune' && opponentTurn === 'turn2P'){
        skillPlanetTag = $neptune1p;
        chanceNum = parseInt($neptune1p.classList[2].substr(6,1));
    } else if(Planet === 'neptune' && opponentTurn === 'turn1P'){
        skillPlanetTag = $neptune2p;
        chanceNum = parseInt($neptune2p.classList[2].substr(6,1));
    }

    skillPlanetTag.classList.replace(`chance${chanceNum}`, `chance${chanceNum-1}`);
}

function skillChessMan(event, skillPlanet, turnNum, $cell){
    let isfinishedSkill = false;
    
    const turn = (turnNum === 1) ? 'turn1P' : 'turn2P';
    const opponentTurn = (turnNum === 1) ? 'turn2P' : 'turn1P';
    let attackedTag;
    let rowIndex;
    let cellIndex;
    
    let selectedPlanet;
    
    let randomValue;
    let change = false;
    
    if(skillPlanet !== 'neptune'){
        attackedTag = event.target.parentNode;
        rowIndex = parseInt(attackedTag.parentNode.classList[0].substr(3,1));
        cellIndex = parseInt(attackedTag.classList[0].substr(4,1));
    }
    
    switch(skillPlanet){
        case 'sun': {
            if(attackedTag.classList.contains('life2')){ // PlutoAndMercury만 해당됨
                attackedTag.classList.replace('life2', 'life1');
            } else {
                attackedTag.classList.value = '';
                attackedTag.classList.add(`cell${cellIndex}`);
                
                data[rowIndex][cellIndex] = '';
            }
            
            isfinishedSkill = true;
            reduceSkillChanceNum('sun', opponentTurn);
            break;
        }
        case 'saturn': {
            while(change === false){
                randomValue = Math.floor(Math.random() * 99);
                if($cell[randomValue].classList.length === 1){
                    // 1이어야 빈 칸
                    $cell[randomValue].classList.add(attackedTag.classList[1]);
                    $cell[randomValue].classList.add(opponentTurn);
                    if(attackedTag.classList.contains('firstMove')){
                        $cell[randomValue].classList.add('firstMove');
                    }
                    if(attackedTag.classList.contains('life2')){ // PlutoAndMercury만 해당됨
                        $cell[randomValue].classList.add('life2');
                    } else if(attackedTag.classList.contains('life1')){
                        $cell[randomValue].classList.add('life1');
                    }
                    data[Math.floor(randomValue / 10)][randomValue % 10] = attackedTag.classList[1];
                    
                    attackedTag.classList.value = '';
                    attackedTag.classList.add(`cell${cellIndex}`);
                    
                    data[rowIndex][cellIndex] = '';
                    
                    change = true;
                    isfinishedSkill = true;
                }
            }
            
            reduceSkillChanceNum('saturn', opponentTurn);
            break;
        }
        case 'uranus': {
            attackedTag.classList.add('frozen');
            
            isfinishedSkill = true;
            reduceSkillChanceNum('uranus', opponentTurn);
            break;
        }
        case 'neptune': {
            let neptuneAttackedTag; // === NAT
            let NATRowIndex;
            let NATCellIndex;
            
            setTimeout(()=>{
                showPossibleSkillCell(skillPlanet, turnNum);
            }, 0)
            
            setTimeout(()=>{
                cancelAnotherSkillCell();
                for(let i=0; i<possibleCell.length; i++){
                    neptuneAttackedTag = possibleCell[i];
                    NATRowIndex = parseInt(possibleCell[i].parentNode.className.substr(3,1));
                    NATCellIndex = parseInt(possibleCell[i].classList[0].substr(4,1));
                    
                    selectedPlanet = neptuneAttackedTag.classList[1];
                    $chessBoard.children[NATRowIndex + turnNum].children[NATCellIndex].classList.add(selectedPlanet);
                    $chessBoard.children[NATRowIndex + turnNum].children[NATCellIndex].classList.add(opponentTurn);
                    
                    neptuneAttackedTag.classList.value = '';
                    neptuneAttackedTag.classList.add(`cell${NATCellIndex}`);
                    data[NATRowIndex + turnNum][NATCellIndex] = `${selectedPlanet}`;
                    data[NATRowIndex][NATCellIndex] = '';
                }
                reduceSkillChanceNum('neptune', opponentTurn);
            }, 3000)
            
            isfinishedSkill = true;
            break;
        }
    }
    
    // eventListener 제거
    cancelAnotherSkillCell();
    
    // 차례 변경
    if(isfinishedSkill){
        changingTurn = (changingTurn === 'turn1P') ? 'turn2P' : 'turn1P';
        if(changingTurn === 'turn1P'){
            $log1P.textContent = '1P turn';
            $log2P.textContent = '';
        } else {
            $log1P.textContent = '';
            $log2P.textContent = '2P turn';
        }
    }
}

for(let i=0; i<skills.length; i++){
    skills[i].addEventListener('mouseover', (event)=>{
        event.target.classList.add('mouseover');
    })
    skills[i].addEventListener('mouseout', (event)=>{
        event.target.classList.remove('mouseover');
    })
    skills[i].addEventListener('click', 
    function(event){skill(event, skills[i].classList[0], skills[i].classList[1])});
}

let usingSkill;
function skill(event, planet, turn){
    cancelAnotherClick();
    event.target.classList.add('click');
    usingSkill = false;
    switch(planet){
        case 'skill_Sun': {
            if((turn === 'turn1P' && $sun1p.classList.contains('chance0')) || (turn === 'turn2P' && $sun2p.classList.contains('chance0'))){
                return;
            }
            usingSkill = true;
            PossibleCell('sun', turn);
            break;
        }
        case 'skill_Saturn': {
            if((turn === 'turn1P' && $saturn1p.classList.contains('chance0')) || (turn === 'turn2P' && $saturn2p.classList.contains('chance0'))){
                return;
            }
            usingSkill = true;
            PossibleCell('saturn', turn);
            break;
        }
        case 'skill_Uranus': {
            if((turn === 'turn1P' && $uranus1p.classList.contains('chance0')) || (turn === 'turn2P' && $uranus2p.classList.contains('chance0'))){
                return;
            }
            usingSkill = true;
            PossibleCell('uranus', turn);
            break;
        }
        case 'skill_Neptune': {
            if((turn === 'turn1P' && $neptune1p.classList.contains('chance0')) || (turn === 'turn2P' && $neptune2p.classList.contains('chance0'))){
                return;
            }
            usingSkill = true;
            PossibleCell('neptune', turn);
            break;            
        }
    }
}