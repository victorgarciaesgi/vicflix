<template>
  <transition name="hide">
    <ul v-show="notificationList.length" id="notifications-container" list>
      <transition-group name="notification">
        <component
          :is="isLink(notification)"
          v-for="notification in notificationList"
          :key="notification.id"
          :to="notification.link"
          :type="notification.type"
          class="notification"
        >
          <div v-if="notification.type !== 'action'" class="notification-icon">
            <Spinner v-if="notification.loading" color="green" :size="20" />
            <SvgIcon
              v-else-if="notification.type === 'success'"
              :size="24"
              src="icons/notifications/success.svg"
              color="green"
            />
            <SvgIcon
              v-else-if="notification.type === 'error'"
              :size="24"
              src="icons/notifications/error.svg"
              color="red"
            />
            <SvgIcon
              v-else-if="notification.type === 'warning'"
              :size="24"
              color="orange"
              src="icons/notifications/warning.svg"
            />
            <SvgIcon v-else :size="24" src="icons/notifications/infos.svg" color="currentColor" />
          </div>
          <div v-if="notification.type === 'action'" class="center flex flex-col w-full py-2 pl-4">
            <div class="notification-text px-4">
              <span class="text-base">{{ notification.message }}</span>
            </div>

            <div v-if="notification.action" class="flex justify-end mt-5">
              <Action theme="red" size="md" :handler="() => executeAction(notification)">{{
                notification.action.actionMessage
              }}</Action>
            </div>
          </div>
          <div
            v-else
            class="notification-text flex flex-col flex-no-wrap items-center justify-center max-h-full"
          >
            <span class="flex-0">{{ notification.message }}</span>
            <div
              v-if="isTesting && notification.error"
              class="bg-bg3 flex flex-1 max-w-full mt-3 overflow-auto"
            >
              <pre class="max-w-full p-2 text-left whitespace-pre-wrap rounded">{{
                notification.error
              }}</pre>
            </div>
            <div
              v-if="isTesting && notification.error"
              class="center flex flex-row justify-around w-full py-2"
            >
              <Action theme="red" size="sm" @click="copyError(notification)"
                >Copier l'erreur</Action
              >
              <Action
                to="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="blank"
                size="sm"
                external-link
                class="ml-2"
                >Frapper les devs</Action
              >
            </div>
          </div>

          <div
            v-if="notification.type !== 'action'"
            class="notification-quit"
            @click.prevent="deleteNotification(notification)"
          >
            <SvgIcon :size="24" src="icons/notifications/quit.svg" color="currentColor" />
          </div>
        </component>
      </transition-group>
    </ul>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { NotificationsModule } from '@store';
import { IToastNotification } from '@models';
import { isTesting } from '@constants';

@Component({})
export default class NotificationsList extends Vue {
  get notificationList() {
    return NotificationsModule.state.notificationList;
  }

  get isTesting() {
    return isTesting;
  }

  get isLink() {
    return (notif: IToastNotification) => {
      if (notif.link) {
        return 'nuxt-link';
      }
      return 'li';
    };
  }

  copyError(notif: IToastNotification) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(notif.error));
      this.$toast.success("Erreur copiée! Let's go debugguer!");
    }
  }

  async executeAction(notification: IToastNotification) {
    if (notification.action) {
      await notification.action.trigger();
    }
    NotificationsModule.mutations.deleteNotification(notification);
  }
}
</script>

<style lang="postcss" scoped>
ul#notifications-container {
  position: fixed;
  top: var(--headerHeight);
  left: 0px;
  padding: 7px;
  width: 380px;
  max-width: 100%;
  height: auto;
  z-index: 10001;
  display: flex;
  flex-direction: column-reverse;

  .notification {
    position: relative;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    margin-bottom: 5px;
    padding: 13px 0px 13px 0px;
    box-shadow: 0 0 10px var(--shadow);
    font-size: 14px;
    color: var(--text1);
    text-align: center;
    font-weight: bold;
    border-radius: 3px;
    background-color: var(--bg1);
    line-height: 17px;
    border: 1px solid var(--bg4);
    max-height: 250px;

    > div {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: center;

      &.notification-text {
        flex: 1 1 auto;
      }
      &.notification-icon {
        width: 50px;
        flex: 0 0 auto;
        img {
          height: 27px;
          width: 27px;
        }
      }

      &.notification-quit {
        width: 50px;
        cursor: pointer;
        flex: 0 0 auto;

        img {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
}

.hide-leave-active {
  transition: all 0.6s;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(-130%);
}

.notification-enter {
  opacity: 0;
  transform: translateX(-100%);
}

.notification-enter-to {
  transform: translateX(0);
}
</style>
