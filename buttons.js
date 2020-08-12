let throwCounter = 1;

const ThrowButton = {
    x: 530,
    y: 850,
    height: 50,
    width: 200,
    roundRadius: 25,
    show: () => {
        fill(throwCounter % 4 === 0 ? 'red' : 'green');
        noStroke();
        rect(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height, ThrowButton.roundRadius);
        fill(0);
        textSize(30);
        text("Throw", ThrowButton.x + 55, 885);
    },
    handleClick: () => {
        if (mouseHitsObject(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height) && throwCounter % (THROWS_COUNT + 1) !== 0) {
            Dice.throw();
            Table.updateTable();
            canLockPoint = true;
            roll_sound.play();
        }
    },
    firstThrow: () => {
        return throwCounter % THROWS_COUNT === 2;
    },

    resetThrow: () => {
        throwCounter = 1;
    }
}