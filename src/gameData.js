const GameMode = {
    SINGLE_PLAYER: 'SINGLE_PLAYER',
    MULTI_PLAYER: 'MULTI_PLAYER'
}

class GameData {
    constructor() { //columns etc...
        this.gameMode = GameMode.SINGLE_PLAYER;
        this.ready = false;
        this.isMyTurn = false; // refactor!!!

        this.totalSum = 200;
        this.canLockPoint = true;

        this.firstColumn = [];
        this.secondColumn = [];
    }
}