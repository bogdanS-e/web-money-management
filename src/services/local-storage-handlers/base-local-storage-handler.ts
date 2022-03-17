import Observer from "../observer";

interface IOptions {
  key: string;
}

class BaseLocalStorageHandler<T> extends Observer<T | null> {
  private key: string;

  private value: T | null = null;

  constructor(options: IOptions) {
    super();

    this.key = options.key;

    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key !== this.key) return;

      if (event.newValue === null) {
        this.remove();
      } else {
        this.set(this.deserialize(event.newValue));
      }
    }, false);
  }

  get(): T | null {
    if (this.value) return this.value;

    const value = localStorage.getItem(this.getKey());

    const parsedValue = value !== null ? this.deserialize(value) : null;

    this.value = parsedValue;

    return parsedValue;
  }

  set(value: T) {
    this.value = value;

    localStorage.setItem(this.getKey(), this.serialize(value));

    this.notifyAll(value);
  }

  remove() {
    this.value = null;

    localStorage.removeItem(this.getKey());

    this.notifyAll(null);
  }

  private getKey(): string {
    return this.key;
  }

  protected deserialize(value: string): T {
    try {
      const parsedValue = JSON.parse(value);

      return parsedValue as T;
    } catch (e) {
      return value as unknown as T;
    }
  }

  protected serialize(value: T) {
    return JSON.stringify(value);
  }
}

export default BaseLocalStorageHandler;

const createLocalStorageInstance = <T>(options: IOptions) => {
  return new BaseLocalStorageHandler<T>(options);
};

export {
  createLocalStorageInstance
};  
export type { IOptions };

