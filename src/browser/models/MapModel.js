import ObjectModel from '@/browser/models/ObjectModel';

const FilePath = 'map/backgroundImage';

export default class MapModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'maps');
  }

  async update(roomId: string, data: Object): Promise<void> {
    await super.update(roomId, {
      width: 10,
      height: 10,
      ...data,
    });
  }

  async updateBackgroundImage(roomId: string, file: File): Promise<void> {
    const url = await this.backend.pushFile(roomId, FilePath, file);
    await this.update(roomId, { backgroundImage: url });
  }

  async removeBackgroundImage(roomId: string): Promise<void> {
    await this.update(roomId, { backgroundImage: null });
    this.backend.removeFile(roomId, FilePath);
  }
}
