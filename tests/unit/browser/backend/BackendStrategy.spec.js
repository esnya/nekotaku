import BackendStrategy from '@/browser/backend/BackendStrategy';

describe('BackendStrategy', () => {
  const strategy = new BackendStrategy({ type: 'test' });
  (Object.getOwnPropertyNames(BackendStrategy.prototype))
    .filter(key => key !== 'constructor')
    .forEach((key) => {
      describe(key, () => {
        it('shhould be abstract method', async () => {
          await strategy[key]().then(
            () => {
              throw new Error('Should not be resolved');
            },
            () => {},
          );
        });
      });
    });
});
