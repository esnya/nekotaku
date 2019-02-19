import BackendOptions from '@/browser/backend/BackendOptions';
import firebase from 'firebase';

export default interface FirebaseBackendOptions extends BackendOptions {
  firebase?: firebase.app.App;
}
