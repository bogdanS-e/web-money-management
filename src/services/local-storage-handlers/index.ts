import { createLocalStorageInstance } from './base-local-storage-handler';
import { FieldName } from './types';

const storage = {
  emailAutocomplete: createLocalStorageInstance<string[]>({ key: FieldName.RecipientEmails }),
};

export default storage;
