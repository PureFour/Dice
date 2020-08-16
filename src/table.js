// let firstColumn;
// let secondColumn;
// let totalSum;
// let canLockPoint;

const Table = {

    updatePlayerVariables: () => {
        firstColumn = client.gameData.firstColumn;
        secondColumn = client.gameData.secondColumn;
        totalSum = client.gameData.totalSum;
        canLockPoint = client.gameData.canLockPoint;
    },

    initTable: () => {
        // Table.updatePlayerVariables();

        for (let i = 0; i < TABLE_CELLS_COUNT; i++) {
            client.gameData.firstColumn.push(new TableCell(610, 75 + i * 35));
            client.gameData.secondColumn.push(new TableCell(750, 75 + i * 35));
        }
    },


    show: () => {
        if (client.gameData.gameMode == GameMode.MULTI_PLAYER) {
            fill(client.isMyTurn() ? 'blue' : 'black');
            textSize(30);
            let name = client.isMyTurn() ? client.name : client.oponent.name;
            text("Current Player: " + name, 30, 80);
        }

        fill(255);
        rect(400, 50, 460, 755);
        fill(COLORS.tableTextColor);
        for (let i = 0; i < SchemeFinders.length; i++) {
            let firstColumnCell = client.gameData.firstColumn[i];
            let secondColumnCell = client.gameData.secondColumn[i];
            if (i < 6) {
                textSize(24);
                fill(0);
                text(i + 1 + ' '.repeat(25), 420, 75 + i * 35);
                fill(firstColumnCell.locked ? 0 : firstColumnCell.color);
                text(firstColumnCell.value, 610, 75 + i * 35);
                fill(secondColumnCell.locked ? 0 : secondColumnCell.color);
                text(secondColumnCell.value, 750, 75 + i * 35);
            } else {
                textSize(24);
                const name = SchemeFinders[i].name;
                fill(0);
                text(name + '\t' + ' '.repeat(40 - name.length), 420, 75 + i * 35);
                fill(firstColumnCell.locked ? 0 : firstColumnCell.color);
                text(firstColumnCell.value, 610, 75 + i * 35);
                fill(secondColumnCell.locked ? 0 : secondColumnCell.color);
                text(secondColumnCell.value, 750, 75 + i * 35);
            }
        }

        fill(COLORS.red);
        text("SUM" + '\t' + ' '.repeat(27) + client.gameData.totalSum, 420, 770);
    },

    updateTable: () => {
        const diceValues = dice.map(dice => dice.value);
        calculateEachDiceCount(diceValues);

        for (let i = 0; i < SchemeFinders.length; i++) {
            if (i === 6) {
                client.gameData.firstColumn[i].value = schoolBonuses[0];
                client.gameData.secondColumn[i].value = schoolBonuses[1];
                continue;
            }
            const schemeFinder = SchemeFinders[i];
            let currentValue, currentValue2 = 0;
            if (i < 7) {
                currentValue = schemeFinder(i + 1, 1);
                currentValue2 = schemeFinder(i + 1, 2);
            } else {
                currentValue = schemeFinder();
            }

            if (ThrowButton.firstThrow()) currentValue = handleDoublePoints(currentValue, schemeFinder);
            if (!client.gameData.firstColumn[i].locked) { client.gameData.firstColumn[i].value = currentValue; }
            if (!client.gameData.secondColumn[i].locked) { client.gameData.secondColumn[i].value = currentValue2 ? currentValue2 : currentValue; }
        }
    },

    handleClick: () => {
        if (!client.gameData.canLockPoint || client.gameData.gameMode === GameMode.MULTI_PLAYER && !client.gameData.isMyTurn || oponentTableView) { return } //refactor!!

        const shift = 27;
        let moved = false;

        for (let i = 0; i < TABLE_CELLS_COUNT; i++) {
            const firstColumnCell = client.gameData.firstColumn[i];
            const secondColumnCell = client.gameData.secondColumn[i];

            if (i === 6) continue;

            if (mouseHitsObject(firstColumnCell.x, firstColumnCell.y - shift, firstColumnCell.width, firstColumnCell.height) && !firstColumnCell.locked) {
                firstColumnCell.locked = true;
                moved = true;
                break;
            }
            else if (mouseHitsObject(secondColumnCell.x, secondColumnCell.y - shift, secondColumnCell.width, secondColumnCell.height) && !secondColumnCell.locked) {
                secondColumnCell.locked = true;
                moved = true;
                break;
            }
        }

        if (moved) {
            client.gameData.totalSum = calculateColumnSum(client.gameData.firstColumn, 1) + calculateColumnSum(client.gameData.secondColumn, 2);
            calculateBonus();
            client.gameData.canLockPoint = false;
            ThrowButton.resetThrow();
            client.doMove();
        }
    },

    handleTableMouseOver: () => {
        const shift = 27;

        for (let i = 0; i < TABLE_CELLS_COUNT; i++) {
            const firstColumnCell = client.gameData.firstColumn[i];
            const secondColumnCell = client.gameData.secondColumn[i];

            if (i === 6) continue;
            if (mouseHitsObject(firstColumnCell.x, firstColumnCell.y - shift, firstColumnCell.width, firstColumnCell.height)) {
                client.gameData.firstColumn[i].color = COLORS.red;
            }
            else if (mouseHitsObject(secondColumnCell.x, secondColumnCell.y - shift, secondColumnCell.width, secondColumnCell.height)) {
                client.gameData.secondColumn[i].color = COLORS.red;
            } else {
                client.gameData.firstColumn[i].color = COLORS.tableTextColor;
                client.gameData.secondColumn[i].color = COLORS.tableTextColor;
            }
        }
    }

}