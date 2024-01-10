const $startScreen = document.querySelector("#start-screen");
const $gameMenu = document.querySelector("#game-menu");
const $battleMenu = document.querySelector("#battle-menu");
const $heroName = document.querySelector("#hero-name");
const $heroLevel = document.querySelector("#hero-level");
const $heroHp = document.querySelector("#hero-hp");
const $heroXp = document.querySelector("#hero-xp");
const $heroAtt = document.querySelector("#hero-att");
const $monsterName = document.querySelector("#monster-name");
const $monsterHp = document.querySelector("#monster-hp");
const $monsterAtt = document.querySelector("#monster-att");
const $message = document.querySelector("#message");

class Game {
    constructor(name) {
        this.monster = null; // 이 때 this는 해당 Game 객체를 가리킴
        this.hero = null;
        this.monsterList = [
            { name: '슬라임', hp: 25, minAtt: 5, maxAtt:25, xp: 10 },
            { name: '스켈레톤', hp: 50, minAtt: 20, maxAtt:50, xp: 30 },
            { name: '마왕', hp: 100, minAtt: 40, maxAtt:100, xp: 80 },
        ];
        this.start(name);
    }

    start(name) {
        $gameMenu.addEventListener('submit', this.onGameMenuInput);
        $battleMenu.addEventListener('submit', this.onBattleMenuInput);
        this.changeScreen('game');
        this.hero = new Hero(this, name); // 이 때의 this는 game 객체를 보관하기 위해
        this.updateHeroStat();
    }

    changeScreen(screen) {
        if(screen === 'start') {
            $startScreen.style.display = 'flex';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'none';
        } else if (screen === 'game') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'block';
            $battleMenu.style.display = 'none';
        } else if (screen === 'battle') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'block';
        }
    }

    onGameMenuInput = (event) => {
        // addEventListener는 콜백함수의 this를 바꿔버리기 때문에
        // addEventListener의 콜백함수인 onGameMenuInput은 기존의 this를 유지하기 위해
        // 화살표 함수를 사용하여 선언해야 한다.
        // 만약 함수 선언문으로 하면 this가 $gameMenu로 바뀐다.
        event.preventDefault();
        const input = event.target['menu-input'].value;
        if (input === '1') { // 모험
            this.changeScreen('battle');
            const randomIndex = Math.floor(Math.random()*this.monsterList.length);
            const ramdomMonster = this.monsterList[randomIndex];
            this.monster = new Monster(
                this, 
                ramdomMonster.name, 
                ramdomMonster.hp, 
                ramdomMonster.minAtt,
                ramdomMonster.maxAtt,
                ramdomMonster.xp,
            );
            this.updateMonsterStat();
            this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
        } 
        else if (input === '2') { // 휴식
            this.hero.hp = this.hero.maxHp;
            this.updateHeroStat();
            this.showMessage('충분한 휴식을 취했다.');
        }
        else if (input === '3') { // 종료
            this.showMessage(' ');
            this.quit();
        }
    }

    onBattleMenuInput = (event) => {
        // addEventListener는 콜백함수의 this를 바꿔버리기 때문에
        // addEventListener의 콜백함수인 onBattleMenuInput은 기존의 this를 유지하기 위해
        // 화살표 함수를 사용하여 선언해야 한다.
        // 만약 함수 선언문으로 하면 this가 $battleMenu로 바뀐다.
        event.preventDefault();
        const input = event.target['battle-input'].value;
        if (input === '1') { // 공격
            const { hero, monster } = this; // const hero = this.hero; const monster = this.monster;
            hero.attack(monster);
            monster.attack(hero);
            if(hero.hp <= 0) {
                this.quit();
            } else if (monster.hp <= 0) {
                this.showMessage(`몬스터를 잡아 ${monster.xp} 경험치를 얻었다.`);
                hero.getXp(monster.xp);
                this.monster = null;
                this.changeScreen('game');
            } else {
                this.showMessage(`${hero.att}의 데미지를 주고, ${monster.att}의 데미지를 받았다.`);
            }
            this.updateHeroStat();
            this.updateMonsterStat();
        } 
        else if (input === '2') { // 회복
            const { hero, monster } = this;
            hero.hp = Math.min(hero.maxHp, hero.hp + 20); 
            // hero.maxHp와 hero.hp + 20 중 더 작은 값을 고름
            monster.attack(hero);
            this.showMessage('체력을 조금 회복했다!');
            this.updateHeroStat();
        }
        else if (input === '3') { // 도망
            this.changeScreen('game');
            this.showMessage('부리나케 도망쳤다!');
            this.monster = null;
            this.updateMonsterStat();
        }
    }

    updateHeroStat() {
        const { hero } = this; // const hero = this.hero;
        if (hero === null) {
            // null인 경우 : 전사했을 때
            $heroName.textContent = '';
            $heroLevel.textContent = '';
            $heroHp.textContent = '';
            $heroXp.textContent = '';
            $heroAtt.textContent = '';
            return;
        }
        $heroName.textContent = hero.name;
        $heroLevel.textContent = `${hero.lev}Lev`;
        $heroHp.textContent = `HP : ${hero.hp}/${hero.maxHp}`;
        $heroXp.textContent = `XP : ${hero.xp}/${15*hero.lev}`;
        $heroAtt.textContent = `ATTACK(공격력) : ${hero.att}`;
    }

    updateMonsterStat() {
        const { monster } = this; // const hero = this.hero;
        if (monster === null) {
            $monsterName.textContent = '';
            $monsterHp.textContent = '';
            $monsterAtt.textContent = '';
            return;
        }
        $monsterName.textContent = monster.name;
        $monsterHp.textContent = `HP : ${monster.hp}/${monster.maxHp}`;
    }

    showMessage(text) {
        $message.textContent = text;
    }

    quit() {
        this.hero = null;
        this.monster = null;
        this.updateHeroStat();
        this.updateMonsterStat();
        $gameMenu.removeEventListener('submit', this.onGameMenuInput);
        $battleMenu.removeEventListener('submit', this.onBattleMenuInput);
        this.changeScreen('start');
        game = null;
    }
}

class Unit {
    constructor(game, name, hp, xp) { // 이 때 this는 해당 객체를 가리킴
        this.game = game; // this.game으로 game 객체에 접근할 수 있음
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.xp = xp;
    }
    attack(target) {
        target.hp -= this.att;
    }
}

class Hero extends Unit {
    constructor(game, name) {
        super(game, name, 100, 0); // 부모 클래스의 생성자 호출
        this.att = 10;
        this.lev = 1; // 그 외 속성
    }

    getXp(xp) {
        this.xp += xp;
        if(this.xp >= this.lev * 15) {
            // 경험치를 다 채우면
            this.xp -= this.lev * 15;
            this.lev += 1;
            this.maxHp += 5;
            this.att += 5;
            this.hp = this.maxHp;
            this.game.showMessage(`레벨업! 레벨 ${this.lev}`);
            // this.game을 사용해 game 객체의 showMessage 메소드 사용
        }
    }
}

class Monster extends Unit {
    constructor(game, name, hp, minAtt, maxAtt, xp) {
        super(game, name, hp, xp);
        this.minAtt = minAtt;
        this.maxAtt = maxAtt;
        this.att = null;
    }

    attack(target) {
        this.att = Math.floor(Math.random() * (this.maxAtt - this.minAtt)) + this.minAtt;
        super.attack(target);
    }
}

let game = null;
$startScreen.addEventListener("submit", (event) => {
    event.preventDefault(); // 새로고침 X
    const name = event.target['name-input'].value;
    game = new Game(name); // 새로운 객체 생성
});