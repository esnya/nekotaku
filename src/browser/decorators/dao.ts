import { Unsubscribe } from 'firebase';
import { Vue } from 'vue-property-decorator';
import ListDAOBase, { ListItemBase } from '../dao/ListDAOBase';
import ObjectDAO from '../dao/ObjectDAO';
import PropertyDecorator from './PropertyDecorator';

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
  private parent: any;
  private propertyKey: string;

  constructor(
    dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>,
    reversed: boolean,
    parent: any,
    propertyKey: string,
  ) {
    this.dao = dao;
    this.reversed = reversed;
    this.parent = parent;
    this.propertyKey = propertyKey;
  }

  async subscribe(): Promise<Unsubscribe> {
    this.parent[this.propertyKey] = [];
    const unsubscribe = await this.dao.subscribe(
      (data: Data) => {
        if (this.reversed) this.parent[this.propertyKey].unshift(data);
        else this.parent[this.propertyKey].push(data);
      },
      (data: Data) => {
        const index = this.parent[this.propertyKey].findIndex((item: Data) => item.id === data.id);
        if (index < 0) return;
        this.parent[this.propertyKey][index] = data;
      },
      (data: Data) => {
        const index = this.parent[this.propertyKey].findIndex((item: Data) => item.id === data.id);
        if (index < 0) return;
        for (let i = index; i < this.parent[this.propertyKey].length; i += 1) {
          this.parent[this.propertyKey][i] = this.parent[this.propertyKey][i + 1];
        }
        this.parent[this.propertyKey].length -= 1;
      },
    );
    return unsubscribe;
  }
}

function bind<T>(
  createWrapper: (parent: Vue, propertyKey: string) => Wrapper<T>,
  subscribe: boolean,
) {
  return (target: any, propertyKey: string) => {
    const wrapperKey = Symbol('Wrapper');
    const unsubscribeKey = Symbol('Unsubscribe');

    const { created, destroyed } = target;

    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      value: null,
    });

    Object.defineProperty(target, 'created', {
      configurable: true,
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
      configurable: true,
      enumerable: true,
      writable: false,
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
