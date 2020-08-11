var eachDiceCount = [0, 0, 0, 0, 0, 0];
var schoolBonuses = [0, 0];

const calculateEachDiceCount = (diceValues) => {
  eachDiceCount.fill(0);
  diceValues.forEach((value) => {
    eachDiceCount[DICE_MAX_VALUE - value] += 1;
  });
};

const calculateSpecificCount = (count, excludeIndex = -1) => {
  for (let i = 0; i < DICE_MAX_VALUE; i++) {
    if (i == excludeIndex) continue;
    if (eachDiceCount[i] >= count) return (DICE_MAX_VALUE - i) * count;
  }
  return 0;
};

const pair = (excludeIndex = -1) => {
  return calculateSpecificCount(2, excludeIndex);
};

const twoPairs = () => {
  const firstPairValue = pair();
  const excludeIndex = DICE_MAX_VALUE - firstPairValue / 2;
  const secondPairValue = pair(excludeIndex);
  if (!secondPairValue) return 0;
  return firstPairValue + secondPairValue;
};

const threeOfKind = (excludeIndex = -1) => {
  return calculateSpecificCount(3, excludeIndex);
};

const fourOfKind = () => {
  return calculateSpecificCount(4);
};

const fiveOfKind = () => {
  return calculateSpecificCount(5);
};

const poker = () => {
  const points = calculateSpecificCount(6);
  return points ? points + 50 : 0;
};

const fullHouse = () => {
  const threeOfKindValue = threeOfKind();
  if (!threeOfKindValue) return 0;
  const pairValue = pair(DICE_MAX_VALUE - threeOfKindValue / 3);
  if (!pairValue) return 0;
  return threeOfKindValue + pairValue;
};
const fourTwoZero = () => {
  const fourOfKindValue = fourOfKind();
  if (!fourOfKindValue) return 0;
  const pairValue = pair(DICE_MAX_VALUE - fourOfKindValue / 4);
  if (!pairValue) return 0;
  return fourOfKindValue + pairValue;
};

const shelby = () => {
  const firstThreeOfKindValue = threeOfKind();
  const excludeIndex = DICE_MAX_VALUE - firstThreeOfKindValue / 3;
  const secondThreeOfKindValue = threeOfKind(excludeIndex);
  if (!secondThreeOfKindValue) return 0;
  return firstThreeOfKindValue + secondThreeOfKindValue;
};

const chance = () => {
  let sum = 0;
  for (let i = 0; i < DICE_COUNT; i++) {
    sum += eachDiceCount[i] * (DICE_MAX_VALUE - i);
  }
  return sum;
};

const smallStraight = () => {
  for (let i = 1; i < DICE_MAX_VALUE; i++) if (eachDiceCount[i] == 0) return 0;
  return 15;
};

const straight = () => {
  for (let i = 0; i < DICE_MAX_VALUE; i++) if (eachDiceCount[i] == 0) return 0;
  return 21;
};

const threePairs = () => {
  let pairsCount = 3;
  eachDiceCount.forEach((value) => {
    if (value % 2 === 0) pairsCount -= value / 2;
  });
  return pairsCount ? 0 : chance();
};

const school = (number, columnNumber) => {
  const index = DICE_MAX_VALUE - number;
  const numberCount = eachDiceCount[index];

  const bonusValue = columnNumber === 1 ? schoolBonuses[0] : schoolBonuses[1];
  const requiredValue = (4 - numberCount) * number;

  if (numberCount < 4 && bonusValue >= requiredValue) {
    updateBonus(requiredValue, columnNumber);
    return -requiredValue;
  } else if (numberCount >= 4) {
    return number * Math.abs((4 - numberCount));
  }

  const difference = number * (4 - numberCount);

  return - 50 - difference;
}

const bonus = (number, columnNumber) => {
  calculateBonus();
  if (columnNumber === 1) return schoolBonuses[0];
  else if (columnNumber === 2) return schoolBonuses[1];

  return 0;
}

const calculateBonus = () => {
  let firstBonus = 0, secondBonus = 0;

  for (let i = 0; i < DICE_COUNT; i++) {
    firstBonus += currentPoints[i].value <= 0 ? 0 : currentPoints[i].value;
    secondBonus += currentPoints2[i].value <= 0 ? 0 : currentPoints2[i].value;
  }

  schoolBonuses[0] = firstBonus;
  schoolBonuses[1] = secondBonus;
}

const updateBonus = (requiredValue, columnNumber) => {
  if (columnNumber === 1) {
    schoolBonuses[0] -= requiredValue;
  } else if (columnNumber === 2) { schoolBonuses[0] -= requiredValue }
}

const SchemeFinders = [
  school, school, school, school, school, school, bonus,
  pair, twoPairs, threeOfKind, fourOfKind, fiveOfKind, poker, fullHouse, fourTwoZero, shelby, smallStraight, straight, threePairs, chance];