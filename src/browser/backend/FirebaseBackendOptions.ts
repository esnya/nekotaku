import firebase from 'firebase';
import BackendOptions from '@/browser/backend/BackendOptions';

export default interface FirebaseBackendOptions extends BackendOptions {
  firebase?: firebase.app.App;
}
