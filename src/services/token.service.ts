import { User } from '@models';
import localForage from 'localforage';

const tokenKey = 'user';

export function setToken(user: User): void {
  localForage.setItem(tokenKey, user);
}
export function getToken() {
  return localForage.getItem<User>(tokenKey);
}

export function clearToken() {
  return localForage.removeItem(tokenKey);
}
