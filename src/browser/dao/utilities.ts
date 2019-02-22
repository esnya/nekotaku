import chunk from 'lodash/chunk';
import PathElement from '@/browser/backend/PathElement';
import CollectionPath from '@/browser/backend/CollectionPath';
import router from '@/browser/router';

function arrayToPath(splitted: string[]): PathElement[] {
  if (splitted.length % 2 === 1) throw new Error('The length of the path must be a multiple of 2');
  return chunk(splitted, 2).map(([collection, id]) => ({ collection, id }));
}

export function parseItemPath(path: string): PathElement[] {
  const splitted = path.split(/\//g);
  return arrayToPath(splitted);
}

export function parseCollectionPath(path: string): CollectionPath {
  const splitted = path.split(/\//g);
  if (splitted.length % 2 === 0) throw new Error('The length of the path must be a multiple of 2 + 1');

  return {
    parentPath: arrayToPath(splitted.slice(0, -1)),
    collection: splitted[splitted.length - 1],
  };
}

export function concatItemId(path: CollectionPath, id: string): PathElement[] {
  const {
    parentPath,
    collection,
  } = path;

  return [
    ...parentPath,
    {
      collection,
      id,
    },
  ];
}

export function getRoomId(): string {
  const { roomId } = router.currentRoute.params;
  if (!roomId) throw new Error('Have not joined the room');
  return roomId;
}
