import ObjectDataType from './ObjectDataType';

export default interface Room extends ObjectDataType {
  channels: string[];
  characterAttributes: string[];
  dice: string;
  title: string;
  isLocked?: boolean;
}

export interface RoomAddData {
  // channels: string[];
  characterAttributes: string[];
  dice: string;
  title: string;
  password?: string;
}

export interface RoomUpdateData {
  channels?: string[];
  characterAttributes?: string[];
  dice?: string;
  title?: string;
}
