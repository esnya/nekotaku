import ListDAOBase from '@/browser/dao/ListDAOBase';

interface Data {
  id: string;
  createdAt: number;
  updatedAt: number;
}

interface AddData {
}

interface UpdateData {
}

type ItemKey = string;

export default class RoomsDAO extends ListDAOBase<Data, AddData, UpdateData, ItemKey> {
  getName(): string {
    return 'rooms';
  }

  async getListPath(): Promise<string> {
    return this.getName();
  }

  async getItemPath(key: ItemKey): Promise<string> {
    return `${this.getName()}/${key}`;
  }

  reader(data: { id: string }): Data {
    return {
      createdAt: 0,
      updatedAt: 0,
      ...data,
    };
  }
}
