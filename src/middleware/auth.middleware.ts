import { routerPagesNames } from '@models';
import { Middleware } from '@nuxt/types';
import { AuthModule } from '@store';

export const authMiddleware: Middleware = async ({ redirect, route }) => {
  if (!AuthModule.state.loggedIn) {
    // AuthModule.updateState({ showProfilePicker: true });
  }
};
