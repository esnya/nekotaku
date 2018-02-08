/* eslint no-param-reassign: off, no-useless-computed-key: off */
import backend from '../backend';
import listStore from './listStore';

export default {
  ...listStore('messages'),
  actions: {
    async sendStructuredMessage(context, message) {
      await backend.sendMessage({
        ...message,
        createdAt: Date.now(),
      });
    },
    async sendMessage(context, message) {
      const {
        body,
      } = message;

      const {
        dice,
      } = context.state.room;

      const {
        executeDice,
        getDiceBotDescByFilename,
      } = await import('../utilities/bcdice');

      const {
        result,
        diceResults,
      } = await executeDice(body, dice);

      const diceBotDesc = getDiceBotDescByFilename(dice);

      const parsedBody = body.split(/\n/g).map(text => ({ type: 'text', text })).concat(result === '1' ? [] : [{
        type: 'dice',
        dice: diceBotDesc ? diceBotDesc.gameType : dice,
        text: result.replace(/^: /, ''),
        diceResults,
      }]);

      await context.dispatch('sendStructuredMessage', {
        ...message,
        body: parsedBody,
      });
    },
  },
};
