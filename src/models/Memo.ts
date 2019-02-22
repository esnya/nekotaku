import Model from './Model';

export default interface Memo extends Model {
  front?: string | null;
  back?: string | null;
  title?: string | null;
}

export interface MemoAdd {
  front?: string | null;
  back?: string | null;
  title?: string | null;
}

export interface MemoUpdate {
  front?: string | null;
  back?: string | null;
  title?: string | null;
}
