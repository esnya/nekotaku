import { FirebaseApp } from '@firebase/app-types';
import BackendOptions from '@/browser/backend/BackendOptions';

export default interface FirebaseBackendOptions extends BackendOptions {
  firebase?: FirebaseApp;
}
