import BCDice, { DiceBotLoader, DiceBotResolver } from 'bcdice-js';

DiceBotResolver.setCustomLoader(filename => import(/* webpackChunkName: "dicebot" */ `bcdice-js/lib/diceBot/${filename}`), true);

const DiceBotDescs = [
  // { filename: 'DiceBot', gameType: 'DiceBot', gameName: 'ダイスボット' },
  ...DiceBotLoader
    .collectDiceBotDescriptions()
    .map(([filename, gameType, gameName]) => ({ filename, gameType, gameName })),
];

export function getDiceBotDescs() {
  return DiceBotDescs;
}

export function getDiceBotDescByFilename(filename) {
  return DiceBotDescs.find(d => d.filename === filename);
}

export async function getHelpMessage(dice) {
  const diceBot = await DiceBotLoader.loadUnknownGame(dice);
  return diceBot && diceBot.getHelpMessage();
}

const bcdice = new BCDice();
let currentDice = null;

export async function executeDice(line, dice) {
  if (currentDice !== dice) {
    currentDice = dice;
    await bcdice.setGameByTitle(dice);
  }

  bcdice.setCollectRandResult(true);
  bcdice.setMessage(line);

  const [result, secret] = bcdice.diceCommand();

  return {
    result,
    secret,
    diceResults: bcdice.getRandResults(),
  };
}
