import BCDice, { Info } from 'bcdice';

export { Info } from 'bcdice';

export const { infoList } = BCDice;

export function getInfo(gameType: string): Info | undefined {
  return BCDice.infoList.find(i => i.gameType === gameType);
}

export async function roll(input: string, gameType: string): Promise<[string, number[][] | null]> {
  try {
    await import(`bcdice/lib/diceBot/${gameType}`);
  } catch (e) {
    console.error(e);
  }

  const bcdice = new BCDice();
  return bcdice.roll(input, gameType);
}
