import _ from 'lodash';
import shortid from 'shortid';
import backend from '@/browser/backend';
import CharactersModel from '@/browser/models/CharactersModel';
import ChatPaletts from '@/browser/models/ChatPalettsModel';
import MapModel from '@/browser/models/MapModel';
import MembersModel from '@/browser/models/MembersModel';
import MemosModel from '@/browser/models/MemosModel';
import MessagesModel from '@/browser/models/MessagesModel';
import * as ObjectEvent from '@/constants//ObjectEvent';
import PasswordsModel from '@/browser/models/PasswordsModel';
import RoomModel from '@/browser/models/RoomModel';
import RoomsModel from '@/browser/models/RoomsModel';
import ShapesModel from '@/browser/models/ShapesModel';
import * as ListEvent from '@/constants/ListEvent';

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

export default {
  install(Vue) {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$models = _.mapValues(Models, Model => new Model(backend));
  },
};

function bind(
  name: string,
  autoBind: boolean,
  init: () => any,
  callback: (event: string, data: Object | string) => void,
) {
  const unsubscribeKey = `$${shortid()}`;

  return {
    data: () => ({
      [name]: init(),
    }),
    methods: autoBind ? {} : {
      async bindModels() {
        await Promise.all(this.$modelBinders.map(f => f()));
      },
    },
    async created() {
      if (!this.$models[name]) throw new Error(`Model ${name} is not defined`);

      const binder = async () => {
        this[unsubscribeKey] = await this.$models[name].subscribe(
          this.roomId || null,
          callback.bind(this),
        );
      };
      if (autoBind) await binder();
      else {
        if (!this.$modelBinders) this.$modelBinders = [];
        this.$modelBinders.push(binder);
      }
    },
    async destroyed() {
      if (this[unsubscribeKey]) {
        await this[unsubscribeKey]();
      }
    },
  };
}

export function bindAsList(name: string, isReversed: boolean = false, autoBind: boolean = true) {
  return bind(name, autoBind, () => [], function callback(event: string, newData: Object) {
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
  });
}

export function bindAsObject(name: string, autoBind: boolean = true) {
  return bind(
    name,
    autoBind,
    () => null,
    function callback(event: string, newData: Object | string) {
      switch (event) {
        case ObjectEvent.Value:
          this[name] = newData;
          break;
        default:
      }
    },
  );
}
