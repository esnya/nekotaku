import RoomPrivateChildDAO from './RoomPrivateChildDAO';
import FixedPhrase, { FixedPhraseAdd, FixedPhraseUpdate } from '@/models/FixedPhrase';
import Model from '@/models/Model';

export class FixedPhraseDAO
  extends RoomPrivateChildDAO<FixedPhraseAdd, FixedPhraseUpdate, FixedPhrase> {
  getCollectionName(): string {
    return 'fixed-phrases';
  }

  read(value: Model): FixedPhrase {
    return {
      title: '定型文',
      items: [],
      ...value,
    };
  }
}
export default new FixedPhraseDAO();
