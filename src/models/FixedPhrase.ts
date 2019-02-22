import Model from './Model';

export default interface FixedPhrase extends Model {
  title: string;
  items: string[];
}

export interface FixedPhraseAdd {
  title: string;
  items: string[];
}

export interface FixedPhraseUpdate {
  title?: string;
  items?: string[];
}
