import { Vue } from 'vue-property-decorator';
import { Unsubscribe } from 'firebase';
import ListDAOBase, { ListItemBase } from '../dao/ListDAOBase';
import PropertyDecorator from './PropertyDecorator';
import ObjectDAO from '../dao/ObjectDAO';

interface Wrapper<T> {
  subscribe(): Promise<Unsubscribe>;
}

export class ListWrapper<
  Data extends ListItemBase,
  AddData,
  UpdateData,
  ItemKey,
> implements Wrapper<Data[]> {
  private dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>;
  private reversed: boolean;
  private parent: Vue;
  private propertyKey: string;

  constructor(
    dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>,
    reversed: boolean,
    parent: Vue,
    propertyKey: string,
  ) {
    this.dao = dao;
    this.reversed = reversed;
    this.parent = parent;
    this.propertyKey = propertyKey;
  }

  get data(): Data[] {
    const parent = this.parent as any;
    if (!parent[this.propertyKey]) parent[this.propertyKey] = [];
    return parent[this.propertyKey] || [];
  }

  set data(value: Data[]) {
    const parent = this.parent as any as { [key: string]: Data[] };
    (this.parent as any)[this.propertyKey] = value;
  }

  async subscribe(): Promise<Unsubscribe> {
    const unsubscribe = await this.dao.subscribe(
      (data: Data) => {
        if (this.reversed) this.data.unshift(data);
        else this.data.push(data);
      },
      (data: Data) => {
        const index = this.data.findIndex(item => item.id === data.id);
        if (index < 0) return;
        this.data[index] = data;
      },
      (data: Data) => {
        const index = this.data.findIndex(item => item.id === data.id);
        if (index < 0) return;
        for (let i = index; i < this.data.length; i += 1) {
          this.data[i] = this.data[i + 1];
        }
        this.data.length -= 1;
      },
    );
    this.data = [];
    return unsubscribe;
  }
}

const wrapperKey = Symbol('Wrapper');
const unsubscribeKey = Symbol('Unsubscribe');

function bind<T>(
  createWrapper: (parent: Vue, propertyKey: string) => Wrapper<T>,
  subscribe: boolean,
) {
  return (target: any, propertyKey: string) => {
    const { created, destroyed } = target;

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      value: null,
    });

    Object.defineProperty(target, 'created', {
      enumerable: true,
      writable: false,
      value() {
        if (created) created.call(this);

        const wrapper = createWrapper(this, propertyKey);
        Object.defineProperty(this, wrapperKey, {
          enumerable: true,
          writable: false,
          value: wrapper,
        });

        if (subscribe) {
          Object.defineProperty(this, unsubscribeKey, {
            configurable: true,
            writable: false,
            value: () => Promise.resolve(),
          });
          wrapper.subscribe().then((unsubscribe: Unsubscribe) => {
            Object.defineProperty(this, unsubscribeKey, {
              writable: false,
              value: unsubscribe,
            });
          });
        }
      },
    });

    Object.defineProperty(target, 'destroyed', {
      value() {
        if (destroyed) destroyed.call(this);
        if (subscribe) this[unsubscribeKey]();
      },
    });
  }
}

export function BindAsList<
  Data extends ListItemBase,
  AddData,
  UpdateData,
  ItemKey,
>(
  dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>,
  reversed: boolean = false,
  subscribe: boolean = true,
): PropertyDecorator {
  return bind(
    (parent: Vue, propertyKey: string) => new ListWrapper(dao, reversed, parent, propertyKey),
    subscribe,
  );
}

export class ObjectWrapper<Data, UpdateData> implements Wrapper<Data> {
  private dao: ObjectDAO<Data, UpdateData>;
  private parent: Vue;
  private propertyKey: string;

  constructor(dao: ObjectDAO<Data, UpdateData>, parent: Vue, propertyKey: string) {
    this.dao = dao;
    this.parent = parent;
    this.propertyKey = propertyKey;
  }

  async subscribe(): Promise<Unsubscribe> {
    const unsubscribe = await this.dao.subscribe((data) => {
      (this.parent as any)[this.propertyKey] = data;
    });
    return unsubscribe;
  }
}

export function BindAsObject<Data, UpdateData>(
  dao: ObjectDAO<Data, UpdateData>,
  subscribe: boolean = true,
): PropertyDecorator {
  return bind(
    (parent: Vue, propertyKey: string) => new ObjectWrapper(dao, parent, propertyKey),
    subscribe,
  );
}
