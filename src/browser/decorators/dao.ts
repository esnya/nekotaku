/* eslint no-param-reassign: off */

import Model from '@/models/Model';
import DAO from '../dao/DAO';
import Unsubscribe from '../backend/Unsubscribe';

interface ListOptions {
  reverse?: boolean;
}

function bind<T>(
  subscribe: (component: any, propertyKey: string) => Promise<Unsubscribe>,
  initialize: () => T,
) {
  return (prototype: any, propertyKey: string) => {
    const unsubscribeKey = Symbol('unsubscribe');

    const originalCreated = prototype.created;
    const originalDestroyed = prototype.destroyed;
    Object.defineProperties(prototype, {
      [propertyKey]: {
        value: initialize(),
      },
      created: {
        async value(): Promise<void> {
          if (originalCreated) {
            const result = originalCreated.call(this);
            if (result instanceof Promise) await result;
          }

          this[propertyKey] = initialize();
          this[unsubscribeKey] = await subscribe(this, propertyKey);
        },
      },
      destroyed: {
        async value(): Promise<void> {
          if (originalDestroyed) originalDestroyed.call(this);
        },
      },
    });
  };
}

export function BindAsList<CollectionKey, ItemKey, Add, Update, Value extends Model>(
  dao: DAO<CollectionKey, ItemKey, Add, Update, Value>,
  options: ListOptions = {},
) {
  return bind((component: any, propertyKey: string) => dao.subscribeChild(
    (value: Value) => {
      if (options.reverse) component[propertyKey].unshift(value);
      else component[propertyKey].push(value);
    },
    (value: Value) => {
      component[propertyKey] = component[propertyKey]
        .map((item: Value) => (item.id === value.id ? value : item));
    },
    (id: string) => {
      component[propertyKey] = component[propertyKey].filter((item: Value) => item.id !== id);
    },
    typeof component.getCollectionKey === 'function' ? component.getCollectionKey() : null,
  ), () => []);
}

export function BindAsObject<CollectionKey, ItemKey, Add, Update, Value extends Model>(
  dao: DAO<CollectionKey, ItemKey, Add, Update, Value>,
) {
  return bind((component: any, propertyKey: string) => dao.subscribeValue(
    (value: Value | null) => {
      component[propertyKey] = value;
    },
    typeof component.getItemKey === 'function' ? component.getItemKey() : null,
  ), () => null);
}
