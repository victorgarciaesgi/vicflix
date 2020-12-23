import { ObjectLiteral, QueryWithArgs } from '@models';
import { getCurrentInstance, useAsync, useContext, useFetch, Ref } from '@nuxtjs/composition-api';
import { PaginationModule } from '@store';
import { Location } from 'vue-router';
import { ModuleToInstance } from 'vuex-typed-modules';
import { useModule } from './useModule';

/** @deprecated */
export function useFetchFromUuid<TType extends any, TArgs extends any>({
  query,
  module,
  redirectLink,
}: {
  query: QueryWithArgs<TType, TArgs>;
  redirectLink?: Location;
  module?: ModuleToInstance<typeof PaginationModule>;
}) {
  // const { params, redirect, toast } = useContext();
  // const result = useAsync<TType>(async () => {
  //   try {
  //     const sgtsQuery = query.$args({ uuid: params.value.uuid } as any);
  //     if (module) {
  //       const pModule = useModule(module);
  //       const existingData = pModule.state.results.find((f) => f.uuid === params.value.uuid);
  //       if (existingData) {
  //         return existingData;
  //       } else {
  //         return await sgtsQuery.$fetch();
  //       }
  //     } else {
  //       return await sgtsQuery.$fetch();
  //     }
  //   } catch (e) {
  //     toast.error({ e, message: `Error on query ${query.__name}` });
  //     if (redirectLink) {
  //       redirect(redirectLink);
  //     }
  //     return Promise.reject(e);
  //   }
  // });
  // return {
  //   result: result as Ref<TType>,
  // };
}
