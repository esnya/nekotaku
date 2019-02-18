import shortid from 'shortid';
import { Vue } from 'vue-property-decorator';
import { Unsubscribe } from 'firebase';
import ListDAOBase, { ListItemBase } from '../dao/ListDAOBase';
import PropertyDecorator from './PropertyDecorator';
import ObjectDAO from '../dao/ObjectDAO';

interface Wrapper<T> {
  subscribe(): Promise<Unsubscribe>;
  getData(): T;
}

export class ListWrapper<
  Data extends ListItemBase,
  AddData,
  UpdateData,
  ItemKey,
> implements Wrapper<Data[]> {
  private data: Data[] = [];
  private dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>;
  private reversed: boolean;
  private parent: Vue;

  constructor(
    dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>,
    reversed: boolean,
    parent: Vue,
  ) {
    this.dao = dao;
    this.reversed = reversed;
    this.parent = parent;
  }

  getData(): Data[] {
    return this.data;
  }

  async subscribe(): Promise<Unsubscribe> {
    const unsubscribe = await this.dao.subscribe(
      (data: Data) => {
        if (this.reversed) this.data.unshift(data);
        else this.data.push(data);
        this.parent.$forceUpdate();
      },
      (data: Data) => {
        const index = this.data.findIndex(item => item.id === data.id);
        if (index < 0) return;
        this.data[index] = data;
        this.parent.$forceUpdate();
      },
      (data: Data) => {
        const index = this.data.findIndex(item => item.id === data.id);
        if (index < 0) return;
        for (let i = index; i < this.data.length; i += 1) {
          this.data[i] = this.data[i + 1];
        }
        this.data.length -= 1;
        this.parent.$forceUpdate();
      },
    );
    return unsubscribe;
  }
}

function bind<T>(createWrapper: (parent: Vue) => Wrapper<T>, subscribe: boolean) {
  const wrapperKey = shortid();
  const unsubscribeKey = shortid();

  return (target: any, propertyKey: string) => {
    const { created, destroyed } = target;

    Object.defineProperty(target, propertyKey, {
      get(): T {
        return (this[wrapperKey] as Wrapper<T>).getData();
      },
    });

    Object.defineProperty(target, 'created', {
      value() {
        if (created) created.call(this);

        const wrapper = createWrapper(this);
        Object.defineProperty(this, wrapperKey, {
          get: () => wrapper,
        });

        if (subscribe) {
          let unsubscribe: Unsubscribe = () => Promise.reject();
          (this[wrapperKey] as Wrapper<T>).subscribe().then((u: Unsubscribe) => {
            unsubscribe = u;
          });
          Object.defineProperty(this, unsubscribeKey, {
            get() {
              return unsubscribe;
            },
          });
        }
      },
    });

    Object.defineProperty(target, 'destroyed', {
      value() {
        if (destroyed) destroyed.call(this);
        if (unsubscribeKey in this) this[unsubscribeKey].unsubscribe();
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
  return bind((parent: Vue) => new ListWrapper(dao, reversed, parent), subscribe);
}

export class ObjectWrapper<Data, UpdateData> implements Wrapper<Data | null> {
  private data: Data | null = null;
  private dao: ObjectDAO<Data, UpdateData>;
  private parent: Vue;

  constructor(dao: ObjectDAO<Data, UpdateData>, parent: Vue) {
    this.dao = dao;
    this.parent = parent;

    return new Proxy(this, {
      get: () => this.data,
    });
  }

  getData(): Data | null {
    return this.data;
  }

  async subscribe(): Promise<Unsubscribe> {
    const unsubscribe = await this.dao.subscribe((data) => {
      this.data = data;
      this.parent.$forceUpdate();
    });
    return unsubscribe;
  }
}

export function BindAsObject<Data, UpdateData>(
  dao: ObjectDAO<Data, UpdateData>,
  subscribe: boolean = true,
): PropertyDecorator {
  return bind((parent: Vue) => new ObjectWrapper(dao, parent), subscribe);
}
