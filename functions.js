const getRandomDiceValue = () => {
  return Math.floor(Math.random() * DICE_MAX_VALUE + 1);
};

const mouseHitsObject = (x, y, width, height) => {
  return (
    mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + height
  );
};

const canThrowDice = () => {
  if (client.isMultiGameMode()) {
    return throwCounter % (THROWS_COUNT + 1) !== 0 && client.isMultiGameMode() && client.isMyTurn();
  }
  return throwCounter % (THROWS_COUNT + 1) !== 0;
}

const getCurrentPlayer = () => {
  if (client.isMultiGameMode() && client.oponent && !client.isMyTurn()) {
    return client.oponent;
  }
  return client;
}

const showOponentTable = () => { //refactor!!
  if (!client.isMultiGameMode() || !client.oponent || !oponentTableView) {
    return;
  }
  const oponent = client.oponent;
  const oponentFirstColumn = oponent.gameData.firstColumn;
  const oponentSecondColumn = oponent.gameData.secondColumn;
  const oponentTotalSum = oponent.gameData.totalSum;

  fill(255, 255, 200);
  rect(400, 50, 460, 755);
  fill(COLORS.tableTextColor);
  for (let i = 0; i < SchemeFinders.length; i++) {
    let firstColumnCell = oponentFirstColumn[i];
    let secondColumnCell = oponentSecondColumn[i];
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
  text("SUM" + '\t' + ' '.repeat(27) + oponentTotalSum, 420, 770);
}