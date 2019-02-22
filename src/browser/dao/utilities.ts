import chunk from 'lodash/chunk';
import PathElement from '@/browser/backend/PathElement';
import CollectionPath from '@/browser/backend/CollectionPath';
import router from '@/browser/router';

export function parseItemPath(path: string): PathElement[] {
  const splitted = path.split(/\//g);
  if (splitted.length % 2) throw new Error('The length of the path must be a multiple of 2');

  return chunk(splitted, 2).map(([collection, id]) => ({ collection, id }));
}

export function parseCollectionPath(path: string): CollectionPath {
  const m = path.match(/^(.*)\/(.*?)$/);
  if (!m || m.length !== 3) throw new Error('Invalid path pattern');

  const [_, parentPath, collection] = m;

  return {
    parentPath: parseItemPath(parentPath),
    collection,
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
