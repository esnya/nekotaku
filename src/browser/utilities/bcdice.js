import _ from 'lodash';
import BCDice, { DiceBotLoader } from 'bcdice-js';

const DiceBotTable = _(DiceBotLoader.collectDiceBots())
  .map(diceBot => [diceBot.gameType(), diceBot])
  .fromPairs()
  .value();

export function getGameTypes() {
  return _.keys(DiceBotTable);
}

export function getDiceBot(gameType) {
  return DiceBotTable[gameType] || DiceBotLoader.loadUnknownGame('DiceBot');
}

const bcdice = new BCDice();

export function executeDice(line, dice) {
  const diceBot = getDiceBot(dice);
  bcdice.setDiceBot(diceBot);
  bcdice.setMessage(line);
  bcdice.setCollectRandResult(true);

  const [result, secret] = bcdice.diceCommand();

  return {
    result,
    secret,
    diceResults: bcdice.getRandResults(),
  };
}
