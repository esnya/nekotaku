import * as ListEvent from '@/constants/ListEvent';
import Model from '@/browser/models/Model';
import backend from '@/browser/backend';
import shortid from 'shortid';

export function bindAsList(M: Model, isReversed: boolean = false) {
  const model = new M(backend);
  const { name } = model;

  const unsubscribeKey = shortid();

  return {
    computed: {
      [`${name}Model`]: () => model,
    },
    data: () => ({
      [name]: [],
      [unsubscribeKey]: null,
    }),
    async created() {
      this[unsubscribeKey] = await model.subscribe(
        this.roomId || null,
        (event: string, newData: Object) => {
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
        },
      );
    },
    async destroyed() {
      await this[unsubscribeKey]();
    },
  };
}

export function bindAsObject(M) {
  const model = new M(backend);
  return model;
}
