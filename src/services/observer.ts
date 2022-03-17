type TCallback<T> = (value: T) => void;

class Observer<T> {
  private callbacks: TCallback<T>[] = [];

  public subscribe(callback: TCallback<T>) {
    if (this.callbacks.some((cb) => cb === callback)) return;

    this.callbacks.push(callback);
  }

  public unsubscribe(callback: TCallback<T>) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  protected notifyAll(value: T) {
    this.callbacks.forEach((cb) => {
      cb(value);
    })
  }
}

class ObserverStatic {
  private static callbacks: TCallback<any>[] = [];

  public static subscribe(callback: TCallback<any>) {
    if (this.callbacks.some((cb) => cb === callback)) return;

    this.callbacks.push(callback);
  }

  public static unsubscribe(callback: TCallback<any>) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  protected static notifyAll<T>(value: T) {
    this.callbacks.forEach((cb) => {
      cb(value);
    })
  }
}

export default Observer;

export {
  ObserverStatic,
};
