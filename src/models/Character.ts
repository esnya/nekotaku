import Model from './Model';

export default interface Character extends Model {
  attributes: string[];
  iconSize: number;
  iconUrl?: string | null;
  initiative: number;
  name: string;
  portraitUrl?: string | null;
  x: number;
  y: number;
}

export interface CharacterAdd {
  attributes: [];
  iconUrl?: string | null;
  iconSize: number;
  initiative: number;
  name: string;
  portraitUrl?: string | null;
  x: number;
  y: number;
}

export interface CharacterUpdate {
  attributes?: string[];
  iconUrl?: string | null;
  iconSize?: number;
  initiative?: number;
  name?: string;
  portraitUrl?: string | null;
  x?: number;
  y?: number;
}
