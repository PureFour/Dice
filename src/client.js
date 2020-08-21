let socket;

class Client {
  constructor(name = "") {
    this.id = "";
    this.name = name;
    this.gameData = new GameData();
    this.players = []; // type client[] all game (lobby) players
    this.oponent = null; // current game oponent
  }

  initSocket = () => {
    socket = io.connect(SERVER_URL);
  };

  setGameMode = (mode) => {
    if (mode == GameMode) {
      console.log("Available modes: SINGLE_PLAYER, MULTI_PLAYER");
      return;
    }

    this.gameData.gameMode = mode;
  };

  getReady = () => {
    this.gameData.ready = true;
    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.GET_READY, {
        id: this.id,
        gameData: this.gameData,
      })
    );
  };

  isReady = () => {
    return this.gameData.ready;
  };

  isMultiGameMode = () => {
    return this.gameData.gameMode === GameMode.MULTI_PLAYER;
  };

  isMyTurn = () => {
    return this.gameData.isMyTurn;
  };

  propagateName = (name) => {
    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.PROPAGATE_NAME, {
        name: name,
        id: this.id,
      })
    );
  };

  fetchOtherClientsNames = () => {
    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.FETCH_NAMES, { id: this.id })
    );
  };

  sendUpdate = () => {
    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.UPDATE_PLAYER_DATA, {
        id: this.id,
        playerGameData: this.gameData,
      })
    );
  };

  doMove = () => {
    if (!this.isMultiGameMode()) return;
    this.gameData.isMyTurn = false;
    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.MOVE, {
        id: this.id,
        oponentId: this.oponent ? this.oponent.id : "",
        gameData: this.gameData,
      })
    );
  };

  seekForOponent = () => {
    const oponent = this.players.find((p) => p.gameData.ready);

    if (!oponent || this.oponent) return;

    this.oponent = oponent;

    sendMessageToAllClients(
      socket,
      new MessagePayload(MessageType.SEEK_FOR_OPONENT, {
        id: this.id,
        name: this.name,
        oponentId: oponent.id,
        gameData: this.gameData,
      })
    );
  };

  listenMessages = () => {
    socket.on("gameMessage", (message) => this.handleMessage(message));
    socket.on("identificator", (message) => {
      console.log("Received id: " + message.id);
      this.id ? "" : (this.id = message.id);
    });
  };

  handleMessage = (message) => {
    console.log("Received message: " + JSON.stringify(message));
    let playerId, oponentId, playerGameData, playerName;
    switch (getMessageType(message)) {
      case MessageType.PROPAGATE_NAME:
        playerName = message.payload.name;
        playerId = message.payload.id;
        console.log("Discover new player: " + playerName);
        if (
          this.players
            .map((player) => player.name)
            .some((name) => name === playerName)
        )
          return;

        const player = new Client(playerName);
        player.id = playerId;
        this.players = addPlayer(player, this.players);
        break;

      case MessageType.UPDATE_PLAYER_DATA:
        playerId = message.payload.id;
        playerGameData = message.payload.playerGameData;
        updatePlayer(playerId, playerGameData, this.players);
        break;

      case MessageType.FETCH_NAMES:
        this.propagateName(this.name);
        break;

      case MessageType.GET_READY: // who first gets message gets paired with message sender!
        playerId = message.payload.id;
        console.log("GETRDY playerId: " + playerId);
        playerGameData = message.payload.gameData;

        this.players
          .filter((player) => player.id === playerId)
          .forEach((player) => (player.gameData = playerGameData));

        if (this.isReady() && !this.oponent) {
          this.seekForOponent();
        }

        break;

      case MessageType.SEEK_FOR_OPONENT:
        if (message.payload.oponentId !== this.id) return;
        this.gameData.inGame = true;
        this.gameData.ready = false;
        if (this.oponent) {
          gameRunning = true;
        } else {
          this.oponent = createOponent(
            message.payload.name,
            message.payload.gameData
          );
          gameRunning = true;
          this.gameData.isMyTurn = true;
          this.seekForOponent();
          console.log("ReSeeking...");
        }
        this.sendUpdate();
        break;
      case MessageType.MOVE: // updates information about player turn
        playerId = message.payload.id;
        oponentId = message.payload.oponentId;
        if (this.id !== oponentId || playerId !== this.oponent.id) return;
        console.log("My TURN!");
        playerGameData = message.payload.gameData;

        this.oponent.gameData = playerGameData;
        this.gameData.isMyTurn = true;
        break;
      case MessageType.DISCONNECT:
        console.log("Client id: " + message.payload.clientId + " disconnected");
        this.players = this.players.filter(
          (p) => p.id !== message.payload.clientId
        );
        if (this.oponent && message.payload.clientId !== this.oponent.id) {
          return;
        }
        this.oponent = null;
        this.gameData.inGame = false; // reset game state! return to lobby
        // noLoop();
        break;
      default:
        console.log("undefined messageType!");
        break;
    }
  };
}

const getMessageType = (message) => {
  return message.type;
};

const createOponent = (name, oponentGameData) => {
  let oponent = new Client(name);
  oponent.gameData = oponentGameData;
  return oponent;
};

const addPlayer = (player, players) => {
  players.push(player);
  return players.filter((player) => player.name && player.id);
};

const updatePlayer = (playerId, playerGameData, players) => {
  players.forEach((p, index) => {
    if ((p) => p.id === playerId) {
      players[index].gameData = playerGameData;
    }
  });
};
