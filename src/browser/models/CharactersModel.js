import ListModel from '@/browser/models/ListModel';

function getFilePath(characterId: string, key: string): string {
  return `characters/${characterId}/${key}`;
}

export default class CharactersModel extends ListModel {
  constructor(backend) {
    super(backend, 'characters');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      attributes: [],
      initiative: 0,
      name: 'ななし',
      portrait: {
        default: {
          tags: [],
        },
      },
      x: 0,
      y: 0,
      z: Date.now(),
    };
  }

  async removeIcon(roomId: string, characterId: string): Promise<void> {
    await this.update(roomId, characterId, { icon: null });
    await this.backend.removeFile(getFilePath(roomId, characterId, 'icon'));
  }

  async removePortrait(roomId: string, characterId: string, face: string): Promise<void> {
    await this.update(roomId, `${characterId}/portrait/${face}`, null);
    await this.backend.removeFile(roomId, getFilePath(characterId, `portrait/${face}`));
  }

  async updateIcon(roomId: string, characterId: string, file: File): Promise<void> {
    const url = await this.backend.pushFile(roomId, getFilePath(characterId, 'icon'), file);
    await this.update(roomId, characterId, { icon: url });
  }

  async updatePortrait(
    roomId: string,
    characterId: string,
    face: string,
    file: File,
  ): Promise<void> {
    const url = await this.backend.pushFile(roomId, getFilePath(characterId, `portrait/${face}`), file);
    await this.update(roomId, `${characterId}/portrait/${face}`, { url });
  }
}
