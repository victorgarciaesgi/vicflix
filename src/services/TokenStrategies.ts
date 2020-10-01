const Strategy = process.env.NUXT_ENV_TOKEN_STRATEGY;
const tokenKey = 'access_token';

export const setToken = (token: string) => {
  if (Strategy === 'jwt') {
    localStorage.setItem(tokenKey, token);
  } else {
    $nuxt.$cookies.set(tokenKey, token);
  }
};
export const getToken = (): string | null => {
  if (Strategy === 'jwt') {
    return localStorage.getItem(tokenKey);
  } else {
    return $nuxt.$cookies.get(tokenKey);
  }
};

export const clearToken = async () => {
  if (Strategy === 'jwt') {
    localStorage.removeItem(tokenKey);
  } else {
    $nuxt.$cookies.remove(tokenKey);
  }
};
