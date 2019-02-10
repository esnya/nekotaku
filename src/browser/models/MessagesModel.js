import ListModel from '@/browser/models/ListModel';

async function parseBody(body: string|Object[], dice: ?string): Promise<Object> {
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

    return body.split(/\n/g).map(text => ({ type: 'text', text })).concat(result === '1' ? [] : [{
      type: 'dice',
      dice: diceBotDesc ? diceBotDesc.gameType : dice,
      text: result.replace(/^: /, ''),
      diceResults,
    }]);
  }
  return body.split(/\n/g).map(text => ({ type: 'text', text }));
}

export default class MessagesModel extends ListModel {
  constructor(backend) {
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

  async push(roomId: string, data: {}): Promise<void> {
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

    await super.push(roomId, {
      body: parsedBody,
      channel,
      color,
      createdAt: Date.now(),
      face,
      name,
      to: (typeof to === 'string' ? to.split(/\s*,\s*/g) : to) || null,
    });
  }
}
