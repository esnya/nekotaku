/* eslint no-param-reassign: off, no-useless-computed-key: off */
import { merge } from 'lodash';
import backend from '../backend';
import listStore from './listStore';

const baseStore = listStore('messages');

export default merge(
  {},
  baseStore,
  {
    actions: {
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

        await backend.sendMessage({
          ...message,
          body: parsedBody,
          createdAt: Date.now(),
        });
      },
    },
    mutations: {
      'messages:add': function addMessage(state, message) {
        baseStore.mutations['messages:add'](state, message);

        const {
          name,
          face,
        } = message;

        const character = state.characters.find(c => c.name === name);
        if (!character) return;

        const portrait = character.portrait && character.portrait[face];
        if (!portrait) return;

        state.portraits = [
          portrait,
          ...state.portraits.filter(p => p !== portrait),
        ];
      },
    },
  },
);
