import BCDice, { DiceBotLoader, DiceBotResolver } from 'bcdice-js';

DiceBotResolver.setCustomLoader(filename => import(`bcdice-js/lib/diceBot/${filename}`), true);

const GameTypes = DiceBotLoader.collectDiceBotDescriptions().map(([gameType]) => gameType);

export function getGameTypes() {
  return GameTypes;
}

const bcdice = new BCDice();
bcdice.setCollectRandResult(true);

export async function executeDice(line, dice) {
  if (bcdice.getGameType() !== dice) {
    await bcdice.setGameByTitle(dice);
  }

  bcdice.setMessage(line);

  const [result, secret] = bcdice.diceCommand();

  return {
    result,
    secret,
    diceResults: bcdice.getRandResults(),
  };
}
