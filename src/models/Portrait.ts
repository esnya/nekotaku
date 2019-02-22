import Model from './Model';

export default interface Portrait extends Model {
  name: string;
  tags: string[];
  portraitUrl?: string | null;
}

export interface PortraitAdd {
  name: string;
  tags: string[];
  portraitUrl?: string | null;
}

export interface PortraitUpdate {
  name?: string;
  tags?: string[];
  portraitUrl?: string | null;
}
