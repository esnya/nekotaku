import BCDice, { DiceBotLoader, DiceBotResolver } from 'bcdice-js';

DiceBotResolver.setCustomLoader(filename => import(`bcdice-js/lib/diceBot/${filename}`), true);

const DiceBotDescs = DiceBotLoader.collectDiceBotDescriptions()
  .map(([filename, gameType, gameName]) => ({ filename, gameType, gameName }));

export function getDiceBotDescs() {
  return DiceBotDescs;
}

export function getDiceBotDescByFilename(filename) {
  return DiceBotDescs.find(d => d.filename === filename);
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
