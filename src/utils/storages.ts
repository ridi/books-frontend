class StorageFactory {
  storage: typeof window.localStorage | typeof window.sessionStorage;

  constructor(storage: 'localStorage' | 'sessionStorage') {
    this.storage = window[storage];
  }

  key(index: number): string | null {
    try {
      return this.storage.key(index);
    } catch (e) {
      return null;
    }
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      return this.storage.setItem(key, value);
    } catch (e) {
      return undefined;
    }
  }

  removeItem(key: string): void {
    try {
      return this.storage.removeItem(key);
    } catch (e) {
      return undefined;
    }
  }

  clear(): void {
    try {
      return this.storage.clear();
    } catch (e) {
      return undefined;
    }
  }
}

export const localStorage = new StorageFactory('localStorage');
export const sessionStorage = new StorageFactory('sessionStorage');
