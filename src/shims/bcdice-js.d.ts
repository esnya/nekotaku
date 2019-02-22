declare module 'bcdice-js' {
  interface DiceBot {
    getHelpMessage(): string;
  }

  export class DiceBotLoader {
    static collectDiceBotDescriptions(): string[];
    static loadUnknownGame(dice: string): DiceBot | null;
  }
  export class DiceBotResolver {
    static setCustomLoader(loader: (filename: string) => Promise<any>, async: boolean): void;
  }
  export default class BCDice {
    setGameByTitle(dice: string): Promise<void>;
    setCollectRandResult(value: boolean): void;
    setMessage(message: string): void;
    diceCommand(): string[];
    getRandResults(): number[][];
  }
}
