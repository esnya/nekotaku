import Model from '@/models/Model';

export default interface Member extends Model {
  color: string;
  name: string;
}

export interface MemberUpdate {
  color: string;
  name: string;
}
