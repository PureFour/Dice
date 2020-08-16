let throwCounter = 1;

const ThrowButton = {
    x: 530,
    y: 850,
    height: 50,
    width: 200,
    roundRadius: 25,
    show: () => {
        fill(throwCounter % 4 === 0 || client.isMultiGameMode() && !client.isMyTurn() ? 'red' : 'green');
        noStroke();
        rect(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height, ThrowButton.roundRadius);
        fill(0);
        textSize(30);
        text("Throw", ThrowButton.x + 55, 885);
    },
    handleClick: () => {
        if (mouseHitsObject(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height) && canThrowDice()) {
            Dice.throw();
            Table.updateTable();
            client.gameData.canLockPoint = true;
            // roll_sound.play();
        }
    },
    firstThrow: () => {
        return throwCounter % THROWS_COUNT === 2;
    },

    resetThrow: () => {
        throwCounter = 1;
    }
}

let singleGameModeButton, multiGameModeButton;

const GameModeButtons = { //TODO styling buttons
    show: () => {
        singleGameModeButton = createButton('SingleMode');
        multiGameModeButton = createButton('MultiMode');
        singleGameModeButton.position(400, 200);
        multiGameModeButton.position(564, 200);

        singleGameModeButton.mousePressed(() => {
            if (!client.name) { return }
            singleGameModeButton.hide();
            multiGameModeButton.hide();
            readyButton.hide();
            gameRunning = true;
        });

        multiGameModeButton.mousePressed(() => {
            if (!client.name) { return }
            singleGameModeButton.hide();
            multiGameModeButton.hide();
            client.setGameMode(GameMode.MULTI_PLAYER);
            client.propagateName(client.name);
        })
    }
}

let readyButton;

const ReadyButton = {
    show: () => {
        readyButton = createButton('Ready');
        readyButton.position(500, 200);
        readyButton.mousePressed(() => {
            if (client.gameData.gameMode === GameMode.MULTI_PLAYER) { // refactor!!!
                client.getReady();
                readyButton.hide();
            }
        })
    }
}
let oponentTableView = false;

const OponentTableButton = {
    x: 250,
    y: 850,
    height: 50,
    width: 250,
    roundRadius: 25,
    color: 'blue',
    show: () => {
        fill(OponentTableButton.color);
        noStroke();
        rect(OponentTableButton.x, OponentTableButton.y, OponentTableButton.width, OponentTableButton.height, OponentTableButton.roundRadius);
        fill(0);
        textSize(30);
        text("Oponent Table", OponentTableButton.x + 20, 885);
    },
    handleClick: () => {
        if (mouseHitsObject(OponentTableButton.x, OponentTableButton.y, OponentTableButton.width, OponentTableButton.height)) {
            oponentTableView = !oponentTableView;
            OponentTableButton.color = oponentTableView ? 'red' : 'blue';
        }
    }
}