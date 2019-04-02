import { IProfil } from '@models';
import localforage from 'localforage';

const PROFILE_KEY = 'vicflix-profil';

export const storeProfile = async (profil: IProfil) => {
  return await localforage.setItem(PROFILE_KEY, profil);
};

export const getProfile = async () => {
  return await localforage.getItem<IProfil>(PROFILE_KEY);
};

export const deleteProfile = async () => {
  return await localforage.removeItem(PROFILE_KEY);
};
