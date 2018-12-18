export default async function check(
  path: string,
  mode: string,
  userId: string,
  get: string => Promise<any>,
): Boolean {
  const [
    model,
    roomId,
    childId,
  ] = path.split(/\//g);

  switch (model) {
    case 'rooms':
      if (mode === 'read' && !roomId) return true;
      if (mode === 'write' && roomId && !await get(`rooms/${roomId}`)) return true;
      break;
    case 'members':
      if (
        mode === 'write'
        && childId === userId
        && (!await get(`rooms/${roomId}/password`) || await get(`rooms/${roomId}/password`) === await get(`passwords/${roomId}/${userId}`))
      ) return true;
      break;
    case 'passwords':
      if (mode === 'write' && childId === userId) return true;
      break;
    default:
      break;
  }
  if (roomId && await get(`members/${roomId}/${userId}`)) return true;

  return false;
}
