import Model from './Model';

export default interface Room extends Model {
  channels: string[];
  characterAttributes: string[];
  dice: string;
  title: string;
  mapBackgroundImageUrl?: string | null;
  mapGrid: boolean;
  mapHeight: number;
  mapWidth: number;
}

export interface RoomAdd {
  channels: string[];
  characterAttributes: string[];
  dice: string;
  title: string;
  password?: string;
}

export interface RoomUpdate {
  channels?: string[];
  characterAttributes?: string[];
  dice?: string;
  title?: string;
}
