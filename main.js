let dice = [];
let currentPoints = [];
let currentPoints2 = [];

function preload() {
  roll_sound = new Audio("sound/rolling_dice_sound.wav");
}

function setup() {
  createCanvas(960, 1760);
}

function draw() {
  background(53, 101, 77);
  showDiceGrid();
  showThrowButton();
  showTable();
  dice.forEach((el) => el.show());
}

function touchStarted() {
  for (let i = 0; i < dice.length; i++) {
    if (mouseHitsObject(dice[i].x, dice[i].y, dice[i].size, dice[i].size)) {
      dice[i].mark();
    }
  }

  if (mouseHitsObject(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height)) {
    throwDice(dice);
    updateTable();
    // roll_sound.play();
  }
}

const showDiceGrid = () => {
  for (let i = 0; i < DICE_COUNT; i++) {
    rect(150, 150 + i * 110, 100, 100);
    noFill();
    stroke(255);
  }
};

const showThrowButton = () => {
  fill(0, 0, 255);
  noStroke();
  rect(ThrowButton.x, ThrowButton.y, ThrowButton.width, ThrowButton.height, ThrowButton.roundRadius);
  fill(255);
  textSize(20);
  let count = (throwCounter % THROWS_COUNT) + 1;
  text("Throw " + count, width / 2 - 40, 880);
};

const showTable = () => {

  fill(255);
  rect(400, 150, 460, 655);
  fill(COLORS.tableTextColor);
  for (let i = 0; i < SchemeFinders.length; i++) {
    let currentPointsValue = currentPoints[i] === undefined ? '' : currentPoints[i];
    if (i < 6) {
      textSize(24);
      fill(0);
      text(i + 1 + ' '.repeat(25), 420, 170 + i * 35);
      fill(COLORS.tableTextColor);
      text(currentPointsValue, 610, 170 + i * 35);
    }
    else {
      textSize(24);
      const name = SchemeFinders[i].name;
      // console.log('name: ' + name.length);
      fill(0);
      text(name + '\t' + ' '.repeat(40 - name.length), 420, 170 + i * 35);
      fill(COLORS.tableTextColor);
      text(currentPointsValue, 610, 170 + i * 35);
      // noFill();
      // stroke(0);
      // rect(595, i * 35 - 100, 35, 35);
    }
  }
}

const updateTable = () => {
  currentPoints = [];
  SchemeFinders.forEach(scheme => currentPoints.push(0));

  const diceValues = dice.map(dice => dice.value);
  calculateEachDiceCount(diceValues);

  for (let i = 0; i < SchemeFinders.length; i++) {
    let currentValue = i < 6 ? SchemeFinders[i](i + 1) : SchemeFinders[i]();
    currentValue = SchemeFinders[i]();
    if (!currentValue) { continue; }
    currentPoints[i] = currentValue;
  }
}