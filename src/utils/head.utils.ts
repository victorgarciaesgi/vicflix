import { MetaInfo } from 'vue-meta';

export const createHeadInfos = (data: MetaInfo | (() => MetaInfo)) => {
  return {
    head: data,
    meta: typeof data === 'function' ? data.call(this) : data,
  };
};
