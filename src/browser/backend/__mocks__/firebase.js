import { MockFirebaseSdk } from 'firebase-mock';

const mockUser = {
  uid: 'test-uid',
};
const mockAuth = {
  signInAnonymously: jest.fn(),
  onAuthStateChanged: jest.fn(callback => callback(mockUser)),
};
const storageMock = {
};
module.exports = {
  ...MockFirebaseSdk(),
  auth: jest.fn().mockReturnValue(mockAuth),
  storage: jest.fn().mockReturnValue(storageMock),
};
