let client;
let gameRunning = false;

// function preload() {
//   roll_sound = loadSound("sound/rolling_dice_sound.wav");
// }

function setup() {
  createCanvas(960, 960);
  client = new Client();
  client.initSocket();
  client.listenMessages();
  Table.initTable();
  NameSubmitForm.show();
  GameModeButtons.show();
  ReadyButton.show();
}

function draw() {
  background(53, 101, 77);
  if (gameRunning) {
    ThrowButton.show();
    OponentTableButton.show();
    oponentTableView ? showOponentTable() : Table.show();
    Table.handleTableMouseOver();
    Dice.showGrid();
  } else {
    showLobby();
  }
}

function touchStarted() {
  if (gameRunning) {
    Dice.handleClick();
    ThrowButton.handleClick();
    Table.handleClick();
    OponentTableButton.handleClick();
  }
}

const showLobby = () => {
  const welcomeMessage = client.name ? "Welcome " + client.name + ' :)' : "Enter your name";
  const nameConflictLabel = "This name is already taken! :(";
  fill(255);
  textSize(40);
  text(welcomeMessage, 365, 100);

  fill('red');
  textSize(20);
  text(nameConflictWarning ? nameConflictLabel : '', 375, 130);

  if (client.gameData.gameMode === GameMode.MULTI_PLAYER) {
    fill(255);
    textSize(35);
    text("Connected players", 365, 250);

    if (client.players.length <= 0) {
      fill(0);
      textSize(25);
      text("Waiting for at least one player...", 350, 350);
    }

    for (let i = 0; i < client.players.length; i++) {
      const player = client.players[i];
      const inGameLabel = player.gameData.inGame ? " (In Game)" : '';
      fill(player.isReady() ? 'green' : 'red');
      textSize(25);
      text(player.name + inGameLabel, 370, 300 + (i * 50));
    }
  }
}