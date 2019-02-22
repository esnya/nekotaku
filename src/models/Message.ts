import Model from './Model';

export interface BodyNode {
  type: string;
  text: string;
}

export default interface Message extends Model {
  body: BodyNode[];
  channel: string;
  color: string;
  name: string;
  portraitId?: string | null;
  to?: string[] | null;
}

export interface MessageAdd {
  body: BodyNode[];
  channel: string;
  color: string;
  name: string;
  portraitId?: string | null;
  to?: string[] | null;
}
