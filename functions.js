const getRandomDiceValue = () => {
  return Math.floor(Math.random() * DICE_COUNT) + 1;
};

const mouseHitsObject = (x, y, width, height) => {
  return (
    mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + height
  );
};