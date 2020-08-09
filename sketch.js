let dice = [];

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
  showCalculatedPoints();
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
    roll_sound.play();
  }
}

const showDiceGrid = () => {
  for (let i = 0; i < 6; i++) {
    rect(150 + i * 110, 150, 100, 100);
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
  let count = (throwCounter % 3) + 1;
  text("Throw " + count, width / 2 - 40, 380);
};

const showCalculatedPoints = () => {
  fill(255);
  textSize(30);
  let calculatedPoints = calculatePoints(dice);
  text("Points " + calculatedPoints, 420, 100);
};
