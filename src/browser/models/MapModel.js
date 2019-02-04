import ObjectModel from '@/browser/models/ObjectModel';

const FilePath = 'map/backgroundImage';

export default class MapModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'maps');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      width: 10,
      height: 10,
      grid: true,
      backgroundImage: null,
    };
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
