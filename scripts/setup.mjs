import { copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const api = new URL('../apps/api/', import.meta.url);

try {
  await copyFile(new URL('.env.example', api), new URL('.env', api), constants.COPYFILE_EXCL);
  console.log('Created apps/api/.env');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Found apps/api/.env');
}
