declare module 'firebase-mock' {
  export class MockAuthentication {
    autoFlush(): void;
  }
  export class MockFirebase {
    autoFlush(): void;
    child(path: string): MockFirebase;
  }
  export class MockStorage {}
  export class MockFirebaseSdk {
    constructor(
      db: (path?: string) => MockFirebase,
      auth: () => MockAuthentication,
      a: () => null,
      storage: () => MockStorage,
      c: () => null,
    );
  }
}
