let throwCounter = 0;

const getRandomDiceValue = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const throwDice = (dice) => {
  if (dice.length === 0 || allMarked(dice) || throwCounter % 3 == 0) {
    for (let i = 0; i < 6; i++) {
      dice.splice(i, 1, new Dice(150 + i * 110, 150, 100));
    }
    throwCounter++;
  } else {
    reThrowNotMarked(dice);
  }
};

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

const calculatePoints = (dice) => {
  let calculatedPoints = dice
    .filter((dice) => dice.marked)
    .map((dice) => dice.value)
    .reduce((prev, next) => prev + next, 0);
  return throwCounter % 3 === 1 ? calculatedPoints * 2 : calculatedPoints; 
};
