import ObjectModel from '@/browser/models/ObjectModel';
import CharactersModel from '@/browser/models/CharactersModel';
import MapModel from '@/browser/models/MapModel';
import MemosModel from '@/browser/models/MemosModel';
import MessagesModel from '@/browser/models/MessagesModel';
import ShapesModel from '@/browser/models/ShapesModel';

export default class RoomModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'rooms');
  }

  async remove(roomId: string): Promise<void> {
    await Promise.all(
      [
        CharactersModel,
        MemosModel,
        MessagesModel,
        ShapesModel,
      ].map(async (Model) => {
        const model = new Model(this.backend);
        await model.removeAll(roomId);
      }),
    );

    const mapModel = new MapModel(this.backend);
    await mapModel.remove(roomId);

    this.backend.removeFiles(roomId);

    await super.remove(roomId);
  }
}
