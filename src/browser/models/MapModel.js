import ObjectModel from '@/browser/models/ObjectModel';

function getFilePath(roomId: string, key: string): string {
  return `${roomId}/map/${key}`;
}

export default class MapModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'maps');
  }

  async remove(roomId: string): Promise<void> {
    await this.removeBackgroundImage(roomId);
    await super.remove(roomId);
  }

  async update(roomId: string, data: Object): Promise<void> {
    await super.update(roomId, {
      width: 10,
      height: 10,
      ...data,
    });
  }

  async updateBackgroundImage(roomId: string, file: File): Promise<void> {
    const url = await this.backend.pushFile(getFilePath(roomId, 'backgroundImage'), file);
    await this.update(roomId, { backgroundImage: url });
  }

  async removeBackgroundImage(roomId: string): Promise<void> {
    await this.update(roomId, { backgroundImage: null });
    this.backend.removeFile(getFilePath(roomId, 'backgroundImage'));
  }
}
