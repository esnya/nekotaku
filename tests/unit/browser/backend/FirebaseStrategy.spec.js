import firebase from '@firebase/app';
import { stub } from 'sinon';
import FirebaseStrategy from '@/browser/backend/FirebaseStrategy';
import * as FirebaseMock from '../../mocks/firebase';
import runBackendTest from './runBackendTest';

describe('FirebaseBackend', () => {
  Object.keys(FirebaseMock).forEach((key) => {
    stub(firebase, key).callsFake(FirebaseMock[key]);
  });

  beforeEach(() => new Promise(resolve => setTimeout(resolve)));
  runBackendTest(FirebaseStrategy, { type: 'firebase' });
});
