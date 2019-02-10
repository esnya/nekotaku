export default async function check(
  path: string,
  mode: string,
  userId: string,
  get: (path: string) => Promise<any>,
): Promise<boolean> {
  const [
    model,
    roomId,
    childId,
  ] = path.split(/\//g);

  const room = roomId && (await get(`rooms/${roomId}`) as { password?: string } | null);
  const roomPassword = room && room.password;
  const password = roomId && (await get(`passwords/${roomId}/${userId}/password`) as string | null);

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
        && (!roomPassword || roomPassword === password)
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
