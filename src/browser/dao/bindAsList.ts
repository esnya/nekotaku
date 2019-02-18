import ListDAOBase, { ListItemBase } from './ListDAOBase';

export default async function bindAsList<
  Data extends ListItemBase,
  AddData,
  UpdateData,
  ItemKey,
>(
  dao: ListDAOBase<Data, AddData, UpdateData, ItemKey>,
  write: (data: Data[]) => void,
  reverse: boolean = false,
): Promise<() => Promise<void>> {
  let data: Data[] = [];

  const unsubscribe = await dao.subscribe(
    (addedData: Data) => {
      data = reverse ? [
        addedData,
        ...data,
      ] : [
        ...data,
        addedData,
      ];
      write(data);
    },
    (changedData: Data) => {
      data = data.map(
        (item: Data) => (item.id === changedData.id ? changedData : item),
      );
      write(data);
    },
    (removedData: Data) => {
      data = data.filter(
        (item: Data) => item.id !== removedData.id,
      );
      write(data);
    },
  );
  return unsubscribe;
}
