let socket;

class Client {
    constructor(name = '') {
        this.id = '';
        this.name = name;
        this.gameData = new GameData();
        this.players = []; // type client[]
        this.oponent = null; // current game oponent
    }

    initSocket = () => {
        socket = io.connect('http://192.168.137.104:8000');
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
        sendMessageToAllClients(socket, new MessagePayload(MessageType.GET_READY, { name: this.name, oponentName: this.oponent ? this.oponent.name : '', gameData: this.gameData }));
    }

    isReady = () => { return this.gameData.ready; }

    isMultiGameMode = () => {
        return this.gameData.gameMode === GameMode.MULTI_PLAYER;
    }

    isMyTurn = () => {
        return this.gameData.isMyTurn;
    }

    propagateName = (name) => {
        sendMessageToAllClients(socket, new MessagePayload(MessageType.PROPAGATE_NAME, name));
    }

    doMove = () => {
        if (!this.isMultiGameMode()) return;
        this.gameData.isMyTurn = false;
        sendMessageToAllClients(socket, new MessagePayload(MessageType.MOVE, { name: this.name, oponentName: this.oponent.name, gameData: this.gameData }));
    }

    listenMessages = () => {
        socket.on('gameMessage', message => this.handleMessage(message))
        socket.on('identificator', (message) => {
            console.log('Received id: ' + message.id);
            this.id ? '' : this.id = message.id;
        }); 
    }

    handleMessage = (message) => {
        console.log('Received message: ' + JSON.stringify(message));
        let playerName, oponentName, playerGameData;
        switch (getMessageType(message)) {
            case MessageType.PROPAGATE_NAME:
                playerName = message.payload; // !?
                console.log('Discover new player: ' + playerName);
                this.players.map(player => player.name).some(name => name === playerName) ? console.log('conflict!') : this.players.push(new Client(playerName));
                break;
            case MessageType.GET_READY: // who first gets message gets paired with message sender!
                playerName = message.payload.name; // !?
                oponentName = message.payload.oponentName;
                console.log('GETRDY oponentName: ' + oponentName);
                playerGameData = message.payload.gameData; // !?

                this.players
                    .filter(player => player.name === playerName)
                    .forEach(player => player.gameData = playerGameData);

                if (this.isReady() && !oponentName) {
                    this.oponent = createOponent(playerName, playerGameData);
                    this.gameData.isMyTurn = true;
                    gameRunning = true;
                }

                break;

            case MessageType.MOVE: // updates information about player turn
                playerName = message.payload.name; // !?
                oponentName = message.payload.oponentName;
                playerGameData = message.payload.gameData;
                console.log('playerGameData: ' + JSON.stringify(playerGameData));
                console.log('MOVE oponentName: ' + oponentName);
                if (oponentName === this.name && !gameRunning) {
                    gameRunning = true;
                    this.oponent = createOponent(playerName, playerGameData);
                }
                else {
                    this.oponent.name = oponentName;
                    this.oponent.gameData = playerGameData;
                }
                this.gameData.isMyTurn = true;
                break;
            case MessageType.DISCONNECT:
                console.log('Client id: ' + this.oponent.id + ' disconnected');
                if (message.payload.clientId !== this.oponent.id) { return }
                this.oponent = null;
                noLoop();
                break;
            default:
                console.log('undefined messageType!');
                break;
        }
    }
}

const getMessageType = (message) => {
    return message.type;
}

const createOponent = (name, oponentGameData) => {
    let oponent = new Client(name);
    oponent.gameData = oponentGameData;
    return oponent;
}