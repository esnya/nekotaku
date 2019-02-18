import ObjectDAO from './ObjectDAO';

export default async function bindAsObject<Data, UpdateData>(
  dao: ObjectDAO<Data, UpdateData>,
  write: (data: Data | null) => void,
): Promise<() => Promise<void>> {
  const unsubscribe = await dao.subscribe(
    (updatedData: Data | null) => write(updatedData),
  );
  return unsubscribe;
}
