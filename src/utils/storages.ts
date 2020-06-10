class StorageFactory {
  storage?: Storage;

  inMemory: { [key: string]: string } = {};

  constructor(storage: 'localStorage' | 'sessionStorage') {
    try {
      this.storage = window[storage];
    } catch {
      this.storage = undefined;
    }
  }

  public key(index: number): string | null {
    if (this.storage) {
      return this.storage.key(index);
    }
    return Object.keys(this.inMemory)[index] || null;
  }

  public getItem(key: string): string | null {
    if (this.storage) {
      return this.storage.getItem(key);
    }
    return Object.prototype.hasOwnProperty.call(this.inMemory, key) ? this.inMemory[key] : null;
  }

  public setItem(key: string, value: string): void {
    if (this.storage) {
      return this.storage.setItem(key, value);
    }
    this.inMemory[key] = String(value);
  }

  public removeItem(key: string): void {
    if (this.storage) {
      return this.storage.removeItem(key);
    }
    delete this.inMemory[key];
  }

  public clear(): void {
    if (this.storage) {
      return this.storage.clear();
    }
    this.inMemory = {};
  }
}

export const localStorage = new StorageFactory('localStorage');
export const sessionStorage = new StorageFactory('sessionStorage');
