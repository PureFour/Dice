class Dice {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = getRandomDiceValue();
    this.background = COLORS.diceBackgroundColor;
    this.marked = false;
  }

  mark = () => {
    if (!this.marked) {
      this.background = "rgb(166, 166, 166)";
      this.marked = !this.marked;
    } else {
      this.background = "rgb(255, 255, 255)";
      this.marked = !this.marked;
    }
  };

  show = () => {
    rectMode(CORNER);
    switch (this.value) {
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
