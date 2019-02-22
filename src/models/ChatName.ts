import Model from './Model';

export default interface ChatName extends Model {
  name: string;
  color: string;
}

export interface ChatNameAdd {
  name: string;
  color: string;
}

export interface ChatNameUpdate {
  name?: string;
  color?: string;
}
