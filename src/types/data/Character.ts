import ObjectDataType from './ObjectDataType';

export interface CharacterPortrait {
  url?: string | null;
}

export default interface Character extends ObjectDataType {
  attributes: string[];
  icon?: string | null;
  initiative: number;
  name: string;
  portrait: { [fase: string]: CharacterPortrait };
  x: number;
  y: number;
  iconSize: number;
}

export interface CharacterAddData {
  attributes: [];
  name: string;
  initiative: number;
  icon?: string | null;
  portrait?: { [fase: string]: CharacterPortrait };
  x?: number;
  y?: number;
  iconSize: number;
}

export interface CharacterUpdateData {
  name?: string;
  iconSize?: number;
}
