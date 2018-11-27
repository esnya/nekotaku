import _ from 'lodash';
import shortid from 'shortid';
import backend from '@/browser/backend';
import CharactersModel from '@/browser/models/CharactersModel';
import { ListEvent } from '@/browser/models/ListModel';
import MapModel from '@/browser/models/MapModel';
import MembersModel from '@/browser/models/MembersModel';
import MemosModel from '@/browser/models/MemosModel';
import MessagesModel from '@/browser/models/MessagesModel';
import { ObjectEvent } from './ObjectModel';
import RoomModel from '@/browser/models/RoomModel';
import RoomsModel from '@/browser/models/RoomsModel';
import ShapesModel from '@/browser/models/ShapesModel';

const Models = [
  CharactersModel,
  MapModel,
  MembersModel,
  MemosModel,
  MessagesModel,
  RoomModel,
  RoomsModel,
  ShapesModel,
];

export default {
  install(Vue) {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$models = _(Models)
      .map(Model => new Model(backend.strategy))
      .map((model) => {
        const m = model.constructor.name.match(/^(.*)Model$/);
        const name = m[1].replace(/^[A-Z]/, c => c.toLowerCase());
        return [name, model];
      })
      .fromPairs()
      .value();
  },
};

function bind(
  name: string,
  autoBind: boolean,
  init: void => any,
  callback: (string, Object | string) => void,
) {
  const unsubscribeKey = shortid();

  return {
    data: () => ({
      [name]: init(),
      [unsubscribeKey]: null,
    }),
    methods: autoBind ? {} : {
      async bindModels() {
        await Promise.all(this.$modelBinders.map(f => f()));
      },
    },
    async created() {
      const binder = async () => {
        if (!this.$models[name]) throw new Error(`Model ${name} is not defined`);

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
      await this[unsubscribeKey]();
    },
  };
}

export function bindAsList(name: string, isReversed: boolean = false, autoBind: boolean = true) {
  return bind(name, autoBind, () => [], function callback(event: string, newData: Object | string) {
    switch (event) {
      case ListEvent.ChildAdded:
        if (isReversed) this[name].unshift(newData);
        else this[name].push(newData);
        break;
      case ListEvent.ChildChanged:
        this[name] = this[name].map(item => (item.id === newData.id ? newData : item));
        break;
      case ListEvent.ChildRemoved:
        this[name] = this[name].filter(item => item.id !== newData);
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
