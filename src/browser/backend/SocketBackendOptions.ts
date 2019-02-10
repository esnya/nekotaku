import BackendOptions from '@/browser/backend/BackendOptions';

export default interface SocketBackendOptions extends BackendOptions {
  socket?: SocketIOClient.Socket;
}
