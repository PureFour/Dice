// after setting name, create two modes (single, multi-turn)...

class Client {
    constructor(name = '') {
        registerServiceWorker('service-worker.min.js');
        this.name = name;
        this.gameData = new GameData();
        this.players = []; // type client[]
        this.oponent = null; // current game oponent
    }

    setGameMode = (mode) => {
        if (mode == GameMode) {
            console.log("Available modes: SINGLE_PLAYER, MULTI_PLAYER");
            return;
        }

        this.gameData.gameMode = mode;
    }

    getReady = () => {
        this.gameData.ready = true;
        sendMessage(new MessagePayload(MessageType.GET_READY, { name: this.name, oponentName: this.oponent ? this.oponent.name : '', gameData: this.gameData }));
    }

    isReady = () => { return this.gameData.ready; }

    isMultiGameMode = () => {
        return this.gameData.gameMode === GameMode.MULTI_PLAYER;
    }

    isMyTurn = () => {
        return this.gameData.isMyTurn;
    }

    propagateName = (name) => {
        this.name = name;
        sendMessage(new MessagePayload(MessageType.PROPAGATE_NAME, name));
    }

    doMove = () => {
        this.gameData.isMyTurn = false;
        sendMessage(new MessagePayload(MessageType.MOVE, { name: this.name, oponentName: this.oponent.name, gameData: this.gameData }));
    }

    listenMessages = () => {
        listenMessage((message) => {
            this.handleMessage(message);
        })
    }

    handleMessage = (message) => {
        // console.log('Received message: ' + JSON.stringify(message));
        let oponentName, name, playerGameData;
        switch (getMessageType(message)) {
            case MessageType.PROPAGATE_NAME:
                const playerName = message.message.payload; // !?
                this.players.map(player => player.name).some(name => name === playerName) ? console.log('conflict!') : this.players.push(new Client(playerName));
                break;
            case MessageType.GET_READY: // who first gets message gets paired with message sender!
                name = message.message.payload.name; // !?
                oponentName = message.message.payload.oponentName;
                console.log('GETRDY oponentName: ' + oponentName);
                playerGameData = message.message.payload.gameData; // !?

                this.players
                    .filter(player => player.name === name)
                    .forEach(player => player.gameData = playerGameData);

                if (this.isReady() && !oponentName) {
                    this.oponent = createOponent(name, playerGameData);
                    this.gameData.isMyTurn = true;
                    gameRunning = true;
                }

                break;

            case MessageType.MOVE: // updates information about player turn
                name = message.message.payload.name; // !?
                oponentName = message.message.payload.oponentName;
                playerGameData = message.message.payload.gameData;
                console.log('MOVE oponentName: ' + oponentName);
                if (oponentName === this.name && !gameRunning) {
                    gameRunning = true; 
                    this.oponent = createOponent(name, playerGameData);
                }
                this.gameData.isMyTurn = true;
                break;
            default:
                console.log('undefined messageType!');
                break;
        }
    }
}

const getMessageType = (messageObject) => {
    return messageObject.message.messageType;
}

const createOponent = (name, oponentGameData) => {
    let oponent = new Client(name);
    oponent.gameData = oponentGameData;
    return oponent;
}