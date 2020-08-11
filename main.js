let dice = [];
let currentPoints = [];  // {value: number, locked: boolean, color: string}
let currentPoints2 = []; // {value: number, locked: boolean, color: string}
let firstColumnSum = 0;
let secondColumnSum = 0;
let canLockPoint = true;

function preload() {
  roll_sound = new Audio("sound/rolling_dice_sound.wav");
}

function setup() {
  createCanvas(960, 960);
  fillTableCurrentPoints();
}

function draw() {
  background(53, 101, 77);
  showDiceGrid();
  showThrowButton();
  showTable();
  handleTableMouseOver();
  dice.forEach((el) => el.show());
}

function touchStarted() {
  for (let i = 0; i < dice.length; i++) {
    if (mouseHitsObject(dice[i].x, dice[i].y, dice[i].size, dice[i].size)) {
      dice[i].mark();
    }
  }

  if (mouseHitsObject(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height) && throwCounter % 4 !== 0) {
    throwDice(dice);
    updateTable();
    canLockPoint = true;
    roll_sound.play();
  }

  handleTableClick();
}

const showDiceGrid = () => {
  stroke(255);
  noFill();
  for (let i = 0; i < DICE_COUNT; i++) {
    rect(150, 150 + i * 110, 100, 100);
    noFill();
    stroke(255);
  }
};

const showThrowButton = () => {
  fill(throwCounter % 4 === 0 ? 'red' : 'green');
  noStroke();
  rect(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height, ThrowButton.roundRadius);
  fill(0);
  textSize(30);
  text("Throw", ThrowButton.x + 55, 885);
};

const showTable = () => {

  fill(255);
  rect(400, 50, 460, 755);
  fill(COLORS.tableTextColor);
  for (let i = 0; i < SchemeFinders.length; i++) {
    let currentPointsValue = currentPoints[i] === undefined ? '' : currentPoints[i];
    let currentPointsValue2 = currentPoints2[i] === undefined ? '' : currentPoints2[i];
    if (i < 6) {
      textSize(24);
      fill(0);
      text(i + 1 + ' '.repeat(25), 420, 75 + i * 35);
      fill(currentPointsValue.locked ? 0 : currentPointsValue.color);
      text(currentPointsValue.value, 610, 75 + i * 35);
      fill(currentPointsValue2.locked ? 0 : currentPointsValue2.color);
      text(currentPointsValue2.value, 750, 75 + i * 35);
    } else {
      textSize(24);
      const name = SchemeFinders[i].name;
      fill(0);
      text(name + '\t' + ' '.repeat(40 - name.length), 420, 75 + i * 35);
      fill(currentPointsValue.locked ? 0 : currentPointsValue.color);
      text(currentPointsValue.value, 610, 75 + i * 35);
      fill(currentPointsValue2.locked ? 0 : currentPointsValue2.color);
      text(currentPointsValue2.value, 750, 75 + i * 35);
    }
  }

  fill(0);
  text("Sum " + ' '.repeat(20) + firstColumnSum + ' '.repeat(19) + secondColumnSum, 420, 780); // mb move to schemeFinders?
}

const calculateSum = (currentPoints) => {
  let tableSum = currentPoints
    .filter(p => p.locked && !isNaN(p.value))
    .map(p => p.value)
    .reduce((prev, next) => prev + next, 0);


  let zerosCount = 0;
  for (let i = 6; i < currentPoints.length; i++) {
    let p = currentPoints[i];
    if (p.locked && p.value === 0) {
      zerosCount++;
    }
  }


  let bonusMultiplier = 2 - zerosCount;
  if (bonusMultiplier < 0) bonusMultiplier = 0;

  return tableSum + 50 * bonusMultiplier; // TODO schoolBonus!!!
}

const fillTableCurrentPoints = () => {
  currentPoints, currentPoints2 = [];
  SchemeFinders.forEach(scheme => {
    currentPoints.push({ value: 0, locked: false, color: COLORS.tableTextColor });
    currentPoints2.push({ value: 0, locked: false, color: COLORS.tableTextColor });
  });
}

const updateTable = () => {
  const diceValues = dice.map(dice => dice.value);
  calculateEachDiceCount(diceValues);

  for (let i = 0; i < SchemeFinders.length; i++) {
    const schemeFinder = SchemeFinders[i];
    let currentValue, currentValue2 = 0;
    if (i < 7) {
      currentValue = schemeFinder(i + 1, 1);
      currentValue2 = schemeFinder(i + 1, 2);
    } else {
      currentValue = schemeFinder();
    }

    if (firstThrow()) currentValue = handleDoublePoints(currentValue, schemeFinder);
    if (!currentPoints[i].locked) { currentPoints[i].value = currentValue; }
    if (!currentPoints2[i].locked) { currentPoints2[i].value = currentValue2 ? currentValue2 : currentValue; }
  }
}

const handleTableClick = () => {
  if (!canLockPoint) { return }

  for (let i = 0; i < SchemeFinders.length; i++) {
    if (i === 6) continue;

    if (mouseHitsObject(610, 60 + i * 35, 35, 35) && !currentPoints[i].locked) {
      currentPoints[i].locked = true;
      canLockPoint = false;
      resetThrow(dice);
      break;
    }
    else if (mouseHitsObject(750, 60 + i * 35, 35, 35) && !currentPoints2[i].locked) {
      currentPoints2[i].locked = true;
      resetThrow(dice);
      canLockPoint = false;
      break;
    }
  }

  firstColumnSum = calculateSum(currentPoints);
  secondColumnSum = calculateSum(currentPoints2);

  calculateBonus(currentPoints, currentPoints2);
}

const handleTableMouseOver = () => {
  for (let i = 0; i < SchemeFinders.length; i++) {
    if (i === 6) continue;
    if (mouseHitsObject(610, 60 + i * 35, 35, 35)) {
      currentPoints[i].color = COLORS.red;
    }
    else if (mouseHitsObject(750, 60 + i * 35, 35, 35)) {
      currentPoints2[i].color = COLORS.red;
    } else {
      currentPoints[i].color = COLORS.tableTextColor;
      currentPoints2[i].color = COLORS.tableTextColor;
    }
  }
}

const handleDoublePoints = (points, schemeFinder) => {
  if (!points || bonusExcludeList.includes(schemeFinder.name)) {
    return points;
  }

  return points * 2;
}