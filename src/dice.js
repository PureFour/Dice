let dice = [];

const Dice = {
  handleClick: () => {
    dice.forEach(dice => dice.handleClick());
  },

  showGrid: () => {
    dice.forEach((el) => el.show());
    stroke(255);
    noFill();
    for (let i = 0; i < DICE_COUNT; i++) {
      rect(150, 150 + i * 110, 100, 100);
      noFill();
      stroke(255);
    }
  },

  throw: () => {
    if (dice.length === 0 || Dice.allMarked() || throwCounter % THROWS_COUNT == 1) {
      for (let i = 0; i < DICE_COUNT; i++) {
        dice.splice(i, 1, new Die(150, 150 + i * 110, 100));
      }
      throwCounter++;
    } else {
      Dice.reThrow();
    }
  },

  reThrow: () => {
    let thrown = false;
    for (let i = 0; i < dice.length; i++) {
      if (!dice[i].marked) {
        dice.splice(i, 1, new Die(dice[i].x, dice[i].y, dice[i].size));
        thrown = true;
      }
    }
    thrown ? throwCounter++ : "";
  },

  allMarked: () => {
    return !dice.some((dice) => dice.marked);
  }
}

class Die {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = getRandomDiceValue();
    this.background = COLORS.diceBackgroundColor;
    this.marked = false;
  }

  handleClick = () => {
    if (mouseHitsObject(this.x, this.y, this.size, this.size)) {
      this.mark();
    }
  };

  mark = () => {
    if (!this.marked) {
      this.background = COLORS.diceMarkedBackgroundColor;
      this.marked = !this.marked;
    } else {
      this.background = COLORS.diceBackgroundColor;
      this.marked = !this.marked;
    }
  };

  show = () => {
    rectMode(CORNER);
    switch (this.value) { // TODO refactor!
      case 1:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        noStroke();
        ellipse(this.x + 50, this.y + 50, 20, 20);
        break;
      case 2:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        ellipse(this.x + 25, this.y + 25, 20, 20);
        ellipse(this.x + 75, this.y + 75, 20, 20);
        break;
      case 3:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        ellipse(this.x + 25, this.y + 25, 20, 20);
        ellipse(this.x + 50, this.y + 50, 20, 20);
        ellipse(this.x + 75, this.y + 75, 20, 20);
        break;
      case 4:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        ellipse(this.x + 25, this.y + 25, 20, 20);
        ellipse(this.x + 75, this.y + 75, 20, 20);
        ellipse(this.x + 25, this.y + 75, 20, 20);
        ellipse(this.x + 75, this.y + 25, 20, 20);
        break;
      case 5:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        ellipse(this.x + 25, this.y + 25, 20, 20);
        ellipse(this.x + 75, this.y + 75, 20, 20);
        ellipse(this.x + 50, this.y + 50, 20, 20);
        ellipse(this.x + 25, this.y + 75, 20, 20);
        ellipse(this.x + 75, this.y + 25, 20, 20);
        break;
      case 6:
        fill(this.background);
        rect(this.x, this.y, this.size, this.size);
        fill(COLORS.diceDotColor);
        ellipse(this.x + 75, this.y + 75, 20, 20);
        ellipse(this.x + 75, this.y + 50, 20, 20);
        ellipse(this.x + 75, this.y + 25, 20, 20);
        ellipse(this.x + 25, this.y + 25, 20, 20);
        ellipse(this.x + 25, this.y + 50, 20, 20);
        ellipse(this.x + 25, this.y + 75, 20, 20);
        break;
      default:
        break;
    }
    fill(this.background);
  };
}