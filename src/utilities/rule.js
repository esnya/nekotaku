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

  const room = roomId && await get(`rooms/${roomId}`);
  const password = roomId && await get(`passwords/${roomId}/${userId}`);

  switch (model) {
    case 'rooms':
      if (mode === 'read' && !roomId) return true;
      if (mode === 'write' && roomId && !room) return true;
      break;
    case 'members':
      if (
        mode === 'write'
        && childId === userId
        && room
        && (!room.password || room.password === password)
      ) return true;
      break;
    case 'passwords':
      if (mode === 'write' && childId === userId && roomId) return true;
      break;
    default:
      break;
  }
  if (room && await get(`members/${roomId}/${userId}`)) return true;

  return false;
}
