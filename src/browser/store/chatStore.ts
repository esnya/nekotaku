import { VuexModule, Module, Mutation } from 'vuex-class-modules';
import store from '.';

@Module
class ChatStore extends VuexModule {
  viewLimit: number = 100;
  message: string | null = null;
  nameId: string | null = null;
  to: string[] | null = null;

  @Mutation
  setViewLimit(viewLimit: number) {
    if (viewLimit <= 0 || Number.isNaN(viewLimit)) throw new Error(`Invalid view limit: ${viewLimit}`);
    this.viewLimit = viewLimit;
  }

  @Mutation
  setMessage(message: string | null) {
    this.message = message;
  }

  @Mutation
  setNameId(nameId: string) {
    this.nameId = nameId;
  }

  @Mutation
  setTo(to: string[] | null) {
    if (to && to.length === 0) throw new Error('Payload must be null or have a length 1 or more');
    this.to = to;
  }
}
export default new ChatStore({ store, name: 'chat' });
