let throwCounter = 1;

//TODO refactor!

const getRandomDiceValue = () => {
  return Math.floor(Math.random() * DICE_COUNT) + 1;
};

const throwDice = (dice) => {
  if (dice.length === 0 || allMarked(dice) || throwCounter % THROWS_COUNT == 1) {
    for (let i = 0; i < DICE_COUNT; i++) {
      dice.splice(i, 1, new Dice(150, 150 + i * 110, 100));
    }
    throwCounter++;
  } else {
    reThrowNotMarked(dice);
  }
};

const resetThrow = () => {
  throwCounter = 1;
}

const allMarked = (dice) => {
  return !dice.some((dice) => dice.marked);
};

const reThrowNotMarked = (dice) => {
  let thrown = false;
  for (let i = 0; i < dice.length; i++) {
    if (!dice[i].marked) {
      dice.splice(i, 1, new Dice(dice[i].x, dice[i].y, dice[i].size));
      thrown = true;
    }
  }
  thrown ? throwCounter++ : "";
};

const mouseHitsObject = (x, y, width, height) => {
  return (
    mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + height
  );
};

const firstThrow = () => {
  return throwCounter % THROWS_COUNT === 2;
}