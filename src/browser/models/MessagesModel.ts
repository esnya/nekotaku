import Backend from '@/browser/backend/Backend';
import ListModel from '@/browser/models/ListModel';

export interface MessageNode {
  type: string;
  text: string;
}

async function parseBody(body: string | MessageNode[], dice?: string): Promise<MessageNode[]> {
  if (typeof body !== 'string') return body;
  if (dice) {
    const {
      executeDice,
      getDiceBotDescByFilename,
    } = await import(/* webpackChunkName: "bcdice" */ '@/browser/utilities/bcdice');

    const diceBotDesc = getDiceBotDescByFilename(dice);

    const {
      result,
      diceResults,
    } = await executeDice(body, dice);

    const textNodes = body.split(/\n/g).map(text => ({ type: 'text', text }));
    const diceResultNodes = result === '1'
      ? []
      : [{
        type: 'dice',
        dice: diceBotDesc ? diceBotDesc.gameType : dice,
        text: result.replace(/^: /, ''),
        diceResults,
      }];

    return [
      ...textNodes,
      ...diceResultNodes,
    ]
  }
  return body.split(/\n/g).map(text => ({ type: 'text', text }));
}

interface MessageUpdateData {
  body: string | MessageNode[];
  channel: string;
  color: string;
  dice: string
  face: string;
  name: string;
  to?: string | string[] | null;
}

export default class MessagesModel extends ListModel {
  constructor(backend: Backend) {
    super(backend, 'messages');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      body: [],
      color: '#000000',
      dice: null,
      createdAt: Date.now(),
      face: 'default',
      name: 'ななしさん',
      to: null,
      channel: 'メイン',
    };
  }

  async push(roomId: string, data: MessageUpdateData): Promise<string> {
    const {
      body,
      color,
      channel,
      dice,
      face,
      name,
      to,
    } = data;

    const parsedBody = await parseBody(body, dice);

    const id = await super.push(roomId, {
      body: parsedBody,
      channel,
      color,
      createdAt: Date.now(),
      face,
      name,
      to: (typeof to === 'string' ? to.split(/\s*,\s*/g) : to) || null,
    });

    return id;
  }
}
