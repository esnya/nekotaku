import BCDice, { DiceBotLoader, DiceBotResolver } from 'bcdice-js';

DiceBotResolver.setCustomLoader(filename => import(/* webpackChunkName: "dicebot" */ `bcdice-js/lib/diceBot/${filename}`), true);

interface DiceBotDesc {
  filename: string;
  gameType: string;
  gameName: string;
}

const DiceBotDescs: DiceBotDesc[] = [
  // { filename: 'DiceBot', gameType: 'DiceBot', gameName: 'ダイスボット' },
  ...DiceBotLoader
    .collectDiceBotDescriptions()
    .map(([filename, gameType, gameName]) => ({ filename, gameType, gameName })),
];

export function getDiceBotDescs(): DiceBotDesc[] {
  return DiceBotDescs;
}

export function getDiceBotDescByFilename(filename: string): DiceBotDesc | undefined {
  return DiceBotDescs.find(d => d.filename === filename);
}

export async function getHelpMessage(dice: string) {
  const diceBot = await DiceBotLoader.loadUnknownGame(dice);
  return diceBot && diceBot.getHelpMessage();
}

const bcdice = new BCDice();
let currentDice: string | null = null;

export async function executeDice(line: string, dice: string) {
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
