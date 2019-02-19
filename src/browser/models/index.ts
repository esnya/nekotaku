import * as ListEvent from '@/constants/ListEvent';
import * as ObjectEvent from '@/constants//ObjectEvent';
import CharactersModel from '@/browser/models/CharactersModel';
import ChatPaletts from '@/browser/models/ChatPalettsModel';
import MapModel from '@/browser/models/MapModel';
import MembersModel from '@/browser/models/MembersModel';
import MemosModel from '@/browser/models/MemosModel';
import MessagesModel from '@/browser/models/MessagesModel';
import PasswordsModel from '@/browser/models/PasswordsModel';
import RoomModel from '@/browser/models/RoomModel';
import RoomsModel from '@/browser/models/RoomsModel';
import ShapesModel from '@/browser/models/ShapesModel';
import Vue from 'vue';
import backend from '@/browser/backend';
import mapValues from 'lodash/mapValues';
import shortid from 'shortid';

const Models = {
  characters: CharactersModel,
  chatPaletts: ChatPaletts,
  map: MapModel,
  members: MembersModel,
  memos: MemosModel,
  messages: MessagesModel,
  passwords: PasswordsModel,
  room: RoomModel,
  rooms: RoomsModel,
  shapes: ShapesModel,
};

const models = mapValues(Models, Model => new Model(backend));
export default models;

function bind(
  name: string,
  autoBind: boolean,
  init: () => any,
  callback: (event: string, data: { id: string }) => void,
) {
  const unsubscribeKey = `$${shortid()}`;
  return {
    data: () => ({
      [name]: init(),
    }),
    methods: autoBind ? {} : {
      async bindModels(this: { $modelBinders: (() => void)[] }) {
        await Promise.all(this.$modelBinders.map(f => f()));
      },
    },
    async created(this: { roomId: string, $modelBinders: (() => void)[], [key: string]: {} }) {
      if (!models[name]) throw new Error(`Model ${name} is not defined`);

      const binder = async () => {
        this[unsubscribeKey] = await models[name].subscribe(
          this.roomId || null,
          (event, data) => callback.call(this, event, data),
        );
      };
      if (autoBind) await binder();
      else {
        if (!this.$modelBinders) this.$modelBinders = [];
        this.$modelBinders.push(binder);
      }
    },
    async destroyed(this: { [key: string]: () => void | null }) {
      if (this[unsubscribeKey]) {
        await this[unsubscribeKey]();
      }
    },
  };
}

export function bindAsList(
  name: string,
  isReversed: boolean = false,
  autoBind: boolean = true,
) {
  return bind(
    name,
    autoBind,
    () => [],
    function callback(
      this: { [key: string]: { id: string }[] },
      event: string,
      newData: { id: string },
    ) {
      switch (event) {
        case ListEvent.ChildAdded:
          if (isReversed) this[name].unshift(newData);
          else this[name].push(newData);
          break;
        case ListEvent.ChildChanged:
          this[name] = this[name].map(item => (item.id === newData.id ? newData : item));
          break;
        case ListEvent.ChildRemoved:
          this[name] = this[name].filter(item => item.id !== newData.id);
          break;
        default:
      }
    },
  );
}

export function bindAsObject(name: string, autoBind: boolean = true) {
  return bind(
    name,
    autoBind,
    () => null,
    function callback(
      this: { [key: string]: { id: string } },
      event: string,
      newData: { id: string },
    ) {
      switch (event) {
        case ObjectEvent.Value:
          this[name] = newData;
          break;
        default:
      }
    },
  );
}
