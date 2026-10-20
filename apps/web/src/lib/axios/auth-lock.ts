export type AuthLock = <T>(operation: () => Promise<T>) => Promise<T>;

// Keep local operations ordered even when the browser has no Web Locks API.
export function createAuthLock(requestBrowserLock?: AuthLock): AuthLock {
  let tail: Promise<unknown> = Promise.resolve();
  return <T>(operation: () => Promise<T>): Promise<T> => {
    const task = tail.then(() =>
      requestBrowserLock ? requestBrowserLock(operation) : operation(),
    );
    tail = task.catch(() => undefined);
    return task;
  };
}
