function preload() {
  roll_sound = loadSound("sound/rolling_dice_sound.wav");
}

function setup() {
  createCanvas(960, 960);
  Table.initTableCells();
}

function draw() {
  background(53, 101, 77);
  ThrowButton.show();
  Table.show();
  Table.handleTableMouseOver();
  Dice.showGrid();
}

function touchStarted() {
  Dice.handleClick();
  ThrowButton.handleClick();
  Table.handleTableClick();
}