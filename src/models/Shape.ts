import Model from './Model';

export default interface Shape extends Model {
  type: string;
  r?: number;
  x: number;
  y: number;
}

export interface ShapeAdd {
  type: string;
  x: number;
  y: number;
}

export interface ShapeUpdate {
  x?: number;
  y?: number;
}
