/**
 * Custom Error class when local storage is not available.
 */
export class NoLocalStorageError extends Error {
  /**
   * Constructor for the custom error class.
   */
  constructor() {
    super('LocalStorage is not available');
    this.name = this.constructor.name;
  }
}

export const noLocalStorageError = new NoLocalStorageError();

/**
 * Function to set data to local storage.
 * @param msgKey The id of the message to get from local storage.
 * @param msgContent The content of the message to set to local storage.
 */
export function setDataToLocalStorage(msgKey: string, msgContent: string) {
  if (localStorage) {
    localStorage.setItem(msgKey, msgContent);
  } else {
    console.error(noLocalStorageError);
  }
}

/**
 * Function to get data from local storage.
 * @param msgKey The id of the message to get from local storage.
 * @returns
 */
export function getDataFromLocalStorage(msgKey: string): string | null {
  if (!localStorage) console.error(noLocalStorageError);

  const data = localStorage.getItem(msgKey);
  if (data) {
    return data;
  } else {
    return null;
  }
}
